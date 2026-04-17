/*
 * @Description: 动态路由
 */
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [],
    addRoutes: []
  }),

  actions: {
    // 生成路由（根据权限）
    generateRoutes(roles) {
      return new Promise(resolve => {
        // 这里模拟：admin 拥有所有权限
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes
        } else {
          accessedRoutes = []
        }

        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})

// 异步路由（需要权限的页面）
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
      }
    ]
  }
]