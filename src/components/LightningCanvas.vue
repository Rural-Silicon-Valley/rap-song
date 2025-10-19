<template>
  <canvas ref="canvasRef" class="lightning-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  hue: { type: Number, default: 220 },
  xOffset: { type: Number, default: 0 },
  speed: { type: Number, default: 1 },
  intensity: { type: Number, default: 1 },
  size: { type: Number, default: 1 },
  followPointer: { type: Boolean, default: true },
  pulse: { type: Boolean, default: true },
  hueRange: { type: Number, default: 40 },
  intensityRange: { type: Number, default: 0.45 }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

let frameId: number | null = null
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let vertexBuffer: WebGLBuffer | null = null
let startTime = 0
let resizeHandler: (() => void) | null = null
let pointerMoveHandler: ((event: PointerEvent) => void) | null = null
let pointerLeaveHandler: (() => void) | null = null
const pointerTarget = { x: 0, y: 0 }
const pointerCurrent = { x: 0, y: 0 }
let pointerStrength = 0

const uniformLocations: Record<string, WebGLUniformLocation | null> = {
  iResolution: null,
  iTime: null,
  uHue: null,
  uXOffset: null,
  uSpeed: null,
  uIntensity: null,
  uSize: null
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const { clientWidth, clientHeight } = canvas
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    canvas.width = clientWidth
    canvas.height = clientHeight
  }
}

const compileShader = (source: string, type: number) => {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float uHue;
  uniform float uXOffset;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uSize;
  
  #define OCTAVE_COUNT 10

  vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z * mix(vec3(1.0), rgb, c.y);
  }

  float hash11(float p) {
      p = fract(p * .1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
  }

  float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }

  mat2 rotate2d(float theta) {
      float c = cos(theta);
      float s = sin(theta);
      return mat2(c, -s, s, c);
  }

  float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 fp = fract(p);
      float a = hash12(ip);
      float b = hash12(ip + vec2(1.0, 0.0));
      float c = hash12(ip + vec2(0.0, 1.0));
      float d = hash12(ip + vec2(1.0, 1.0));
      
      vec2 t = smoothstep(0.0, 1.0, fp);
      return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
  }

  float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      vec2 uv = fragCoord / iResolution.xy;
      uv = 2.0 * uv - 1.0;
      uv.x *= iResolution.x / iResolution.y;
      uv.x += uXOffset;
      
      uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
      
      float dist = abs(uv.x);
      vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
      vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
      col = pow(col, vec3(1.0));
      fragColor = vec4(col, 1.0);
  }

  void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`

const cleanup = () => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  const canvas = canvasRef.value
  if (canvas) {
    if (pointerMoveHandler) {
      canvas.removeEventListener('pointermove', pointerMoveHandler)
      pointerMoveHandler = null
    }
    if (pointerLeaveHandler) {
      canvas.removeEventListener('pointerleave', pointerLeaveHandler)
      pointerLeaveHandler = null
    }
  }
  if (gl) {
    if (vertexBuffer) {
      gl.deleteBuffer(vertexBuffer)
      vertexBuffer = null
    }
    if (program) {
      gl.deleteProgram(program)
      program = null
    }
  }
  gl = null
}

const init = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  gl = canvas.getContext('webgl')
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)

  if (!vertexShader || !fragmentShader) {
    return
  }

  program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program))
    cleanup()
    return
  }

  gl.useProgram(program)

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ])

  vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) return
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  uniformLocations.iResolution = gl.getUniformLocation(program, 'iResolution')
  uniformLocations.iTime = gl.getUniformLocation(program, 'iTime')
  uniformLocations.uHue = gl.getUniformLocation(program, 'uHue')
  uniformLocations.uXOffset = gl.getUniformLocation(program, 'uXOffset')
  uniformLocations.uSpeed = gl.getUniformLocation(program, 'uSpeed')
  uniformLocations.uIntensity = gl.getUniformLocation(program, 'uIntensity')
  uniformLocations.uSize = gl.getUniformLocation(program, 'uSize')

  startTime = performance.now()

  pointerMoveHandler = (event: PointerEvent) => {
    if (!canvas || !props.followPointer) return
    const rect = canvas.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width
    const ny = (event.clientY - rect.top) / rect.height
    pointerTarget.x = (nx - 0.5) * 2
    pointerTarget.y = (ny - 0.5) * -2
    pointerStrength = Math.min(pointerStrength + 0.07, 1)
  }

  pointerLeaveHandler = () => {
    pointerTarget.x = 0
    pointerTarget.y = 0
    pointerStrength *= 0.18
  }

  resizeCanvas()
  resizeHandler = () => resizeCanvas()
  window.addEventListener('resize', resizeHandler)
  if (pointerMoveHandler) {
    canvas.addEventListener('pointermove', pointerMoveHandler)
  }
  if (pointerLeaveHandler) {
    canvas.addEventListener('pointerleave', pointerLeaveHandler)
  }

  const render = () => {
    if (!gl || !canvas) return
    resizeCanvas()
    gl.viewport(0, 0, canvas.width, canvas.height)

    if (uniformLocations.iResolution) {
      gl.uniform2f(uniformLocations.iResolution, canvas.width, canvas.height)
    }

  const currentTime = performance.now()
  const elapsed = (currentTime - startTime) / 1000

  pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.15
  pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.15
  pointerStrength = Math.max(pointerStrength * 0.93, props.followPointer ? 0.018 : 0)

  const hueShift = props.hueRange * pointerCurrent.x * pointerStrength
  const intensityBoost = props.intensityRange * Math.abs(pointerCurrent.y) * pointerStrength
  const pulseWave = props.pulse ? (Math.sin(elapsed * 0.9) + 1) * 0.5 : 0

    if (uniformLocations.iTime) {
      gl.uniform1f(uniformLocations.iTime, elapsed)
    }
    if (uniformLocations.uHue) {
      gl.uniform1f(uniformLocations.uHue, props.hue + hueShift)
    }
    if (uniformLocations.uXOffset) {
  gl.uniform1f(uniformLocations.uXOffset, props.xOffset + pointerCurrent.x * 0.16)
    }
    if (uniformLocations.uSpeed) {
  gl.uniform1f(uniformLocations.uSpeed, props.speed + pulseWave * 0.32)
    }
    if (uniformLocations.uIntensity) {
  gl.uniform1f(uniformLocations.uIntensity, props.intensity + intensityBoost + pulseWave * 0.24)
    }
    if (uniformLocations.uSize) {
      gl.uniform1f(uniformLocations.uSize, props.size)
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6)
    frameId = requestAnimationFrame(render)
  }

  frameId = requestAnimationFrame(render)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.lightning-canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: clamp(18px, 3vw, 28px);
  background: rgba(7, 9, 18, 0.65);
}
</style>
