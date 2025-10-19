# 🐛 黑屏问题调试指南

## 📋 问题描述
除首页外的所有导航页面（rap-tutorial-vue.html 等）显示黑屏，无任何内容。

## 🔍 调试步骤

### 1. **打开浏览器开发者工具**
在浏览器中按 **F12** 打开开发者工具

### 2. **访问测试页面**
请依次访问以下页面，并查看控制台（Console）标签页的错误信息：

#### 测试页面 (最简单)
- http://localhost:3000/test-simple.html
- **预期**: 应该看到绿色边框的提示 "Vue 加载成功！"
- **如果失败**: 记录控制台的错误信息

#### 调试版教程页面
- http://localhost:3000/rap-tutorial-debug.html
- **预期**: 应该看到 MagicBento 卡片
- **控制台应该显示**:
  ```
  rap-tutorial.js 开始加载
  MagicBento: [Object]
  NavigationMenu: [Object]
  准备挂载 Vue app 到 #app
  Vue app 挂载成功
  Vue app 已挂载到页面
  ```

#### 原始教程页面
- http://localhost:3000/rap-tutorial-vue.html
- **如果失败**: 查看控制台错误

### 3. **常见错误及解决方案**

#### 错误 1: "Failed to resolve module specifier"
```
Failed to resolve module specifier 'vue'
```
**原因**: node_modules 未安装或路径错误
**解决**: 运行 `npm install`

#### 错误 2: "Uncaught SyntaxError"
```
Uncaught SyntaxError: Unexpected token
```
**原因**: JavaScript 或 Vue 组件语法错误
**解决**: 检查具体的文件和行号

#### 错误 3: "[Vue warn]: Failed to resolve component"
```
[Vue warn]: Failed to resolve component: MagicBento
```
**原因**: 组件导入失败
**解决**: 检查组件文件路径是否正确

#### 错误 4: "Cannot read property 'xxx' of undefined"
**原因**: 数据或 props 未正确传递
**解决**: 检查组件的 props 和 data

### 4. **检查网络请求**
在开发者工具中切换到 **Network（网络）** 标签页：
- 刷新页面
- 查看所有请求是否成功（状态码 200）
- 特别注意:
  - `/src/rap-tutorial.js` - 是否加载成功
  - `/src/components/MagicBentoSimple.vue` - 是否加载成功
  - `/src/components/NavigationMenu.vue` - 是否加载成功

### 5. **检查元素**
在开发者工具中切换到 **Elements（元素）** 标签页：
- 查看 `<div id="app"></div>` 是否存在
- 查看 `#app` 内部是否有内容被渲染
- 如果 `#app` 是空的，说明 Vue 没有挂载成功

## 🛠️ 快速修复尝试

### 方案 1: 清除缓存重启
```powershell
# 停止开发服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```
在浏览器中强制刷新: **Ctrl + Shift + R** (或 **Ctrl + F5**)

### 方案 2: 重新安装依赖
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
npm run dev
```

### 方案 3: 检查 GSAP 是否安装
```powershell
npm list gsap
```
如果未安装:
```powershell
npm install gsap
```

## 📝 请提供以下信息

访问以下页面后，请告诉我：

1. **test-simple.html** 的控制台输出是什么？
2. **rap-tutorial-debug.html** 的控制台输出是什么？
3. **rap-tutorial-vue.html** 的控制台是否有错误？具体错误信息是什么？
4. **Network 标签页** 中是否有失败的请求（红色或黄色）？

## 🔧 可能的原因

基于之前的修复，可能的原因有：

1. ✅ ~~TypeScript 错误~~ - 已删除 MagicBento.vue
2. ✅ ~~重复的 onMounted~~ - 已修复
3. ❓ **GSAP 未安装** - 需要确认
4. ❓ **Vue 组件编译错误** - 需要查看控制台
5. ❓ **模板语法错误** - 需要查看控制台
6. ❓ **CSS 导入失败** - 需要查看 Network 标签页

## 📂 文件状态确认

请确认以下文件存在且没有错误：

- ✅ `src/components/MagicBentoSimple.vue` - 374行，纯JavaScript
- ✅ `src/components/NavigationMenu.vue` - 应该存在
- ✅ `src/rap-tutorial.js` - 57行
- ✅ `src/pages-style.css` - 应该存在
- ✅ `rap-tutorial-vue.html` - HTML 入口文件

---

**下一步**: 请访问测试页面并告诉我控制台的输出内容！
