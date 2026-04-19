/*
 * @Description: 布局系统
 */
<template>
  <div class="layout">
    <Sidebar />

    <div class="main">
      <el-header class="header">
        <Navbar @onLogout="logout"/>
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

import { useRouteStore } from '@/store/modules/route'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const routeStore = useRouteStore()
const userStore = useUserStore()
const router = useRouter()

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