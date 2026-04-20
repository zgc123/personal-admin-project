/*
 * @Description: 登录逻辑
 */
import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    roles: null,
    refreshPermission: 0, // 菜单权限变化
  }),
  actions: {
    // 登录
    async login (userData) {
      try {
        const res = await login(userData)
        this.token = res.token
        this.userInfo = res;
        localStorage.setItem('token', this.token)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取用户信息
    async getInfo () {
      try {
        const res = await getUserInfo()
        if (Object.keys(res).length !== 0) {
          this.userInfo = res;
          this.roles = res.roles
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 退出登录
    logout () {
      this.token = ''
      this.userInfo = {}
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})