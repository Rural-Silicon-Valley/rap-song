import { createApp } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'
import LightningCanvas from './components/LightningCanvas.vue'

const metrics = [
  { value: '30H', label: '结构化训练时长' },
  { value: '12', label: 'Flow 节奏模块' },
  { value: '48', label: '押韵技巧案例' },
  { value: '∞', label: 'Freestyle 灵感触发' }
]

const fundamentals = [
  {
    tag: 'FOUNDATION',
    title: '说唱文化与历程',
    description: '梳理从 Bronx 到双城的演化，理解每一种 Flow 背后的社会语境与精神属性。'
  },
  {
    tag: 'FLOW LAB',
    title: '节奏内驱训练',
    description: '通过语音波形与节拍网格对比，锻炼内在节拍感与多段位切分，构建核心律动肌肉记忆。'
  },
  {
    tag: 'LYRIC MODE',
    title: '押韵与修辞矩阵',
    description: '拆解多音节、尾韵、跨行押韵等结构，让歌词在叙事与态度之间保持弹性。'
  }
]

const modules = [
  {
    tag: '01',
    title: 'Flow Architect',
    description: '结合速度、力度、音高三维参数，以 Lightning FX 可视化律动轮廓，设计个人专属 Flow 模板。'
  },
  {
    tag: '02',
    title: 'Punchline Forge',
    description: '通过语义偏移与 punchline 练习，打造具备攻击性的核心句式，提升舞台记忆点。'
  },
  {
    tag: '03',
    title: 'Stage Presence',
    description: '模拟现场气压与观众互动反馈，训练呼吸、肢体与声压布局，塑造舞台统治力。'
  }
]

const app = createApp({
  components: {
    NavigationMenu,
    LightningCanvas
  },
  data() {
    return {
      pageTitle: '说唱教程',
      metrics,
      fundamentals,
      modules
    }
  },
  template: `
    <div class="page-wrapper">
      <NavigationMenu />
      
      <button class="back-button" @click="goBack">
        <svg class="svgIcon" viewBox="0 0 384 512">
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
        </svg>
      </button>

      <div class="content-wrapper">
        <section class="page-header" data-animate="fade-up" data-delay="60">
          <div class="page-intro">
            <span class="eyebrow">Lightning Flow Curriculum</span>
            <h1>{{ pageTitle }}</h1>
            <p>
              以 Flow 律动为核心，从文化根基到舞台输出，全栈式梳理说唱创作方法论。
              结合 WebGL 能量可视化与多维音频解析，让你的作品兼具技艺与态度。
            </p>
            <div class="cta-row" data-animate="stagger" data-delay="140">
              <a href="/rap-practice-vue.html" class="feature-btn primary" data-tilt data-tilt-intensity="10">进阶节奏实验室</a>
              <a href="/rap-songs-vue.html" class="feature-btn ghost" data-tilt data-tilt-intensity="8">参考歌单速览</a>
            </div>
            <div class="page-metrics" data-animate="stagger" data-delay="220">
              <article v-for="metric in metrics" :key="metric.label" class="metric-pulse" data-animate-item>
                <strong>{{ metric.value }}</strong>
                <span>{{ metric.label }}</span>
              </article>
            </div>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="240">
            <div class="visual-frame compact">
              <LightningCanvas :hue="215" :intensity="1.2" :speed="1.1" :size="0.9" :follow-pointer="true" :pulse="true" />
              <div class="visual-overlay"></div>
            </div>
            <p class="visual-caption">Lightning FX 以音频包络为灵感构建能量脉冲，辅助理解 Flow 的动态线条。</p>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>FUNDAMENTALS</span>
            <h2>打牢核心，理解 Flow 的前世今生</h2>
            <p>从文化认知、节奏内驱到押韵修辞，完整构建说唱语言的底层结构。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="item in fundamentals" :key="item.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ item.tag }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>ADVANCED MODULES</span>
            <h2>重塑个人 Flow：结构、句式与舞台动能</h2>
            <p>通过 Lightning Flow 的实战模块，打造能被记住的声音名片。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="module in modules" :key="module.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ module.tag }}</span>
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  `,
  methods: {
    goBack() {
      window.history.back()
    }
  }
})

app.mount('#app')
