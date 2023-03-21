import request from '@/utils/request'

// 根据条件查询全部订单列表
export function fetchTbOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/list',
    // url: '/vue-admin/order/list',
    method: 'get',
    params: query
  })
}

// 根据筛选条件查询全部淘宝退款订单列表
export function fetchTbRefundOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/refund/list',
    method: 'get',
    params: query
  })
}
// 根据筛选条件查询指定淘宝退款订单详情信息
export function fetchTbRefundOrderInfo(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/refund/info',
    method: 'get',
    params: query
  })
}

// 根据筛选条件查询全部淘宝已删除订单列表
export function fetchTbRecycleOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/tb/order/recycle/list',
    method: 'get',
    params: query
  })
}

// 更新订单信息
export function updateOrder(data) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/order/update',
    method: 'post',
    data
  })
}

// 根据条件查询全部京东订单列表
export function fetchJdOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/jd/order/list',
    // url: '/vue-admin/order/list',
    method: 'get',
    params: query
  })
}

// 根据筛选条件查询全部京东已删除订单列表
export function fetchJdRefundOrderList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/jd/order/recycle/list',
    method: 'get',
    params: query
  })
}

