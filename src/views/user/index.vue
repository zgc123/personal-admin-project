/*
 * @Description: 管理
 */
<template>
  <div>
    <h2>用户管理</h2>
    <el-table :data="tableData" border style="width:100%;margin-top:20px;">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tableData = ref([
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 25 }
])
</script>