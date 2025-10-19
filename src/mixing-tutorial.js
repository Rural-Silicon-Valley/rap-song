import { createApp } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'
import LightningCanvas from './components/LightningCanvas.vue'

const stages = [
  {
    tag: 'CAPTURE',
    title: '人声采集链路',
    description: '从麦克风选择、空间校准到前级增益，确保每一段录音具备可雕刻的动态余量。'
  },
  {
    tag: 'SCULPT',
    title: '频段雕刻策略',
    description: '结合 EQ 与动态 EQ，针对共振、鼻音、齿擦音进行多段位处理，保证清晰度与厚度共存。'
  },
  {
    tag: 'SPACE',
    title: '空间氛围搭建',
    description: '利用延迟、混响与自动化曲线，塑造兼具临场感和层次感的声场结构。'
  }
]

const processors = [
  {
    label: '动态控制',
    title: 'Parallel Compression',
    description: '并行压缩保留瞬态与动态，打造既有攻击力又不失饱满度的人声。'
  },
  {
    label: '音色设计',
    title: 'Saturation Stack',
    description: '通过多级饱和提升谐波，构建更贴合说唱质感的声线厚度。'
  },
  {
    label: '自动化',
    title: 'Automation Matrix',
    description: '针对呼吸、尾音、合唱效果设置自动化，让情绪张力自然递进。'
  }
]

const toolkit = [
  {
    title: 'Vocal Analyzer',
    details: '实时展示频谱与动态范围，提示需要处理的异常频段。'
  },
  {
    title: 'Reverb Designer',
    details: '预设多种空间模型，提供短混响与长尾氛围的混合参考。'
  },
  {
    title: 'Mastering Radar',
    details: '对整体响度与立体声像进行监听，确保上线标准达标。'
  }
]

const app = createApp({
  components: {
    NavigationMenu,
    LightningCanvas
  },
  data() {
    return {
      pageTitle: '混音教程',
      stages,
      processors,
      toolkit
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
            <span class="eyebrow">Mixing Forge</span>
            <h1>{{ pageTitle }}</h1>
            <p>
              将说唱人声置于最前沿的能量轨道。从录制、雕刻到混响与母带，Lightning Flow 提供完整的混音蓝图。
            </p>
            <div class="cta-row" data-animate="stagger" data-delay="140">
              <a href="/rap-practice-vue.html" class="feature-btn primary" data-tilt data-tilt-intensity="9">回到节奏实验室</a>
              <a href="/equipment-recommendation-vue.html" class="feature-btn ghost" data-tilt data-tilt-intensity="7">查看设备链路</a>
            </div>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="240">
            <div class="visual-frame compact">
              <LightningCanvas :hue="200" :intensity="1.35" :speed="0.95" :size="0.88" :follow-pointer="true" />
              <div class="visual-overlay"></div>
            </div>
            <p class="visual-caption">通过频谱驱动的能量闪烁，模拟混音时的声能变化轨迹。</p>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>STAGE FLOW</span>
            <h2>三段式流程，锁定混音核心节点</h2>
            <p>专为说唱人声设计的混音路径，确保 punchline 与律动永远在线。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="stage in stages" :key="stage.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ stage.tag }}</span>
              <h3>{{ stage.title }}</h3>
              <p>{{ stage.description }}</p>
            </article>
          </div>
        </section>

        <section class="page-section split" data-animate-group>
          <div class="split-panel" data-animate="fade-up" data-delay="160">
            <header class="section-title">
              <span>PROCESSOR STACK</span>
              <h2>动态 · 音色 · 自动化三位一体</h2>
              <p>通过并行压缩与自动化矩阵，让人声既立体又精准，保持每个字的力量感。</p>
            </header>
            <div class="content-grid" data-animate="stagger" data-delay="220">
              <article v-for="processor in processors" :key="processor.title" class="content-card" data-animate-item>
                <span class="content-tag">{{ processor.label }}</span>
                <h3>{{ processor.title }}</h3>
                <p>{{ processor.description }}</p>
              </article>
            </div>
          </div>
          <aside class="tool-stack" data-animate="fade-left" data-delay="220">
            <h3>混音监测工具组</h3>
            <ul>
              <li v-for="tool in toolkit" :key="tool.title">
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
