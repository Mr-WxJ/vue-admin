/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const consoleRouter = {
  path: '/console',
  component: Layout,
  redirect: '/console',
  name: 'Console',
  meta: { title: '控制台', icon: 'console' },
  children: [
    {
      path: 'robot_list',
      name: 'RobotList',
      component: () => import('@/views/console/robot_list'),
      meta: { title: '机器人列表' }
    },
    {
      path: 'union',
      name: 'Union',
      meta: { title: '联盟配置' },
      redirect: '/console/union',
      children: [
        {
          path: 'tb_union',
          component: () => import('@/views/console/union/tb_union'),
          name: 'TB_Union',
          meta: { title: '淘宝联盟' }
        },
        {
          path: 'jd_union',
          component: () => import('@/views/console/union/tb_union'),
          name: 'JD_Union',
          meta: { title: '京东联盟' }
        }
      ]
    },
    {
      path: 'reply_template',
      name: 'ReplyTemplate',
      component: () => import('@/views/console/reply_template'),
      meta: { title: '回复配置' }
    },
    {
      path: 'rebate_percentage',
      name: 'RebatePercentage',
      component: () => import('@/views/console/rebate_percentage'),
      meta: { title: '返利比例' }
    },
    {
      path: 'order_sync',
      name: 'OrderSync',
      component: () => import('@/views/console/order_sync'),
      meta: { title: '订单同步设置' }
    }
  ]
}

export default consoleRouter
