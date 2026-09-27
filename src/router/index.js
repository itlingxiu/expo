import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import MarkdownPage from '@/components/MarkdownPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    // 所有文档页面走同一个 MarkdownPage，按路径查找对应内容
    { path: '/:pathMatch(.*)*', name: 'docs', component: MarkdownPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // 交给浏览器滚动到锚点（内容渲染完成后由 MarkdownPage 处理）
      return new Promise((resolve) => {
        setTimeout(() => resolve({ el: to.hash, top: 80 }), 80)
      })
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
