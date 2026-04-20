/*
 * @Description: 用户管理接口
 */
import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/userList',
    method: 'get',
    params
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/userList',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(id, data) {
  return request({
    url: `/userList/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/userList/${id}`,
    method: 'delete'
  })
}