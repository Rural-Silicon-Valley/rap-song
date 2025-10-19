import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'components': path.resolve(__dirname, './components'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        rapTutorial: path.resolve(__dirname, 'rap-tutorial-vue.html'),
        rapPractice: path.resolve(__dirname, 'rap-practice-vue.html'),
        rapSongs: path.resolve(__dirname, 'rap-songs-vue.html'),
        mixingTutorial: path.resolve(__dirname, 'mixing-tutorial-vue.html'),
        equipmentRecommendation: path.resolve(__dirname, 'equipment-recommendation-vue.html')
      }
    }
  }
})
