/*
 * @Description: 登录逻辑
 */
import { defineStore } from 'pinia'
import { login } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    roles: null
  }),
  actions: {
    async login(userData) {
      const res = await login(userData)
      this.token = res.token
      this.userInfo = res
      // this.roles = res.roles
      console.log("🚀 ~ this.roles:", this.roles)
      localStorage.setItem('token', this.token)
    },

    async getInfo() {
      this.userInfo = {
        id: 1,
        username: 'admin',
        nickname: '超级管理员',
        roles: ['admin'],
        token: 'admin-token-123456'
      }
      this.roles = ['admin']
    },

    logout() {
      this.token = ''
      this.userInfo = {}
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})