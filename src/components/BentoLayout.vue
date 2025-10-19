<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';

interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  link?: string;
}

interface BentoProps {
  cards: BentoCardProps[];
  pageTitle?: string;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '224, 255, 255'; // 科技亮白色
const MOBILE_BREAKPOINT = 768;

const props = withDefaults(defineProps<BentoProps>(), {
  pageTitle: '说唱教学',
  enableSpotlight: true,
  enableBorderGlow: true,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  glowColor: DEFAULT_GLOW_COLOR,
  clickEffect: true,
  enableMagnetism: true
});

const gridRef = ref<HTMLDivElement | null>(null);
const spotlightRef = ref<HTMLDivElement | null>(null);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

const baseClassName = computed(() => {
  return `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_8px_25px_rgba(224,255,255,0.15)] cursor-pointer ${
    props.enableBorderGlow ? 'card--border-glow' : ''
  }`;
});

const getCardStyle = (card: BentoCardProps) => ({
  backgroundColor: card.color || '#000000',
  borderColor: 'rgba(224, 255, 255, 0.2)',
  color: '#E0FFFF'
});

const handleCardClick = (card: BentoCardProps, event: MouseEvent) => {
  if (card.link) {
    window.location.href = card.link;
  }
  
  if (props.clickEffect) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('div');
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
    `;

    target.appendChild(ripple);

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
    );
  }
};

const setupSpotlight = () => {
  if (!props.enableSpotlight || !gridRef.value) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'global-spotlight';
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
  `;
  document.body.appendChild(spotlight);
  spotlightRef.value = spotlight;

  const handleMouseMove = (e: MouseEvent) => {
    if (!spotlightRef.value || !gridRef.value) return;

    const section = gridRef.value.closest('.bento-section');
    const rect = section?.getBoundingClientRect();
    const mouseInside =
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    const cards = gridRef.value.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

    if (!mouseInside) {
      gsap.to(spotlightRef.value, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
      return;
    }

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
      const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      
      const glowIntensity = Math.max(0, 1 - distance / props.spotlightRadius);
      card.style.setProperty('--glow-intensity', glowIntensity.toString());
    });

    gsap.to(spotlightRef.value, {
      left: e.clientX,
      top: e.clientY,
      opacity: 0.8,
      duration: 0.1,
      ease: 'power2.out'
    });
  };

  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    spotlightRef.value?.remove();
  };
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  nextTick(() => {
    const cleanup = setupSpotlight();
    onUnmounted(() => {
      cleanup?.();
      window.removeEventListener('resize', checkMobile);
    });
  });
});
</script>

<template>
  <div class="bento-page">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <a href="/index.html" class="back-btn">返回首页</a>
    </div>
    
    <div class="bento-section" ref="gridRef">
      <div class="card-grid">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :class="baseClassName"
          :style="getCardStyle(card)"
          @click="handleCardClick(card, $event)"
        >
          <div class="card__header">
            <span class="card__label">{{ card.label }}</span>
          </div>
          <div class="card__content">
            <h3 class="card__title">{{ card.title }}</h3>
            <p class="card__description">{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bento-page {
  min-height: 100vh;
  background: #000000;
  padding: 2rem;
  padding-top: 100px;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.page-header h1 {
  font-size: 3rem;
  color: #E0FFFF;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 0 30px rgba(224, 255, 255, 0.3);
}

.back-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: rgba(224, 255, 255, 0.1);
  color: #E0FFFF;
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid rgba(224, 255, 255, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
}

.back-btn:hover {
  background: rgba(224, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(224, 255, 255, 0.2);
  transform: translateY(-2px);
}

.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  position: relative;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card__label {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card__content {
  flex: 1;
}

.card__title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card__description {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
}

.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: radial-gradient(
    400px circle at var(--glow-x) var(--glow-y),
    rgba(224, 255, 255, calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(224, 255, 255, calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
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
  z-index: 1;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(224, 255, 255, 0.15);
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .bento-page {
    padding: 1rem;
    padding-top: 80px;
  }
}
</style>
