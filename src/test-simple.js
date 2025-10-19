import { createApp } from 'vue'

console.log('test-simple.js 已加载')

const app = createApp({
  data() {
    return {
      message: 'Vue 加载成功！'
    }
  },
  template: `
    <div style="border: 2px solid cyan; padding: 20px; margin: 20px 0; color: cyan;">
      <h2>{{ message }}</h2>
      <p>如果你能看到这个，说明 Vue 3 正常工作</p>
    </div>
  `,
  mounted() {
    console.log('Vue app 已挂载')
  }
})

console.log('准备挂载 Vue app')
app.mount('#app')
console.log('Vue app 挂载完成')
