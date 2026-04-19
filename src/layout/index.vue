/*
 * @Description: 布局系统
 */
 <template>
  <div class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">后台管理系统</div>
      <el-menu
        router
        mode="vertical"
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#409eff"
      >
        <template v-for="route in routes" :key="route.path">
          <!-- 无子菜单 -->
          <el-menu-item
            v-if="!route.children && !route.meta?.hidden"
            :index="route.path"
          >
            <i class="el-icon">{{ route.meta?.icon }}</i>
            <span>{{ route.meta?.title }}</span>
          </el-menu-item>

          <!-- 有子菜单 -->
          <el-sub-menu
            v-else-if="route.children && !route.meta?.hidden"
            :index="route.path"
          >
            <template #title>
              <i class="el-icon">{{ route.meta?.icon }}</i>
              <span>{{ route.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="route.path + '/' + child.path"
            >
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <div class="main">
      <el-header class="header">
        <div class="right">
          <span>{{ userStore.userInfo?.nickname || '管理员' }}</span>
          <el-button @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { useRouteStore } from '@/store/modules/route'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const routeStore = useRouteStore()
const userStore = useUserStore()
const router = useRouter()
const routes = routeStore.routes

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  background: #f5f5f5;
}
.aside {
  background: #002033;
  height: 100vh;
}
.logo {
  height: 60px;
  line-height: 60px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  background: #001528;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px #eee;
}
.content {
  flex: 1;
  margin: 20px;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}
</style>