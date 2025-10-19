import { createApp } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'
import LightningCanvas from './components/LightningCanvas.vue'

const tempoModules = [
  {
    tag: 'TEMPO',
    title: '内拍点校准',
    description: '利用节拍可视化工具和呼吸训练，打造内置节奏器，摆脱外部节拍依赖。'
  },
  {
    tag: 'POLYRHYTHM',
    title: '多层节奏叠加',
    description: '掌握三连音、五连音与 Breakbeat 的错位表达，让 Flow 呈现立体层次。'
  },
  {
    tag: 'SWITCH',
    title: 'Flow 切换路径',
    description: '训练速度、力度、腔调的瞬间切换，实现 Verse 到 Hook 的丝滑转换。'
  }
]

const drills = [
  {
    label: '单拍击破',
    title: 'Metronome Sniper',
    description: '围绕核心 BPM 做 16 拍精准击打，并加入随机跳拍提示，强化稳定性。'
  },
  {
    label: '律动制造',
    title: 'Swing Builder',
    description: '对拍基础上加入 Swing 偏移与 Ghost Note，构筑个性化律动口风。'
  },
  {
    label: '即兴拓展',
    title: 'Freestyle Orbit',
    description: '结合随机主题与节奏扰动，训练脑口同步，稳住 Freestyle 输出。'
  }
]

const tools = [
  {
    title: 'Lightning Beat Grid',
    details: '基于 Lightning FX 的节拍网格实时反馈，监控语句落点，纠正偏拍。'
  },
  {
    title: 'Accent Tracker',
    details: '记录重音位置与力度波形，让 Flow 的起伏更具能量冲击。'
  },
  {
    title: 'Breath Map',
    details: '可视化呼吸窗口，规划 Verse 中的换气逻辑，保证高能段落持续输出。'
  }
]

const app = createApp({
  components: {
    NavigationMenu,
    LightningCanvas
  },
  data() {
    return {
      pageTitle: '节奏练习',
      tempoModules,
      drills,
      tools
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
            <span class="eyebrow">Rhythm Lab</span>
            <h1>{{ pageTitle }}</h1>
            <p>
              以 Lightning Flow 的节奏内核构筑训练路径，结合实时节拍反馈与多层律动叠加，帮助你掌控每一次出拍。
            </p>
            <div class="cta-row" data-animate="stagger" data-delay="140">
              <a href="/rap-tutorial-vue.html" class="feature-btn primary" data-tilt data-tilt-intensity="9">回到创作体系</a>
              <a href="/rap-songs-vue.html" class="feature-btn secondary" data-tilt data-tilt-intensity="7">节奏风格对照</a>
            </div>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="240">
            <div class="visual-frame compact">
              <LightningCanvas :hue="205" :intensity="1.3" :speed="1.25" :size="0.85" :follow-pointer="true" />
              <div class="visual-overlay"></div>
            </div>
            <p class="visual-caption">节奏能量随鼠标拐点而变化，模拟现场 DJ cue 点的律动感。</p>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>CORE TEMPO</span>
            <h2>打磨内拍，构建多维度节奏感知</h2>
            <p>从基础拍点到多连音叠加，逐步雕刻你的节奏肌肉记忆。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="module in tempoModules" :key="module.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ module.tag }}</span>
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
            </article>
          </div>
        </section>

        <section class="page-section split" data-animate-group>
          <div class="split-panel" data-animate="fade-up" data-delay="160">
            <header class="section-title">
              <span>DRILL SET</span>
              <h2>随时开练的三组节奏功课</h2>
              <p>配合 Lightning Beat Grid 与 Accent Tracker，持续校准你的节奏输出。</p>
            </header>
            <div class="content-grid" data-animate="stagger" data-delay="220">
              <article v-for="drill in drills" :key="drill.title" class="content-card" data-animate-item>
                <span class="content-tag">{{ drill.label }}</span>
                <h3>{{ drill.title }}</h3>
                <p>{{ drill.description }}</p>
              </article>
            </div>
          </div>
          <aside class="tool-stack" data-animate="fade-left" data-delay="220">
            <h3>节奏实验室工具链</h3>
            <ul>
              <li v-for="tool in tools" :key="tool.title">
                <h4>{{ tool.title }}</h4>
                <p>{{ tool.details }}</p>
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
