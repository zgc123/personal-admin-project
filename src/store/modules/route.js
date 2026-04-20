/*
 * @Description: 动态路由存储
 */
import { defineStore } from 'pinia'
import { constantRoutes,asyncRoutes } from '@/router'


export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [],
    addRoutes: []
  }),

  actions: {
    generateRoutes(roles) {
      return new Promise(resolve => {
        let accessedRoutes;
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes
        } else {
          accessedRoutes = asyncRoutes.filter(route => {
            if (!route.meta || !route.meta.roles) return true
            return roles.some(role => route.meta.roles.includes(role))
          })
        }

        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)

        resolve(accessedRoutes)
      })
    }
  }
})