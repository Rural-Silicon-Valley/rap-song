<template>
  <article class="pulse-card" data-animate-item>
    <span v-if="tag" class="pulse-card__tag">{{ tag }}</span>
    <header>
      <h3>{{ title }}</h3>
    </header>
    <p>{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps({
  tag: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<style scoped>
.pulse-card {
  position: relative;
  padding: clamp(22px, 3vw, 26px);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(12, 18, 38, 0.92), rgba(18, 38, 70, 0.82));
  border: 1px solid rgba(116, 178, 255, 0.22);
  box-shadow: 0 20px 48px rgba(6, 12, 28, 0.62);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 16px);
  overflow: hidden;
  transition: transform 0.34s ease, border-color 0.34s ease;
}

.pulse-card::after {
  content: '';
  position: absolute;
  inset: -40% -10% -10% 40%;
  background: radial-gradient(circle at top, rgba(99, 243, 255, 0.25), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.pulse-card:hover {
  transform: translateY(-8px);
  border-color: rgba(132, 198, 255, 0.45);
}

.pulse-card:hover::after {
  opacity: 1;
}

.pulse-card__tag {
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(96, 140, 255, 0.48), rgba(96, 244, 255, 0.34));
  color: #dff7ff;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
}

h3 {
  font-size: clamp(1.2rem, 2.6vw, 1.5rem);
  letter-spacing: -0.01em;
}

p {
  color: rgba(202, 228, 255, 0.74);
  line-height: 1.7;
}
</style>