<template>
  <nav class="nav" data-animate="fade-up" data-delay="60">
    <a href="/index.html" class="logo" aria-label="返回首页">RAP EDU</a>
    <ul class="links" data-animate="stagger" data-delay="120">
      <li><a href="/rap-tutorial-vue.html" data-animate-item>说唱教程</a></li>
      <li><a href="/rap-practice-vue.html" data-animate-item>节奏练习</a></li>
      <li><a href="/rap-songs-vue.html" data-animate-item>歌曲库</a></li>
      <li><a href="/mixing-tutorial-vue.html" data-animate-item>混音教程</a></li>
      <li><a href="/equipment-recommendation-vue.html" data-animate-item>设备推荐</a></li>
    </ul>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(320px, 80vw, 980px);
  padding: 12px clamp(24px, 4vw, 32px);
  border-radius: 999px;
  background: rgba(16, 16, 24, 0.7);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(224, 255, 255, 0.18);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 2vw, 24px);
  z-index: 1200;
}

.logo {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e0ffff;
  text-decoration: none;
  position: relative;
  padding: 6px 12px;
  border-radius: 999px;
  transition: color 0.3s ease;
}

.logo::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at center, rgba(132, 0, 255, 0.35), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo:hover::after {
  opacity: 1;
}

.logo:hover {
  color: #ffffff;
}

.links {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(16px, 2.2vw, 40px);
  margin: 0;
  padding: 0;
}

.links a {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 14px;
  color: #d9faff;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links a::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(132, 0, 255, 0.3), rgba(0, 200, 255, 0.12));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.links a::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(132, 0, 255, 0.8), transparent);
  transform: translateX(-50%) scaleX(0.3);
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.links a:hover {
  color: #ffffff;
}

.links a:hover::before {
  opacity: 1;
}

.links a:hover::after {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.links a:focus-visible {
  outline: 3px solid rgba(132, 0, 255, 0.6);
  outline-offset: 3px;
}

@supports (gap: clamp(16px, 2.2vw, 40px)) {
  .links {
    gap: clamp(16px, 2.2vw, 40px);
  }
}

@media (max-width: 820px) {
  .nav {
    flex-direction: column;
    align-items: stretch;
    width: clamp(320px, 92vw, 520px);
    gap: 12px;
    padding: 16px;
  }

  .links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .links a {
    flex: 1 1 calc(50% - 10px);
    min-width: 140px;
  }
}

@media (max-width: 520px) {
  .nav {
    top: 16px;
    padding: 14px;
    border-radius: 24px;
  }

  .logo {
    align-self: center;
  }

  .links {
    flex-direction: column;
    width: 100%;
  }

  .links a {
    width: 100%;
  }
}
</style>
