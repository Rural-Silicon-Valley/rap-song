import { createApp } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'
import LightningCanvas from './components/LightningCanvas.vue'

const tiers = [
  {
    tag: 'ENTRY',
    title: '入门节奏工坊',
    description: 'USB 麦克风 + 轻量化声卡组合，适合初创团队与 bedroom rapper。'
  },
  {
    tag: 'PRO',
    title: '专业录制链路',
    description: '大振膜麦克风搭配中档前级，构建高信噪比与灵活动态的录音环境。'
  },
  {
    tag: 'STAGE',
    title: 'Live 级设备矩阵',
    description: '支持多路输入与舞台监听，还原现场氛围并保证混音空间的稳定。'
  }
]

const gearSets = [
  {
    label: '麦克风',
    title: 'Vocal Capsule Picks',
    description: '根据音色偏好（明亮 / 温润 / 厚实）给出三档麦克风推荐。'
  },
  {
    label: '监听系统',
    title: 'Monitor Alignment',
    description: '从耳机到监听音箱的组合方案，并附带简单校准流程。'
  },
  {
    label: '控制器',
    title: 'Control Surface',
    description: '通过 MIDI 键盘与控制器提升编曲效率，加入鼓垫以模拟 MPC 手感。'
  }
]

const creativeZones = [
  {
    title: '声学处理建议',
    details: '使用吸音板、扩散板与低频陷阱搭配，稳定房间的频率响应。'
  },
  {
    title: '信号流布线',
    details: '推荐 XLR + TRS 线缆组合，并附上地线与供电注意项。'
  },
  {
    title: '移动创作包',
    details: '背包式移动录音方案，随时随地记录 Freestyle 灵感。'
  }
]

const app = createApp({
  components: {
    NavigationMenu,
    LightningCanvas
  },
  data() {
    return {
      pageTitle: '设备推荐',
      tiers,
      gearSets,
      creativeZones
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
            <span class="eyebrow">Gear Atlas</span>
            <h1>{{ pageTitle }}</h1>
            <p>
              从 Bedroom 录音到 Live 舞台，Lightning Flow 为你梳理完整的说唱创作与混音设备路径。
              以预算与需求为轴线，组合出最佳的硬件生态。
            </p>
            <div class="cta-row" data-animate="stagger" data-delay="140">
              <a href="/mixing-tutorial-vue.html" class="feature-btn primary" data-tilt data-tilt-intensity="9">查看混音流程</a>
              <a href="/rap-tutorial-vue.html" class="feature-btn secondary" data-tilt data-tilt-intensity="7">回到创作课程</a>
            </div>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="240">
            <div class="visual-frame compact">
              <LightningCanvas :hue="188" :intensity="1.2" :speed="1.1" :size="0.92" :follow-pointer="true" />
              <div class="visual-overlay"></div>
            </div>
            <p class="visual-caption">动态线条模拟信号链能量流动，提示设备在链路中的角色。</p>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>GEAR TIERS</span>
            <h2>按阶段升级你的创作空间</h2>
            <p>依据预算与应用场景，构建稳定可靠的说唱创作设备栈。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="tier in tiers" :key="tier.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ tier.tag }}</span>
              <h3>{{ tier.title }}</h3>
              <p>{{ tier.description }}</p>
            </article>
          </div>
        </section>

        <section class="page-section split" data-animate-group>
          <div class="split-panel" data-animate="fade-up" data-delay="160">
            <header class="section-title">
              <span>GEAR SETS</span>
              <h2>关键链路的硬件搭配建议</h2>
              <p>通过 Lightning Flow 的推荐矩阵，将预算投入在最具回报的环节。</p>
            </header>
            <div class="content-grid" data-animate="stagger" data-delay="220">
              <article v-for="gear in gearSets" :key="gear.title" class="content-card" data-animate-item>
                <span class="content-tag">{{ gear.label }}</span>
                <h3>{{ gear.title }}</h3>
                <p>{{ gear.description }}</p>
              </article>
            </div>
          </div>
          <aside class="tool-stack" data-animate="fade-left" data-delay="220">
            <h3>创作空间升级指南</h3>
            <ul>
              <li v-for="zone in creativeZones" :key="zone.title">
                <h4>{{ zone.title }}</h4>
                <p>{{ zone.details }}</p>
              </li>
            </ul>
          </aside>
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
