<!--
 * @Description: 个人中心
-->
<template>
  <div class="profile-container my-content">
    <el-card shadow="hover" style="max-width: 600px; margin: 0 auto">
      <div class="card-header">
        <h3>个人中心</h3>
      </div>

      <el-form :model="form" label-width="80px" style="margin-top: 20px">
        <el-form-item label="用户ID">
          <el-input :value="userInfo.id" disabled />
        </el-form-item>

        <!-- 登录账号 不可修改 -->
        <el-form-item label="登录账号">
          <el-input :value="userInfo.username" disabled />
        </el-form-item>

        <!-- 姓名 可修改 -->
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag type="primary">{{ userInfo.roles?.[0] || 'user' }}</el-tag>
        </el-form-item>

        <!-- 密码 可修改 -->
        <el-form-item label="新密码">
          <el-input
            v-model="form.password"
            placeholder="不修改请留空"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { updateUser } from '@/api/user'

const userStore = useUserStore()
const userInfo = userStore.userInfo

// 表单
const form = reactive({
  name: userInfo.name ?? '', 
  password: ''
})

// 保存
const saveProfile = async () => {
  if (!form.name) {
    ElMessage.warning('姓名不能为空')
    return
  }

  const data = {
    ...userInfo,
    name: form.name
  }

  // 填写了密码才更新
  if (form.password) {
    data.password = form.password
  }

  await updateUser(userInfo.id, data)
  userStore.userInfo = { ...userStore.userInfo, ...data }

  ElMessage.success('保存成功')
}
</script>

<style scoped>
.card-header {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
.card-header h3 {
  margin: 0;
  font-size: 16px;
}
</style>