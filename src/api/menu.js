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