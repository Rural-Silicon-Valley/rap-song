<script setup>
import { gsap } from 'gsap'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  textAutoHide: {
    type: Boolean,
    default: true
  },
  enableStars: {
    type: Boolean,
    default: true
  },
  enableSpotlight: {
    type: Boolean,
    default: true
  },
  enableBorderGlow: {
    type: Boolean,
    default: true
  },
  disableAnimations: {
    type: Boolean,
    default: false
  },
  spotlightRadius: {
    type: Number,
    default: 300
  },
  particleCount: {
    type: Number,
    default: 12
  },
  enableTilt: {
    type: Boolean,
    default: false
  },
  glowColor: {
    type: String,
    default: '0, 200, 83'
  },
  clickEffect: {
    type: Boolean,
    default: true
  },
  enableMagnetism: {
    type: Boolean,
    default: true
  }
})

const gridRef = ref(null)
const isMobile = ref(false)
let spotlightCleanup = null

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const setupSpotlight = () => {
  if (!props.enableSpotlight || props.disableAnimations) return

  const spotlight = document.createElement('div')
  spotlight.className = 'global-spotlight'
  spotlight.style.cssText = `
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(${props.glowColor}, 0.15) 0%,
      rgba(${props.glowColor}, 0.08) 15%,
      rgba(${props.glowColor}, 0.04) 25%,
      rgba(${props.glowColor}, 0.02) 40%,
      rgba(${props.glowColor}, 0.01) 65%,
      transparent 70%
    );
    z-index: 200;
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
  `
  document.body.appendChild(spotlight)

  const handleMouseMove = (e) => {
    if (!gridRef.value) return

    const rect = gridRef.value.getBoundingClientRect()
    const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && 
                        e.clientY >= rect.top && e.clientY <= rect.bottom

    gsap.to(spotlight, {
      left: e.clientX,
      top: e.clientY,
      opacity: mouseInside ? 0.5 : 0,
      duration: 0.3,
      ease: 'power2.out'
    })

    if (mouseInside && gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.card')
      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect()
        const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100
        const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100
        
        card.style.setProperty('--glow-x', `${relativeX}%`)
        card.style.setProperty('--glow-y', `${relativeY}%`)
        card.style.setProperty('--glow-intensity', '0.6')
      })
    }
  }

  document.addEventListener('mousemove', handleMouseMove)

  spotlightCleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    spotlight.remove()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // 设置聚光灯效果
  if (props.enableSpotlight && !props.disableAnimations) {
    setupSpotlight()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (spotlightCleanup) {
    spotlightCleanup()
  }
})

const shouldDisableAnimations = computed(() => props.disableAnimations || isMobile.value)

const baseClassName = computed(() => {
  return `card flex flex-col justify-between relative w-full p-6 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-out ${
    props.enableBorderGlow ? 'card--border-glow' : ''
  }`
})

const getCardStyle = (card) => ({
  backgroundColor: card.color || '#0d0d0d',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(8px)',
  transform: 'translateZ(0)',
  '--glow-x': '50%',
  '--glow-y': '50%',
  '--glow-intensity': '0',
  '--glow-radius': '200px'
})

const setupCardInteraction = (el, index) => {
  if (!el || shouldDisableAnimations.value) return

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { 
      y: -6, 
      scale: 1.01,
      boxShadow: '0 12px 40px rgba(0, 200, 83, 0.25), 0 0 30px rgba(0, 200, 83, 0.08)',
      duration: 0.35, 
      ease: 'power2.out' 
    })
  })

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { 
      y: 0, 
      x: 0, 
      scale: 1,
      rotateX: 0, 
      rotateY: 0, 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      duration: 0.35, 
      ease: 'power2.out' 
    })
  })

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    if (props.enableMagnetism) {
      const magnetX = (x - centerX) * 0.05
      const magnetY = (y - centerY) * 0.05
      gsap.to(el, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' })
    }
  })

  if (props.clickEffect) {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      )

      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${props.glowColor}, 0.4) 0%, rgba(${props.glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `

      el.appendChild(ripple)

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      )
    })
  }
}
</script>

<template>
  <div 
    ref="gridRef"
    class="relative gap-3 grid p-4 select-none bento-section"
    :style="{ fontSize: 'clamp(0.875rem, 0.8rem + 0.4vw, 1.125rem)' }"
  >
    <div class="gap-3 grid card-responsive">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :class="baseClassName"
        :style="getCardStyle(card)"
        :ref="el => setupCardInteraction(el, index)"
      >
        <div class="relative flex justify-between items-start gap-2 text-white card__header">
          <span class="card__label">{{ card.label }}</span>
        </div>
        <div class="relative flex flex-col justify-end text-white card__content">
          <h3 :class="`card__title font-bold text-lg m-0 mb-1.5 ${textAutoHide ? 'text-clamp-2' : ''}`">
            {{ card.title }}
          </h3>
          <p :class="`card__description text-sm leading-relaxed opacity-75 ${textAutoHide ? 'text-clamp-2' : ''}`">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 180px;
  --glow-color: v-bind(glowColor);
  --border-color: #1a1a1a;
  --background-dark: #0a0a0a;
  --white: hsl(0, 0%, 100%);
  max-width: 1200px;
  margin: 0 auto;
}

.card-responsive {
  grid-template-columns: 1fr;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  grid-auto-rows: minmax(180px, auto);
}

@media (min-width: 640px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(200px, auto);
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(220px, auto);
  }
}

@media (min-width: 1280px) {
  .card-responsive {
    grid-auto-rows: minmax(240px, auto);
  }
}

.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 4px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.9)) 0%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.5)) 25%,
    transparent 55%
  );
  border-radius: inherit;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.card--border-glow:hover::after {
  opacity: 1;
}

.card__label {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 200, 83, 0.12);
  border-radius: 10px;
  border: 1px solid rgba(0, 200, 83, 0.25);
  line-height: 1;
}

.card__title {
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  line-height: 1.3;
}

.card__description {
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
}

.text-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 639px) {
  .card-responsive {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-responsive .card {
    width: 100%;
    min-height: 160px;
  }
  
  .card__label {
    font-size: 0.625rem;
    padding: 0.3rem 0.6rem;
  }
  
  .card__title {
    font-size: 1rem;
  }
  
  .card__description {
    font-size: 0.8125rem;
  }
}
</style>
