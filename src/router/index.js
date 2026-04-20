import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/modules/user'
import { useRouteStore } from '@/store/modules/route'
import { ElMessage } from 'element-plus'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'User' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Test',
        component: () => import('@/views/404.vue'),
        meta: { title: '测试', icon: '' }
      }
    ]
  }
]


// 动态路由（需要权限）
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
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
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 白名单
const whiteList = ['/login']
// 路由守卫
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


export default router