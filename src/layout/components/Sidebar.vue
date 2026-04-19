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
      <template v-for="route in menus" :key="route.path">
        <!-- 无子菜单 -->
        <el-menu-item
          v-if="!route.children && !route.meta?.hidden"
          :index="route.path"
        >
          <el-icon v-if="route.meta?.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.meta?.title || '未命名菜单' }}</span>
        </el-menu-item>

        <!-- 有子菜单 -->
        <el-sub-menu
          v-else-if="route.children && !route.meta?.hidden"
          :index="route.path"
        >
          <template #title>
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta?.title || '未命名菜单' }}</span>
          </template>
          <template v-for="child in route.children" :key="child.path">
            <el-menu-item
              v-if="!child.meta?.hidden"
              :index="`${route.path}/${child.path}`"
            >
              <span>{{ child.meta?.title || '未命名子菜单' }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouteStore } from '@/store/modules/route'

const routeStore = useRouteStore()

const menus = computed(() => {
  const fixedHome = [
    {
      path: '/home',
      meta: { title: '首页', icon: 'House' }
    }
  ]
  const dynamicMenus =  routeStore.routes.filter(item => !item.meta?.hidden)
  return [...fixedHome, ...dynamicMenus]
})
console.log("🚀 ~ menus:", menus.value)
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