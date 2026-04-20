<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2>后台管理系统</h2>

      <el-form v-model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({
  username: 'admin',
  password: '123456'
})

const handleLogin = async () => {
  try {
    await userStore.login(form.value)
    ElMessage.success('登录成功')

    const redirect = route.query.redirect || '/home'
    console.log("准备跳转到：", redirect)
    router.push(redirect)
  } catch (err) {
    ElMessage.error('登录失败：' + err.message)
    console.error(err)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}
.login-box {
  width: 400px;
  padding: 30px;
}
</style>