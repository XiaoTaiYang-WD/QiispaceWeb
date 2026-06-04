import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页 - 栖愈 QIISPACE' },
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/views/Services.vue'),
    meta: { title: '服务介绍 - 栖愈 QIISPACE' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于我们 - 栖愈 QIISPACE' },
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('@/views/Stores.vue'),
    meta: { title: '门店列表 - 栖愈 QIISPACE' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || '栖愈 QIISPACE'
})

export default router
