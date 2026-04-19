/*
 * @Description: 权限守卫
 */
import router from './index'
import { useUserStore } from '@/store/modules/user'
import { useRouteStore } from '@/store/modules/route'
import { ElMessage } from 'element-plus'

// 白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()

  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = userStore.roles !== null && userStore.roles !== undefined && userStore.roles.length > 0
      console.log("🚀 ~ hasRoles:", hasRoles)

      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.getInfo()

          // 生成动态路由
          const accessRoutes = await routeStore.generateRoutes(userStore.roles)

          // 添加路由
          accessRoutes.forEach(item => {
            router.addRoute(item)
          })
          
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.logout()
          ElMessage.error('登录已失效')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})