import request from '@/utils/request'

export function fetchTbUnionPidSimpleList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/union/pid/simple/list',
    // url: '/vue-admin/union/tb/list',
    method: 'get',
    params: query
  })
}
export function fetchJdUnionPidSimpleList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/jd/union/pid/simple/list',
    // url: '/vue-admin/union/tb/list',
    method: 'get',
    params: query
  })
}

export function updateTbUnionAccount(data) {
  return request({
    url: '/vue-admin/union/tb/update',
    method: 'post',
    data
  })
}
