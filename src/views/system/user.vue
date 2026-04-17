<!--
 * @Description: 
-->
<template>
  <div>
    <h2>用户管理</h2>
    <el-table :data="userList" border style="width:100%;margin-top:20px;">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserList } from '@/api/user'
const userList = ref([])

onMounted(async () => {
  const res = await getUserList()
  userList.value = res.list
})
</script>