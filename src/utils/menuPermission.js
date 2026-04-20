/*
 * @Description: 菜单权限
 */

// 构建树形菜单
export function buildMenuTree(list) {
  const map = {}
  list.forEach(m => {
    map[m.id] = { ...m, children: [] }
  })

  const sorted = [...list].sort((a, b) => a.sort - b.sort)
  const tree = []

  sorted.forEach(m => {
    if (m.parentId === '0') {
      tree.push(map[m.id])
    } else if (map[m.parentId]) {
      map[m.parentId].children.push(map[m.id])
      map[m.parentId].children.sort((a, b) => a.sort - b.sort)
    }
  })
  return tree
}

// 根据角色 menuIds 过滤有权限的菜单
export function filterMenusByRoleIds(menuList, menuIds) {
  const ids = new Set(menuIds.map(String))
  return menuList.filter(m => ids.has(String(m.id)))
}