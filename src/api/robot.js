import request from '@/utils/request'

export function fetchRobotList(query) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/robot/simple/list',
    method: 'get',
    params: query
  })
}
export function fetchRobotFriendList(wxid) {
  return request({
    url: 'http://127.0.0.1:4523/m1/1810664-0-default/vue-admin/robot/friend/simple/list',
    method: 'get',
    params: { wxid }
  })
}

export function updateRobot(data) {
  return request({
    url: '/vue-admin/union/tb/update',
    method: 'post',
    data
  })
}
