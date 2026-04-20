/*
 * @Description: 菜单接口
 */
import request from '@/utils/request'

// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/menus',
    method: 'get'
  })
}

// 新增
export function addMenu(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  })
}

// 修改
export function updateMenu(id, data) {
  return request({
    url: `/menus/${id}`,
    method: 'put',
    data
  })
}

// 删除
export function deleteMenu(id) {
  return request({
    url: `/menus/${id}`,
    method: 'delete'
  })
}