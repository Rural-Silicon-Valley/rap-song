(() => {
    const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.min.js';
    const THREE_PROMISE_KEY = '__LIQUID_ETHER_THREE_PROMISE__';
    const MAX_COLORS = 5;

    const DEFAULT_OPTIONS = {
        colors: ['#5227FF', '#FF9FFC', '#B19EEF', '#FFE27A', '#6A36FF'],
        backgroundColor: '#040712',
        mouseForce: 24,
        cursorSize: 120,
        isViscous: true,
        viscous: 48,
        iterationsViscous: 32,
        iterationsPoisson: 32,
        resolution: 1,
        isBounce: false,
        autoDemo: true,
        autoSpeed: 0.42,
        autoIntensity: 2.6,
        takeoverDuration: 0.25,
        autoResumeDelay: 2400,
        autoRampDuration: 0.6,
        noiseScale: 1.18,
        flowSpeed: 0.42,
        parallaxStrength: 0.22
    };

    function loadThree() {
        if (typeof window === 'undefined') {
            return Promise.reject(new Error('LiquidEther needs a browser environment.'));
        }
        if (window.THREE) {
            return Promise.resolve(window.THREE);
        }
        if (window[THREE_PROMISE_KEY]) {
            return window[THREE_PROMISE_KEY];
        }
        window[THREE_PROMISE_KEY] = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = THREE_CDN;
            script.async = true;
            script.onload = () => {
                if (window.THREE) {
                    resolve(window.THREE);
                } else {
                    reject(new Error('three.js failed to load.'));
                }
            };
            script.onerror = () => reject(new Error('three.js failed to load.'));
            document.head.appendChild(script);
        });
        return window[THREE_PROMISE_KEY];
    }

    function prefersReducedMotion() {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (error) {
            return false;
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function buildPalette(THREE, colors) {
        const palette = Array.isArray(colors) && colors.length
            ? colors.slice(0, MAX_COLORS)
            : DEFAULT_OPTIONS.colors.slice();
        while (palette.length < MAX_COLORS) {
            palette.push(palette[palette.length - 1]);
        }
        return palette.map((hex) => new THREE.Color(hex));
    }

    function deriveRuntimeOptions(config) {
        const normalizedCursor = clamp(config.cursorSize / 140, 0.25, 2.4);
        const pointerFalloff = clamp(3.3 / normalizedCursor, 1.35, 6.2);
        const pointerBoost = clamp(config.mouseForce / 70, 0.12, 2.2);
        const viscousFactor = clamp(config.viscous / 120, 0, 1.4);
        const pointerDecay = clamp(config.isViscous ? 0.24 + viscousFactor * 0.52 : 0.18, 0.12, 0.95);
        const pointerSmooth = config.isViscous
            ? 4.2 + clamp(config.iterationsViscous, 1, 80) * 0.085
            : 6.0 + clamp(config.iterationsViscous, 1, 80) * 0.045;
        const autoSmooth = 2.4 + clamp(config.iterationsPoisson, 1, 80) * 0.055;
        const pixelRatio = clamp((window.devicePixelRatio || 1) * clamp(config.resolution, 0.3, 1.6), 0.5, 2.5);
        const takeover = Math.max(0.08, config.takeoverDuration);
        const autoRamp = Math.max(0.08, config.autoRampDuration);
        const bounceAmplitude = config.isBounce ? 0.08 : 0;
        const bounceFrequency = config.isBounce ? 4.0 : 0;

        return {
            pointerFalloff,
            pointerBoost,
            pointerDecay,
            pointerSmooth,
            autoSmooth,
            pixelRatio,
            takeover,
            autoRamp,
            bounceAmplitude,
            bounceFrequency
        };
    }

    function createMaterial(THREE, uniforms) {
        return new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                varying vec2 vUv;
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_pointer;
                uniform float u_pointerStrength;
                uniform vec3 u_colors[${MAX_COLORS}];
                uniform float u_noiseScale;
                uniform float u_flowSpeed;
                uniform float u_parallax;
                uniform vec3 u_background;
                uniform float u_pointerFalloff;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187,
                                         0.366025403784439,
                                        -0.577350269189626,
                                         0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m * m;
                    m = m * m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.y = a0.y * x12.x + h.y * x12.y;
                    g.z = a0.z * x12.z + h.z * x12.w;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    mat2 rot = mat2(1.6, -1.2, 1.2, 1.6);
                    for (int i = 0; i < 5; i++) {
                        value += amplitude * snoise(st);
                        st = rot * st;
                        amplitude *= 0.55;
                    }
                    return value * 0.5 + 0.5;
                }

                vec3 palette(float t) {
                    t = clamp(t, 0.0, 1.0);
                    float scaled = t * float(${MAX_COLORS - 1});
                    float idx = floor(scaled);
                    float fracPart = fract(scaled);
                    int i0 = int(idx);
                    int i1 = min(i0 + 1, ${MAX_COLORS - 1});
                    return mix(u_colors[i0], u_colors[i1], fracPart);
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 aspectUv = uv;
                    float aspect = u_resolution.x / u_resolution.y;
                    aspectUv.x *= aspect;

                    vec2 pointer = u_pointer;
                    vec2 pointerDir = aspectUv - vec2(pointer.x * aspect, pointer.y);
                    float pointerDist = length(pointerDir);
                    float pointerInfluence = exp(-pointerDist * u_pointerFalloff) * u_pointerStrength;

                    vec2 flowUv = aspectUv * u_noiseScale;
                    flowUv += vec2(u_time * 0.22, u_time * 0.18);
                    flowUv += pointerDir * u_parallax * pointerInfluence;

                    float base = fbm(flowUv + vec2(u_time * u_flowSpeed, u_time * -u_flowSpeed * 0.7));
                    float layer = fbm(flowUv * 0.7 - vec2(u_time * 0.33, u_time * 0.21));
                    float detail = fbm(flowUv * 1.55 + vec2(u_time * -0.29, u_time * 0.33));

                    float mixValue = clamp(base * 0.5 + layer * 0.36 + detail * 0.24 + pointerInfluence * 0.35, 0.0, 1.0);
                    vec3 color = palette(mixValue);
                    color += pointerInfluence * vec3(0.34, 0.19, 0.45);
                    color = mix(u_background, color, 0.94);

                    float lum = dot(color, vec3(0.299, 0.587, 0.114));
                    color = mix(color, color * (0.9 + lum * 0.25), 0.82);

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            depthWrite: false,
            transparent: true
        });
    }

    function createInstance(container, options = {}) {
        const THREE = window.THREE;
        if (!THREE || !container || typeof container.getBoundingClientRect !== 'function') {
            return null;
        }
        if (!window.WebGLRenderingContext) {
            return null;
        }

        const config = Object.assign({}, DEFAULT_OPTIONS, options);
        const runtime = deriveRuntimeOptions(config);
        const palette = buildPalette(THREE, config.colors);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(runtime.pixelRatio);
        renderer.domElement.className = 'liquid-ether-canvas';
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.pointerEvents = 'auto';
        renderer.domElement.setAttribute('aria-hidden', 'true');
        
        console.log('[LiquidEther] Canvas created and configured');

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(1, 1) },
            u_pointer: { value: new THREE.Vector2(0.5, 0.5) },
            u_pointerStrength: { value: 0 },
            u_colors: { value: palette.map((color) => color.clone()) },
            u_noiseScale: { value: config.noiseScale },
            u_flowSpeed: { value: config.flowSpeed },
            u_parallax: { value: config.parallaxStrength },
            u_background: { value: new THREE.Color(config.backgroundColor) },
            u_pointerFalloff: { value: runtime.pointerFalloff }
        };

        const material = createMaterial(THREE, uniforms);
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        if (!container.style.position || container.style.position === 'static') {
            container.style.position = 'relative';
        }
        container.appendChild(renderer.domElement);

        const pointer = new THREE.Vector2(0.5, 0.5);
        const pointerTarget = new THREE.Vector2(0.5, 0.5);
        const manualPointer = new THREE.Vector2(0.5, 0.5);
        const autoPointer = new THREE.Vector2(0.5, 0.5);
        const tempPointer = new THREE.Vector2();
        let pointerStrength = 0;
        let autoAngle = Math.random() * Math.PI * 2;
        let autoEnabled = !!config.autoDemo;
        let autoMix = 0;

        const state = {
            isRunning: false,
            manualPaused: false,
            rafId: null,
            lastFrame: performance.now(),
            elapsed: 0,
            lastInteraction: performance.now(),
            isVisible: true,
            destroyed: false
        };

        function updateResolution() {
            const rect = container.getBoundingClientRect();
            const width = Math.max(1, Math.floor(rect.width));
            const height = Math.max(1, Math.floor(rect.height));
            renderer.setSize(width, height, false);
            uniforms.u_resolution.value.set(width, height);
        }

        function pauseInternal() {
            if (!state.isRunning) return;
            cancelAnimationFrame(state.rafId);
            state.rafId = null;
            state.isRunning = false;
        }

        function startInternal() {
            if (state.isRunning || state.manualPaused || state.destroyed) return;
            state.isRunning = true;
            state.lastFrame = performance.now();
            state.rafId = requestAnimationFrame(loop);
        }

        function setPointer(nx, ny) {
            const x = clamp(nx, 0, 1);
            const y = clamp(ny, 0, 1);
            manualPointer.set(x, y);
            pointerTarget.copy(manualPointer);
            pointerStrength = Math.min(1, pointerStrength + runtime.pointerBoost);
            state.lastInteraction = performance.now();
            autoMix = Math.max(0, autoMix - 0.35);
        }

        function handlePointer(event) {
            const rect = container.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            setPointer(x, y);
        }

        function handleTouch(event) {
            if (!event.touches || event.touches.length === 0) return;
            const touch = event.touches[0];
            handlePointer(touch);
        }

        function updateAutoPointer(delta) {
            if (!autoEnabled) {
                const rampDown = 1 - Math.exp(-delta / runtime.autoRamp);
                autoMix = Math.max(0, autoMix - rampDown);
                pointerTarget.copy(manualPointer);
                pointerTarget.lerp(autoPointer, autoMix);
                return autoMix > 0.001;
            }

            const idle = performance.now() - state.lastInteraction;
            const rampDown = 1 - Math.exp(-delta / runtime.autoRamp);
            if (idle < config.autoResumeDelay) {
                autoMix = Math.max(0, autoMix - rampDown);
                pointerTarget.copy(manualPointer);
                pointerTarget.lerp(autoPointer, autoMix);
                return autoMix > 0.001;
            }

            autoAngle += delta * config.autoSpeed * 1.4;
            const radius = 0.26 + 0.08 * Math.sin(autoAngle * 0.8);
            tempPointer.set(
                0.5 + Math.cos(autoAngle) * radius,
                0.5 + Math.sin(autoAngle * 1.3) * radius
            );
            autoPointer.lerp(tempPointer, 1 - Math.exp(-delta * runtime.autoSmooth));
            const rampUp = 1 - Math.exp(-delta / runtime.takeover);
            autoMix = Math.min(1, autoMix + rampUp);
            pointerTarget.copy(manualPointer);
            pointerTarget.lerp(autoPointer, autoMix);
            pointerStrength = Math.min(1, pointerStrength + delta * config.autoIntensity * 0.45);
            return true;
        }

        function loop() {
            if (!state.isRunning) return;
            const now = performance.now();
            const delta = Math.min(0.05, (now - state.lastFrame) / 1000);
            state.lastFrame = now;
            state.elapsed += delta;
            uniforms.u_time.value = state.elapsed;

            const autoActive = updateAutoPointer(delta);
            const smoothFactor = 1 - Math.exp(-delta * runtime.pointerSmooth);
            pointer.lerp(pointerTarget, smoothFactor);
            uniforms.u_pointer.value.copy(pointer);

            if (!autoActive) {
                pointerStrength = Math.max(0, pointerStrength - delta * runtime.pointerDecay);
            }

            const bounceOffset = runtime.bounceAmplitude ? Math.sin(state.elapsed * runtime.bounceFrequency) * runtime.bounceAmplitude : 0;
            uniforms.u_pointerStrength.value = clamp(pointerStrength + bounceOffset, 0, 1.2);

            renderer.render(scene, camera);
            state.rafId = requestAnimationFrame(loop);
        }

        function handleVisibility() {
            if (document.hidden || !state.isVisible) {
                pauseInternal();
            } else {
                startInternal();
            }
        }

        function handleIntersection(entries) {
            const entry = entries[0];
            state.isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
            if (state.isVisible) {
                startInternal();
            } else {
                pauseInternal();
            }
        }

        updateResolution();
        startInternal();
        
        console.log('[LiquidEther] Animation loop started');

        window.addEventListener('pointermove', handlePointer, { passive: true });
        window.addEventListener('pointerdown', handlePointer, { passive: true });
        window.addEventListener('touchstart', handleTouch, { passive: true });
        window.addEventListener('touchmove', handleTouch, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('resize', updateResolution);

        let resizeObserver = null;
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(updateResolution);
            resizeObserver.observe(container);
        }

        let intersectionObserver = null;
        if (window.IntersectionObserver) {
            intersectionObserver = new IntersectionObserver(handleIntersection, { threshold: [0, 0.01, 0.1] });
            intersectionObserver.observe(container);
        }

        return {
            pause: () => {
                state.manualPaused = true;
                pauseInternal();
            },
            resume: () => {
                state.manualPaused = false;
                if (!document.hidden && state.isVisible) {
                    startInternal();
                }
            },
            setAutoDemo: (enabled) => {
                autoEnabled = !!enabled;
            },
            destroy: () => {
                if (state.destroyed) return;
                state.destroyed = true;
                pauseInternal();
                window.removeEventListener('pointermove', handlePointer, { passive: true });
                window.removeEventListener('pointerdown', handlePointer, { passive: true });
                window.removeEventListener('touchstart', handleTouch, { passive: true });
                window.removeEventListener('touchmove', handleTouch, { passive: true });
                document.removeEventListener('visibilitychange', handleVisibility);
                window.removeEventListener('resize', updateResolution);
                if (resizeObserver) resizeObserver.disconnect();
                if (intersectionObserver) intersectionObserver.disconnect();
                geometry.dispose();
                material.dispose();
                renderer.dispose();
                if (renderer.domElement.parentNode === container) {
                    container.removeChild(renderer.domElement);
                }
            }
        };
    }

    function bootstrap() {
        if (prefersReducedMotion()) return;
        const nodes = document.querySelectorAll('[data-liquid-ether]');
        if (!nodes.length) return;
        loadThree().then(() => {
            nodes.forEach((node) => {
                if (node.__liquidEtherInstance) return;
                const colors = node.dataset.colors ? node.dataset.colors.split(',').map((c) => c.trim()) : undefined;
                node.__liquidEtherInstance = createInstance(node, { colors });
            });
        }).catch((error) => {
            console.error('[LiquidEther] init failed:', error);
        });
    }

    function init() {
        if (typeof document === 'undefined') return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
        } else {
            bootstrap();
        }
    }

    init();

    function create(element, options) {
        if (!element) return Promise.resolve(null);
        if (prefersReducedMotion()) return Promise.resolve(null);
        return loadThree()
            .then(() => createInstance(element, options))
            .catch((error) => {
                console.error('[LiquidEther] init failed:', error);
                return null;
            });
    }

    window.createLiquidEther = function (element, options) {
        return create(element, options);
    };

    window.LiquidEther = {
        create
    };
})();