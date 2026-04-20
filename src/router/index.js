import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/modules/user'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { hidden: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
      }
    ]
  },
  {
    path: '/error',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router