<!--
 * @Description: 菜单管理
-->
<template>
	<div class="menu-container my-content">
		<div class="header-box">
			<el-button type="primary" @click="openAdd">新增顶级菜单</el-button>
			<el-button type="success" @click="getList">刷新</el-button>
		</div>

		<!-- 树形表格 -->
		<el-table
			:data="menuTree"
			border
			row-key="id"
			default-expand-all
			class="my-table"
		>
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="label" label="菜单名称" min-width="150" />
			<el-table-column prop="path" label="路由路径" min-width="180" />
			<el-table-column prop="icon" label="图标" width="100" />
			<el-table-column prop="sort" label="排序" width="80" />
			<el-table-column label="是否隐藏" width="100">
				<template #default="scope">
					<el-tag :type="scope.row.hidden ? 'danger' : 'success'">
						{{ scope.row.hidden ? '隐藏' : '显示' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="280">
				<template #default="scope">
					<el-button type="primary" size="small" @click="openEdit(scope.row)">
						编辑
					</el-button>
					<el-button v-if="scope.row.parentId === '0'" type="success" size="small" @click="openAdd(scope.row)">
						新增子菜单
					</el-button>
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
				<el-form-item label="是否隐藏">
					<el-switch v-model="form.hidden" active-text="隐藏" inactive-text="显示" />
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

// 表单
const dialogVisible = ref(false)
const form = ref({})
const isEdit = ref(false)

// 树形结构
const menuTree = computed(() => {
  const map = {}
  menuList.value.forEach(m => (map[m.id] = { ...m, children: [] }))

  const sortedList = [...menuList.value].sort((a, b) => a.sort - b.sort)

  const tree = []
  sortedList.forEach(m => {
    if (m.parentId === '0') {
      tree.push(map[m.id])
    } else if (map[m.parentId]) {
      map[m.parentId].children.push(map[m.id])
      map[m.parentId].children.sort((a, b) => a.sort - b.sort)
    }
  })
  return tree
})

// 上级菜单选项
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
      sort: Number(item.sort),
      hidden: item.hidden ?? false
    }))
  } catch (e) {
    console.error(e)
  }
}

// 新增菜单
const openAdd = (parent) => {
  isEdit.value = false
  form.value = {
    label: '',
    path: '',
    icon: '',
    parentId: parent ? parent.id :'0',
    sort: 1,
    hidden: false
  }
  dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
  isEdit.value = true
  form.value = { ...row, sort: Number(row.sort) }
  dialogVisible.value = true
}

// 提交保存
const submitForm = async () => {
  // 校验
  const isExist = menuList.value.some(
    m => m.path === form.value.path && m.id !== (form.value.id || '')
  )
  if (isExist) {
    ElMessage.error('路由路径已存在！')
    return
  }

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

// 判断是否可删除
const canDelete = (row) => {
  if (['1', '2', '3'].includes(row.id)) return false
  if (row.parentId === '3') return false
  return true
}

// 删除
const handleDelete = async (id) => {
  id = String(id)
  const menu = menuList.value.find(m => m.id === id)
  
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
</script>

<style scoped></style>