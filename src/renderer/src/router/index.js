import { createRouter,createWebHashHistory } from "vue-router";
const router = createRouter({
  mode:"hash",
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:"/",
      name:"index",
      redirect:"/index",
    },
    {
      path:"/index",
      name:"项目初始化",
      component:()=> import('@/views/index/index.vue')
    }
  ]
})
export default router
