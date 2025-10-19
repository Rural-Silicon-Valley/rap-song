<template>
  <section class="page-hero" data-animate="fade-up" :data-delay="delay">
    <div class="page-hero__content">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <div v-if="actions.length" class="cta-row" data-animate="stagger" data-delay="actionDelay">
        <a
          v-for="action in actions"
          :key="action.href"
          :href="action.href"
          class="feature-btn"
          :class="action.variant"
          data-tilt
          :data-tilt-intensity="action.tilt"
        >
          {{ action.label }}
        </a>
      </div>
    </div>
    <div class="page-hero__visual" data-animate="fade-left" :data-delay="visualDelay">
      <div class="visual-frame compact">
        <LightningCanvas v-bind="canvasProps" />
        <div class="visual-overlay"></div>
      </div>
      <p v-if="visualNote" class="visual-caption">{{ visualNote }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LightningCanvas from './LightningCanvas.vue'

interface ActionItem {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  tilt?: number
}

const props = withDefaults(
  defineProps<{
    title: string
    eyebrow?: string
    description?: string
    actions?: ActionItem[]
    visualNote?: string
    delay?: number | string
    actionDelay?: number | string
    visualDelay?: number | string
    canvasProps?: Record<string, unknown>
  }>(),
  {
    actions: () => [],
    delay: 60,
    actionDelay: 140,
    visualDelay: 240,
    canvasProps: () => ({})
  }
)

const actionDelay = computed(() => props.actionDelay)
const visualDelay = computed(() => props.visualDelay)

defineExpose({ actionDelay, visualDelay })
</script>

<style scoped>
.page-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(32px, 6vw, 48px);
  align-items: center;
  padding: clamp(32px, 6vw, 56px);
  border-radius: clamp(24px, 4vw, 32px);
  background: linear-gradient(130deg, rgba(22, 18, 46, 0.92), rgba(16, 42, 82, 0.88));
  border: 1px solid rgba(106, 178, 255, 0.18);
  box-shadow: 0 24px 60px rgba(6, 12, 32, 0.55), inset 0 0 0 1px rgba(132, 0, 255, 0.22);
  position: relative;
  overflow: hidden;
}

.page-hero::after {
  content: '';
  position: absolute;
  inset: -20% 10% auto 40%;
  height: clamp(280px, 35vw, 400px);
  background: radial-gradient(circle at 50% 20%, rgba(99, 243, 255, 0.32), transparent 70%);
  filter: blur(10px);
  opacity: 0.8;
  pointer-events: none;
}

.page-hero__content {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.6vw, 24px);
  position: relative;
  z-index: 1;
}

.page-hero__content h1 {
  font-size: clamp(2.6rem, 6vw, 3.4rem);
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #9bc9ff 0%, #5cf0ff 45%, #4d5cff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-hero__content p {
  color: rgba(212, 235, 255, 0.8);
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  line-height: 1.9;
}

.page-hero__visual {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

@media (max-width: 720px) {
  .page-hero {
    padding: clamp(24px, 8vw, 36px);
  }
}
</style>