/*
 * @Description: 角色管理接口
 */
import request from '@/utils/request'

// 获取角色列表
export function getRoleList () {
  return request({
    url: '/roles',
    method: 'get'
  })
}

// 新增角色
export function addRole (data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole (id, data) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole (id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}