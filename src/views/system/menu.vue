<!--
 * @Description: 菜单管理
-->
<template>
	<div class="menu-container my-content">
		<div class="header-box">
			<el-button type="primary" @click="openAdd">新增菜单</el-button>
			<el-button
				type="danger"
				@click="batchDelete"
				:disabled="selectedIds.length === 0"
			>
				批量删除
			</el-button>
			<el-button type="success" @click="getList">刷新</el-button>
		</div>

		<!-- 树形表格 -->
		<el-table
			:data="menuTree"
			border
			row-key="id"
			default-expand-all
			class="my-table"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="label" label="菜单名称" min-width="150" />
			<el-table-column prop="path" label="路由路径" min-width="180" />
			<el-table-column prop="icon" label="图标" width="100" />
			<el-table-column prop="sort" label="排序" width="80" />
			<el-table-column label="操作" width="220">
				<template #default="scope">
					<el-button type="primary" size="small" @click="openEdit(scope.row)"
						>编辑</el-button
					>
					<el-button
						type="danger"
						size="small"
						@click="handleDelete(scope.row.id)"
						v-if="canDelete(scope.row)"
					>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogVisible" title="菜单信息" width="550px">
			<el-form :model="form" label-width="100px">
				<el-form-item label="菜单名称">
					<el-input v-model="form.label" placeholder="请输入菜单名称" />
				</el-form-item>
				<el-form-item label="上级菜单">
					<el-select v-model="form.parentId" placeholder="请选择上级菜单">
						<el-option label="顶级菜单" value="0" />
						<el-option
							v-for="item in parentOptions"
							:key="item.id"
							:label="item.label"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="路由路径">
					<el-input v-model="form.path" placeholder="如 /system/user" />
				</el-form-item>
				<el-form-item label="菜单图标">
					<el-input v-model="form.icon" placeholder="如 HomeFilled" />
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number
						v-model="form.sort"
						:min="1"
						:max="99"
						style="width: 100%"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu'

// 数据
const menuList = ref([])
const selectedIds = ref([])

// 表单
const dialogVisible = ref(false)
const form = ref({})
const isEdit = ref(false)

// 树形结构转换
const menuTree = computed(() => {
  const map = {}
  menuList.value.forEach(m => (map[m.id] = { ...m, children: [] }))

  // 排序
  const sortedList = [...menuList.value].sort((a, b) => a.sort - b.sort)

  const tree = []
  sortedList.forEach(m => {
    if (m.parentId === '0') {
      tree.push(map[m.id])
    } else if (map[m.parentId]) {
      map[m.parentId].children.push(map[m.id])
      // 子菜单排序
      map[m.parentId].children.sort((a, b) => a.sort - b.sort)
    }
  })
  return tree
})

// 上级菜单选项（排除自己）
const parentOptions = computed(() => {
  return menuList.value.filter(i => i.id !== form.value.id)
})

// 初始化
onMounted(async () => {
  await getList()
})

// 获取菜单
const getList = async () => {
  try {
    let data = await getMenuList()
    menuList.value = data.map(item => ({
      ...item,
      id: String(item.id),
      parentId: String(item.parentId),
      sort: Number(item.sort)
    }))
  } catch (e) {
    console.error(e)
  }
}

// 多选监听
const handleSelectionChange = (val) => {
  selectedIds.value = val.map(i => String(i.id))
}

// 核心：判断菜单是否可删除
const canDelete = (row) => {
  // 顶级菜单（首页、个人中心、系统管理）不可删
  if (['1', '2', '3'].includes(row.id)) {
    return false
  }
  // 系统管理下的所有子菜单（parentId === '3'）不可删
  if (row.parentId === '3') {
    return false
  }
  // 其他可删
  return true
}

// 新增
const openAdd = () => {
  isEdit.value = false
  form.value = {
    label: '',
    path: '',
    icon: '',
    parentId: '0',
    sort: 1 // 直接用数字
  }
  dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
  isEdit.value = true
  form.value = { 
    ...row,
    sort: Number(row.sort) // 确保是数字
  }
  dialogVisible.value = true
}

// 提交
const submitForm = async () => {
  try {
    if (isEdit.value) {
      await updateMenu(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await addMenu(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()
  } catch {
    ElMessage.error('操作失败')
  }
}

// 删除（单个）
const handleDelete = async (id) => {
  id = String(id)
  const menu = menuList.value.find(m => m.id === id)
  
  // 双重校验
  if (!canDelete(menu)) {
    ElMessage.warning('系统核心菜单不可删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定删除？')
    await deleteMenu(id)
    ElMessage.success('删除成功')
    getList()
  } catch {
    ElMessage.info('已取消')
  }
}

// 批量删除
const batchDelete = async () => {
  const protectIds = ['1', '2', '3']
  const protectedChildrenIds = menuList.value
    .filter(m => m.parentId === '3')
    .map(m => m.id)
  const allProtectedIds = [...protectIds, ...protectedChildrenIds]

  // 检查是否包含受保护菜单
  if (selectedIds.value.some(id => allProtectedIds.includes(id))) {
    ElMessage.warning('包含系统核心菜单，不可删除')
    return
  }

  try {
    await ElMessageBox.confirm('确定删除选中项？')
    for (const id of selectedIds.value) await deleteMenu(id)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    getList()
  } catch {}
}
</script>


<style scoped></style>
