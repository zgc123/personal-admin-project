/*
 * @Description: 登录逻辑
 */
import { defineStore } from 'pinia'
import { login } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    roles: []
  }),
  actions: {
    async login(userData) {
      const res = await login(userData)
      this.token = res.token
      this.userInfo = res
      this.roles = res.roles
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.token = ''
      this.userInfo = {}
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})