import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

//Element Plus组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//路由
import router from './router'

const app = createApp(App)

//ElementPlus使用中文，使用其他语言，可仿照zhCn引入其他包
app.use(ElementPlus, {
  locale: zhCn
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)

app.mount('#app')