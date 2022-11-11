import request from '@/utils/request'

export function fetchTbUnionAccountList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/union/pid/simple/list',
    // url: '/vue-admin/union/tb/list',
    method: 'get',
    params: query
  })
}
export function fetchTbUnionAccount(id) {
  return request({
    url: '/vue-admin/union/tb/detail',
    method: 'get',
    params: { id }
  })
}

export function updateTbUnionAccount(data) {
  return request({
    url: '/vue-admin/union/tb/update',
    method: 'post',
    data
  })
}
