<!--
 * @Description: 
-->
<template>
  <div class="navbar">
    <div class="right-menu">
      <span>欢迎，{{ userStore.userInfo.nickname }}</span>
      <el-button type="text" @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  height: 50px;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.right-menu {
  display: flex;
  gap: 15px;
  align-items: center;
}
</style>