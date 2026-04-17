/*
 * @Description: 用户状态
 */
import { defineStore } from 'pinia'
import { login, getInfo } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    roles: []
  }),

  actions: {
    // 登录
    async login(userInfo) {
      const res = await login(userInfo)
      this.token = res.token
      localStorage.setItem('token', res.token)
    },

    // 获取用户信息
    async getInfo() {
      const res = await getInfo()
      this.userInfo = res
      this.roles = res.roles
    },

    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = {}
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})