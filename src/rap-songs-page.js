import { createApp } from 'vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'
import LightningCanvas from './components/LightningCanvas.vue'

const spotlight = [
  {
    tag: 'HOT WAVE',
    title: '华语说唱热榜脉冲',
    description: '收录本周爆火的华语单曲，智能捕捉 Hook 言语记忆点与律动核心。'
  },
  {
    tag: 'UNDERGROUND',
    title: '街头态度采样库',
    description: '集合全国各地地下厂牌作品，保持锋利态度与真实表达。'
  },
  {
    tag: 'LEGACY',
    title: '黄金年代经典回放',
    description: '从 Boom Bap 到 G-Funk，重新回味影响世代的声音模板。'
  }
]

const newDrops = [
  {
    label: '周更精选',
    title: 'New School Drop 05',
    description: 'Lightning AI 每周追踪全球新声，精选 12 首值得关注的新人作品。'
  },
  {
    label: '跨界融合',
    title: 'Electro-Hop Fusion',
    description: '集成电音与说唱的跨界尝试，适合舞台和 Workout 的高能曲单。'
  },
  {
    label: '歌词焦点',
    title: 'Lyricist Spotlight',
    description: '以歌词故事为核心，每首歌附带语义解读与 punchline 线索。'
  }
]

const vibeSets = [
  {
    title: 'Deep Night Drive',
    details: '适合夜晚巡航的低频包围感曲单，节奏平稳却暗含张力。'
  },
  {
    title: 'Cypher Warmup',
    details: 'Cypher 前快速进入状态的伴奏合集，从 85 BPM 到 110 BPM。'
  },
  {
    title: 'Microphone Queen',
    details: '女性说唱者力量集结，展示态度、技术与魅力的多重样貌。'
  }
]

const app = createApp({
  components: {
    NavigationMenu,
    LightningCanvas
  },
  data() {
    return {
      pageTitle: '歌曲库',
      spotlight,
      newDrops,
      vibeSets
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
            <span class="eyebrow">Lightning Playlist Hub</span>
            <h1>{{ pageTitle }}</h1>
            <p>
              由 Lightning Flow 筛选的说唱精选歌单，涵盖热门、地下与经典脉络。
              同步提供歌词亮点、律动类型与制作标签，帮你快速找到灵感源。 
            </p>
            <div class="cta-row" data-animate="stagger" data-delay="140">
              <a href="/rap-practice-vue.html" class="feature-btn primary" data-tilt data-tilt-intensity="9">打开节奏训练</a>
              <a href="/rap-tutorial-vue.html" class="feature-btn ghost" data-tilt data-tilt-intensity="7">回到教程核心</a>
            </div>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="240">
            <div class="visual-frame compact">
              <LightningCanvas :hue="228" :intensity="1.25" :speed="1.05" :size="0.95" :follow-pointer="true" :pulse="true" />
              <div class="visual-overlay"></div>
            </div>
            <p class="visual-caption">随音乐类型切换色调偏移，捕捉不同流派的能量肌理。</p>
          </div>
        </section>

        <section class="page-section" data-animate-group>
          <header class="section-title" data-animate="fade-up" data-delay="160">
            <span>SPOTLIGHT</span>
            <h2>三条主线，快速锁定灵感方向</h2>
            <p>按热门、地下、经典三大脉络拆解，让你的搜歌更有策略。</p>
          </header>
          <div class="content-grid" data-animate="stagger" data-delay="220">
            <article v-for="item in spotlight" :key="item.title" class="content-card" data-animate-item>
              <span class="content-tag">{{ item.tag }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section class="page-section split" data-animate-group>
          <div class="split-panel" data-animate="fade-up" data-delay="160">
            <header class="section-title">
              <span>NEW DROPS</span>
              <h2>每周更新，永远有新声音</h2>
              <p>Lightning Flow 通过 API 动态更新，为你送上最新的流派融合与剧情 Hook。</p>
            </header>
            <div class="content-grid" data-animate="stagger" data-delay="220">
              <article v-for="drop in newDrops" :key="drop.title" class="content-card" data-animate-item>
                <span class="content-tag">{{ drop.label }}</span>
                <h3>{{ drop.title }}</h3>
                <p>{{ drop.description }}</p>
              </article>
            </div>
          </div>
          <aside class="tool-stack" data-animate="fade-left" data-delay="220">
            <h3>氛围曲单推荐</h3>
            <ul>
              <li v-for="vibe in vibeSets" :key="vibe.title">
                <h4>{{ vibe.title }}</h4>
                <p>{{ vibe.details }}</p>
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
