/*
 * @Description: 动态路由
 */
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'

export const asyncRoutes = [
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user.vue'),
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role.vue'),
        meta: { title: '角色管理', roles: ['admin'] }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu.vue'),
        meta: { title: '菜单管理', roles: ['admin'] }
      },
    ]
  }
]

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [],
    addRoutes: []
  }),

  actions: {
    generateRoutes(roles) {
      console.log("🚀 ~ generateRoutes roles:", roles)
      return new Promise(resolve => {
        let accessedRoutes = roles.includes('admin') ? asyncRoutes : []
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})