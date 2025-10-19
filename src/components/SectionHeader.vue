<template>
  <header class="section-header" data-animate="fade-up" :data-delay="delay">
    <span v-if="eyebrow" class="section-header__eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  delay: { type: [String, Number], default: 160 }
})
</script>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 760px;
  margin: 0 auto clamp(28px, 5vw, 38px);
  text-align: center;
}

.section-header__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(120, 158, 255, 0.7);
}

h2 {
  font-size: clamp(2.1rem, 4.8vw, 2.8rem);
  letter-spacing: -0.015em;
}

p {
  color: rgba(204, 228, 255, 0.72);
  line-height: 1.7;
}
</style>