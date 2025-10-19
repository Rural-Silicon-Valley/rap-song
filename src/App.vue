<template>
  <div id="app">
    <NavigationMenu />

    <LiquidEtherComplete
      :mouse-force="36"
      :cursor-size="160"
      :is-viscous="true"
      :viscous="26"
      :iterations-viscous="28"
      :iterations-poisson="30"
      :resolution="0.7"
      :auto-demo="true"
      :auto-speed="0.65"
      :auto-intensity="3.6"
      :takeover-duration="0.25"
      :auto-resume-delay="2800"
      :auto-ramp-duration="0.7"
      :colors="['#5B2BFF', '#1B77FF', '#63F5FF', '#1B1B3A']"
      class="liquid-background"
    />

    <main class="landing">
      <section class="hero" data-animate-group>
        <div class="hero-copy" data-animate="fade-up" data-delay="0">
          <span class="eyebrow">Lightning Flow 全新发布</span>
          <h1>{{ heroTitle }}</h1>
          <p>{{ heroSubtitle }}</p>

          <div class="cta-row" data-animate="fade-up" data-delay="120">
            <a href="/rap-tutorial-vue.html" class="feature-btn primary" data-tilt>立即开启创作</a>
            <a href="/mixing-tutorial-vue.html" class="feature-btn secondary" data-tilt>查看进阶课程</a>
          </div>

          <div class="metrics" data-animate="stagger" data-delay="220">
            <div v-for="metric in metrics" :key="metric.label" class="metric-card" data-animate-item>
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" data-animate="fade-left" data-delay="180">
          <div class="visual-frame">
            <LightningCanvas
              :hue="220"
              :x-offset="0"
              :speed="1"
              :intensity="1.1"
              :size="1"
              :follow-pointer="true"
              :pulse="true"
            />
            <div class="visual-overlay"></div>
          </div>
          <div class="visual-caption">
            <p>Lightning FX 使用 WebGL 实时绘制能量涌动，感知你的节拍输入，在 60fps 下响应每一次 Flow 变化。</p>
          </div>
        </div>
      </section>

      <section class="feature-grid" data-animate-group>
        <header class="section-header">
          <span class="eyebrow">沉浸式训练体系</span>
          <h2>从灵感火花到舞台表现，只需三步</h2>
          <p>结合 AI 节奏教练、歌词工坊与现场实战模块，打造完整的创作闭环。</p>
        </header>

        <div class="feature-cards" data-animate="stagger" data-delay="120">
          <article v-for="feature in features" :key="feature.title" class="feature-card" data-animate-item>
            <span class="feature-badge">{{ feature.badge }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </article>
        </div>
      </section>

      <section class="steps-grid" data-animate="stagger" data-delay="180">
        <div v-for="step in steps" :key="step.title" class="step-card" data-animate-item>
          <span class="step-index">{{ step.index }}</span>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </section>

      <section class="cta-footer" data-animate="fade-up" data-delay="220">
        <div class="cta-panel" data-tilt>
          <h2>准备好点燃舞台了吗？</h2>
          <p>加入 Lightning Flow 训练营，三周直达 Live 表演水准，让创作与混音在同一空间自循环。</p>
          <div class="cta-row" data-animate="stagger" data-delay="180">
            <a href="/rap-practice-vue.html" class="feature-btn primary" data-tilt>进入节奏营</a>
            <a href="/rap-songs-vue.html" class="feature-btn ghost" data-tilt>精选歌单试听</a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import LiquidEtherComplete from './components/LiquidEtherComplete.vue'
import LightningCanvas from './components/LightningCanvas.vue'
import NavigationMenu from './components/NavigationMenu.vue'

const heroTitle = 'Lightning Flow 说唱创作空间'
const heroSubtitle = 'AI 节奏教练驱动的沉浸式训练体系，帮你将灵感、电音与舞台表达合而为一。'

const metrics = [
  { value: '45K+', label: '全球学员覆盖' },
  { value: '120+', label: '模块化训练单元' },
  { value: '98%', label: '完成度提升反馈' }
]

const features = [
  {
    badge: 'Flow AI',
    title: '智能 Flow 引导',
    description: '实时捕捉你的节奏输入，提供可视化 Flow 曲线与自动纠错建议。'
  },
  {
    badge: 'Lyric Lab',
    title: '灵感歌词工坊',
    description: '借助语义引擎拓展押韵组合，保持作品叙事与态度的平衡。'
  },
  {
    badge: 'Live Boost',
    title: '舞台实战排练',
    description: '模拟舞台声场与混音场景，提前掌握立体声像与切入节拍。'
  }
]

const steps = [
  {
    index: '01',
    title: '点燃灵感',
    description: 'Lightning FX 帮你锁定节拍律动，生成专属节奏模板与伴奏建议。'
  },
  {
    index: '02',
    title: '打磨歌词',
    description: '通过韵脚检测与情绪标签，构建更有层次的歌词表现力。'
  },
  {
    index: '03',
    title: '登台演练',
    description: '结合混音教程与实体设备推荐，打造 Live-ready 的完整舞台。'
  }
]
</script>

<style scoped>
.liquid-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.35;
  filter: saturate(1.2) blur(2px);
}

.hero-visual {
  position: relative;
  z-index: 2;
}

.visual-frame {
  position: relative;
  border-radius: clamp(18px, 3vw, 32px);
  overflow: hidden;
  padding: clamp(10px, 2vw, 16px);
  background: linear-gradient(135deg, rgba(41, 19, 68, 0.65), rgba(21, 41, 86, 0.65));
  box-shadow:
    0 25px 60px rgba(17, 12, 46, 0.5),
    inset 0 0 0 1px rgba(104, 192, 255, 0.12);
}

.visual-overlay {
  position: absolute;
  inset: 12%;
  border-radius: inherit;
  background: radial-gradient(circle at 30% 30%, rgba(99, 243, 255, 0.35), transparent 65%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.visual-caption {
  margin-top: 18px;
  font-size: 0.9rem;
  color: rgba(219, 244, 255, 0.72);
  line-height: 1.5;
  max-width: 420px;
}

@media (max-width: 1080px) {
  .visual-caption {
    max-width: 100%;
  }
}
</style>
