<!--
 * @Description: 侧边栏
-->
<template>
	<el-aside width="220px" class="aside">
		<div class="logo">后台管理系统</div>
		<el-menu
			router
			mode="vertical"
			:default-active="$route.path"
			background-color="#002033"
			text-color="#fff"
			active-text-color="#409eff"
		>
			<template v-for="item in showMenus" :key="item.id">
				<!-- 无子菜单-->
				<el-menu-item
					v-if="!item.children || item.children.length === 0"
					:index="item.path"
				>
					<el-icon v-if="item.icon">
						<component :is="item.icon" />
					</el-icon>
					<span>{{ item.label }}</span>
				</el-menu-item>

				<!-- 有子菜单-->
				<el-sub-menu v-else :index="item.path">
					<template #title>
						<el-icon v-if="item.icon">
							<component :is="item.icon" />
						</el-icon>
						<span>{{ item.label }}</span>
					</template>
					<template v-for="child in item.children" :key="child.id">
						<el-menu-item :index="child.path">
							<span>{{ child.label }}</span>
						</el-menu-item>
					</template>
				</el-sub-menu>
			</template>
		</el-menu>
	</el-aside>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getMenuList } from '@/api/menu'
import { getRoleList } from '@/api/role'

const userStore = useUserStore()
const menuList = ref([])
const roleList = ref([])

watch(
  () => [userStore.refreshPermission, userStore.token],
  ([newRefresh, newToken]) => {
    // token为空,清空数据
    if (!newToken) {
      menuList.value = []
      roleList.value = []
      return
    }
    // 刷新
    getList()
  },
  { deep: true, immediate: false }
)


onMounted(() => {
  getList();
})

const getList = async () => {
  try {
    // 菜单列表
		const data = await getMenuList()
		menuList.value = data.map((m) => ({
			...m,
			id: String(m.id),
			parentId: String(m.parentId),
			sort: Number(m.sort),
			children: [],
    }))
    // 角色列表
    roleList.value = await getRoleList()
	} catch (e) {}
}

// 构建树形结构（父子关系并排序）
const treeMenus = computed(() => {
	const map = {}
	menuList.value.forEach((m) => {
		map[m.id] = { ...m, children: [] }
	})

	const tree = []
	const sorted = [...menuList.value].sort((a, b) => a.sort - b.sort)

	sorted.forEach((m) => {
		if (m.parentId === '0') {
			tree.push(map[m.id])
		} else if (map[m.parentId]) {
			map[m.parentId].children.push(map[m.id])
			map[m.parentId].children.sort((a, b) => a.sort - b.sort)
		}
	})
	return tree
})

// 权限过滤
const showMenus = computed(() => {
	const user = userStore.userInfo
	if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return []
  }

	const role = roleList.value.find((r) => r.code === user.roles[0])
	if (!role) return []

	const menuIds = new Set(role.menuIds.map(String))

	// 过滤出有权限的一级菜单
	return treeMenus.value.filter((m) => menuIds.has(m.id))
})
</script>

<style lang="scss" scoped>
.aside {
	background: #002033;
	height: 100vh;
}
.logo {
	height: 60px;
	line-height: 60px;
	color: #fff;
	font-size: 16px;
	text-align: center;
	background: #001528;
}
</style>
