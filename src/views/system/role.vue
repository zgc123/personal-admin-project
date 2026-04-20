<!--
 * @Description: 角色管理页面
-->
<template>
	<div class="role-container my-content">
		<div class="header-box">
			<el-button type="primary" @click="openAdd">新增角色</el-button>
			<el-button
				type="danger"
				@click="batchDelete"
				:disabled="selectedIds.length === 0"
			>
				批量删除
			</el-button>
			<el-button type="success" @click="getList">刷新</el-button>
		</div>

		<el-table
			:data="roleList"
			border
      class="my-table"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="name" label="角色名称" />
			<el-table-column prop="code" label="角色编码" />
			<el-table-column label="菜单权限" min-width="200">
				<template #default="scope">
					<span class="text-regular">
						{{ getMenuNames(scope.row.menuIds) }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template #default="scope">
					<el-button type="primary" size="small" @click="openEdit(scope.row)"
						>编辑</el-button
					>
					<el-button
						type="success"
						size="small"
						@click="openAssignMenu(scope.row)"
						>分配菜单</el-button
					>
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

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogVisible" title="角色信息" width="500px">
			<el-form :model="form" label-width="80px">
				<el-form-item label="角色名称">
					<el-input v-model="form.name" placeholder="请输入角色名称" />
				</el-form-item>
				<el-form-item label="角色编码">
					<el-select v-model="form.code" placeholder="请选择角色编码">
						<el-option label="admin" value="admin" />
						<el-option label="user" value="user" />
						<el-option label="visitor" value="visitor" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">保存</el-button>
			</template>
		</el-dialog>

		<!-- 分配菜单弹窗 -->
		<el-dialog
			v-model="menuDialogVisible"
			title="分配菜单权限"
			width="600px"
			@open="onMenuDialogOpen"
		>
			<el-tree
				ref="treeRef"
				:data="menuTree"
				show-checkbox
				node-key="id"
				class="mt-10"
			/>
			<template #footer>
				<el-button @click="menuDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveAssignMenu">保存权限</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoleList, addRole, updateRole, deleteRole } from '@/api/role'
import { getMenuList } from '@/api/menu'

const roleList = ref([])
const menuList = ref([])
const selectedIds = ref([])

// 表单
const dialogVisible = ref(false)
const form = ref({})
const isEdit = ref(false)
const currentId = ref(null)

// 分配菜单
const menuDialogVisible = ref(false)
const treeRef = ref(null)
const currentRole = ref(null)
const currentMenuIds = ref([])

// 菜单树结构
const menuTree = computed(() => {
	const map = {}
  menuList.value.forEach(m => (map[m.id] = { ...m, children: [] }))
  const tree = []
  menuList.value.forEach(m => {
    if (m.parentId === '0') tree.push(map[m.id])
    else if (map[m.parentId]) map[m.parentId].children.push(map[m.id])
  })
  return tree
})

// 获取菜单名称显示
const getMenuNames = (ids = []) => {
	return (
		menuList.value
			.filter((m) => ids.includes(m.id))
			.map((m) => m.label)
			.join('、') || '未分配'
	)
}

// 初始化
onMounted(async () => {
	await getMenuListData()
	await getList()
})

// 获取角色列表
const getList = async () => {
	try {
    const res = await getRoleList()
    roleList.value = res.map(item => ({
      ...item,
      id: String(item.id),
      menuIds: (item.menuIds || []).map(id => String(id))
    }))
	} catch (e) {
		console.error(e)
	}
}

// 获取菜单
const getMenuListData = async () => {
	try {
		const res = await getMenuList()
		menuList.value = res.map((item) => ({
			...item,
			id: String(item.id),
			parentId: String(item.parentId),
		}))
	} catch (e) {}
}

// 多选监听
const handleSelectionChange = (val) => {
	selectedIds.value = val.map((i) => i.id)
}

// 新增
const openAdd = () => {
	isEdit.value = false
	form.value = { name: '', code: 'user' }
	dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
	isEdit.value = true
	currentId.value = row.id
	form.value = { ...row }
	dialogVisible.value = true
}

// 提交保存
const submitForm = async () => {
	try {
		if (isEdit.value) {
			await updateRole(currentId.value, form.value)
			ElMessage.success('修改成功')
		} else {
			await addRole(form.value)
			ElMessage.success('新增成功')
		}
		dialogVisible.value = false
		getList()
	} catch {
		ElMessage.error('操作失败')
	}
}

// 删除
const handleDelete = async (id) => {
	if (id === 1) return ElMessage.warning('超级管理员不可删除')
	try {
		await ElMessageBox.confirm('确定删除？')
		await deleteRole(id)
		ElMessage.success('删除成功')
		getList()
	} catch {
		ElMessage.info('已取消')
	}
}

// 批量删除
const batchDelete = async () => {
	if (selectedIds.value.includes(1))
		return ElMessage.warning('包含不可删除角色')
	try {
		await ElMessageBox.confirm('确定删除选中项？')
		for (const id of selectedIds.value) await deleteRole(id)
		ElMessage.success('批量删除成功')
		selectedIds.value = []
		getList()
	} catch {}
}

// 记录id并设置
const onMenuDialogOpen = () => {
	nextTick(() => {
		treeRef.value.setCheckedKeys([])
		treeRef.value.setCheckedKeys(currentMenuIds.value)
	})
}

// 打开分配菜单
const openAssignMenu = async (row) => {
	currentRole.value = row
	currentMenuIds.value =  (row.menuIds || []).map(id => String(id))
	menuDialogVisible.value = true
}

// 保存权限
const saveAssignMenu = async () => {
	const keys = treeRef.value.getCheckedKeys()
	try {
		await updateRole(currentRole.value.id, {
			...currentRole.value,
			menuIds: keys,
		})
		ElMessage.success('权限分配成功')
		menuDialogVisible.value = false
		getList()
	} catch {
		ElMessage.error('保存失败')
	}
}
</script>

<style scoped>
</style>
