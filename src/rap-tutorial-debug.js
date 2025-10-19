import { createApp } from 'vue'
import LightningCanvas from './components/LightningCanvas.vue'
import NavigationMenu from './components/NavigationMenu.vue'
import './pages-style.css'

console.log('rap-tutorial.js 开始加载')
console.log('MagicBento:', MagicBento)
console.log('NavigationMenu:', NavigationMenu)

const cardData = [
  { color: '#000C00', title: '说唱基础知识', description: '了解说唱的起源、文化和基本概念', label: '基础' },
  { color: '#000C00', title: '韵律与节奏', description: '掌握说唱的节奏感和韵脚技巧', label: '节奏' },
  { color: '#000C00', title: 'Flow 技巧', description: '学习不同的说唱流派和技巧', label: '技巧' },
  { color: '#000C00', title: '歌词创作', description: '创作有深度和个性的说唱歌词', label: '创作' },
  { color: '#000C00', title: '舞台表现力', description: '提升现场表演的感染力和互动性', label: '表演' },
  { color: '#000C00', title: '说唱风格', description: '探索不同的说唱风格和流派特点', label: '风格' }
]

const app = createApp({
  components: {
    LightningCanvas,
    NavigationMenu
  },
  data() {
    return {
      cards: cardData,
      pageTitle: '说唱教程'
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
            <span class="eyebrow">Debug Mode</span>
            <h1>{{ pageTitle }} Debug</h1>
            <p>用于快速验证 LightningCanvas 与新布局动画是否正常运作。</p>
          </div>
          <div class="page-visual" data-animate="fade-left" data-delay="200">
            <div class="visual-frame compact">
              <LightningCanvas :hue="215" :intensity="1.1" :speed="0.9" :size="1" />
              <div class="visual-overlay"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  methods: {
    goBack() {
      window.history.back()
    }
  },
  mounted() {
    console.log('Vue app 已挂载到页面')
  }
})

console.log('准备挂载 Vue app 到 #app')
try {
  app.mount('#app')
  console.log('Vue app 挂载成功')
} catch (error) {
  console.error('挂载失败:', error)
}
