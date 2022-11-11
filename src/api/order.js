import request from '@/utils/request'

export function fetchOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/list',
    // url: '/vue-admin/order/list',
    method: 'get',
    params: query
  })
}

export function updateOrder(data) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/update',
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/delete',
    method: 'post',
    data
  })
}
