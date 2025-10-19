import { createApp, nextTick } from 'vue'
import App from './App.vue'
import './style.css'
import { initializeAnimations } from './animation-controller'

const app = createApp(App)

app.mount('#app')

nextTick(() => {
	initializeAnimations()
})
