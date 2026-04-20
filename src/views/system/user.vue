<!--
 * @Description: 用户管理
-->
<template>
	<div class="user-container">
		<div class="header-box">
			<el-button type="primary" @click="openAdd">新增用户</el-button>
			<el-button
				type="danger"
				@click="handleBatchDelete"
				:disabled="selectedIds.length === 0"
			>
				批量删除
			</el-button>
			<el-button type="success" @click="getList">刷新</el-button>
		</div>

		<el-table
			:data="userList"
			border
      height="600"
			style="width: 100%; margin-top: 20px"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column prop="id" label="ID" />
			<el-table-column prop="name" label="姓名" />
			<el-table-column prop="username" label="账号" />
			<el-table-column prop="role" label="角色" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" size="small" @click="openEdit(scope.row)">
						编辑
					</el-button>
					<el-button
						type="danger"
						size="small"
						@click="handleDelete(scope.row.id)"
						v-if="scope.row.id !== '1'"
					>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			v-model:current-page="page"
			v-model:page-size="perPage"
			:page-sizes="[5, 10, 15, 20]"
			:total="total"
			style="margin-top: 20px; text-align: right"
			background
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="getList"
			@current-change="getList"
		/>

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogVisible" title="用户信息" width="500px">
			<el-form :model="form" label-width="80px">
				<el-form-item label="姓名">
					<el-input
						v-model="form.name"
						:disabled="form.id === '1'"
						placeholder="请输入姓名"
					/>
				</el-form-item>
				<el-form-item label="账号">
					<el-input v-model="form.username" placeholder="请输入登录账号" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input
						v-model="form.password"
						placeholder="请输入密码"
						show-password
					/>
				</el-form-item>
				<el-form-item label="角色">
					<el-select
						v-model="form.role"
						:disabled="form.id === '1'"
						placeholder="请选择角色"
					>
						<el-option label="管理员" value="admin" />
						<el-option label="普通用户" value="user" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, addUser, updateUser, deleteUser } from '@/api/user'

const userList = ref([])
const dialogVisible = ref(false)
const form = ref({})
const isEdit = ref(false)
const id = ref(null)
// 分页
const page = ref(1)
const perPage = ref(15)
const total = ref(0)
// 多选删除
const selectedIds = ref([])

onMounted(() => {
	getList()
})

// 获取列表
const getList = async () => {
	try {
		const res = await getUserList({
			_page: page.value,
			_per_page: perPage.value,
		})
		total.value = res.items
		userList.value = res.data
	} catch (err) {
		console.error(err)
	}
}

// 新增
const openAdd = () => {
	isEdit.value = false
	form.value = { name: '', username: '', password: '', role: 'user' }
	dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
	isEdit.value = true
	id.value = row.id
	form.value = { ...row }
	dialogVisible.value = true
}

// 提交
const submitForm = async () => {
	try {
		if (isEdit.value) {
			await updateUser(id.value, form.value)
			ElMessage.success('修改成功')
		} else {
			await addUser(form.value)
			ElMessage.success('新增成功')
		}
		dialogVisible.value = false
		getList()
	} catch (err) {
		ElMessage.error('操作失败')
	}
}

// 删除
const handleDelete = async (userId) => {
	try {
		await ElMessageBox.confirm('确定删除？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		await deleteUser(userId)
		ElMessage.success('删除成功')
		getList()
	} catch {
		ElMessage.info('已取消')
	}
}

// 多选监听
const handleSelectionChange = (val) => {
  selectedIds.value = val.map(item => item.id)
}

// 批量删除
const handleBatchDelete = async () => {
  // 禁止删除管理员
  if (selectedIds.value.includes('1')) {
    ElMessage.warning('包含管理员账号，不可删除！')
    return
  }
  try {
    await ElMessageBox.confirm('确定删除选中的数据？', '提示', {
      type: 'warning'
    })
    for (let uid of selectedIds.value) {
      await deleteUser(uid)
    }
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    getList()
  } catch {
    ElMessage.info('已取消')
  }
}
</script>

<style scoped>
.user-container {
	padding: 20px;
}
.header-box {
	display: flex;
	gap: 10px;
}
</style>
