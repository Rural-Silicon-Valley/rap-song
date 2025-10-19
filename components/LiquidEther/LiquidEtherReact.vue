<template>
  <div ref="mountRef" class="liquid-ether-container w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  mouseForce: { type: Number, default: 20 },
  cursorSize: { type: Number, default: 100 },
  isViscous: { type: Boolean, default: false },
  viscous: { type: Number, default: 30 },
  iterationsViscous: { type: Number, default: 32 },
  iterationsPoisson: { type: Number, default: 32 },
  dt: { type: Number, default: 0.014 },
  BFECC: { type: Boolean, default: true },
  resolution: { type: Number, default: 0.5 },
  isBounce: { type: Boolean, default: false },
  colors: { type: Array, default: () => ['#5227FF', '#FF9FFC', '#B19EEF'] },
  autoDemo: { type: Boolean, default: true },
  autoSpeed: { type: Number, default: 0.5 },
  autoIntensity: { type: Number, default: 2.2 },
  takeoverDuration: { type: Number, default: 0.25 },
  autoResumeDelay: { type: Number, default: 1000 },
  autoRampDuration: { type: Number, default: 0.6 }
})

const mountRef = ref(null)
const webglRef = ref(null)
const resizeObserverRef = ref(null)
const rafRef = ref(null)
const intersectionObserverRef = ref(null)
const isVisibleRef = ref(true)
const resizeRafRef = ref(null)

onMounted(() => {
  if (!mountRef.value) return

  function makePaletteTexture(stops) {
    let arr
    if (Array.isArray(stops) && stops.length > 0) {
      arr = stops.length === 1 ? [stops[0], stops[0]] : stops
    } else {
      arr = ['#ffffff', '#ffffff']
    }
    const w = arr.length
    const data = new Uint8Array(w * 4)
    for (let i = 0; i < w; i++) {
      const c = new THREE.Color(arr[i])
      data[i * 4 + 0] = Math.round(c.r * 255)
      data[i * 4 + 1] = Math.round(c.g * 255)
      data[i * 4 + 2] = Math.round(c.b * 255)
      data[i * 4 + 3] = 255
    }
    const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat)
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.generateMipmaps = false
    tex.needsUpdate = true
    return tex
  }

  const paletteTex = makePaletteTexture(props.colors)
  const bgVec4 = new THREE.Vector4(0, 0, 0, 0)

  // ... [继续添加所有的类和着色器代码]
  // 由于代码太长，我会创建一个完整的组件文件
})

onUnmounted(() => {
  if (rafRef.value) cancelAnimationFrame(rafRef.value)
  if (resizeObserverRef.value) {
    try { resizeObserverRef.value.disconnect() } catch (e) { }
  }
  if (intersectionObserverRef.value) {
    try { intersectionObserverRef.value.disconnect() } catch (e) { }
  }
  if (webglRef.value) {
    webglRef.value.dispose()
  }
  webglRef.value = null
})
</script>

<style scoped>
.liquid-ether-container {
  position: relative;
  overflow: hidden;
}
</style>
