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
  console.log("🚀 ~ userStore:", userStore)

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = userStore.roles && userStore.roles.length > 0
      console.log("🚀 ~ hasRoles:", hasRoles)
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
         const res = await userStore.getInfo()
          console.log("🚀 ~ res:", res)
          // 生成动态路由
          const accessRoutes = await routeStore.generateRoutes(userStore.roles)
          console.log("🚀 ~ accessRoutes:", accessRoutes)
          // 添加路由
          accessRoutes.forEach(item => {
            router.addRoute(item)
          })
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.logout()
          ElMessage.error('出错了')
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