<!--
 * @Description: 
-->
<template>
  <div class="navbar">
    <div class="right-menu">
      <span>欢迎，{{ userStore.userInfo.name }}</span>
      <el-button @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const emit = defineEmits(['onLogout']);
const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  emit('onLogout')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  height: 50px;
  align-items: center;
}
.right-menu {
  display: flex;
  gap: 15px;
  align-items: center;
}
</style>