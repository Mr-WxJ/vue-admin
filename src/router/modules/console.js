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
      path: 'robot',
      name: 'Robot',
      component: () => import('@/views/console/index'),
      redirect: '/console/union',
      children: [
        {
          path: 'list',
          name: 'RobotList',
          component: () => import('@/views/console/robot/list'),
          meta: { title: '机器人列表' }
        }
      ]
    },
    {
      path: 'union',
      name: 'Union',
      component: () => import('@/views/console/index'),
      meta: { title: '联盟配置' },
      redirect: '/console/union',
      children: [
        {
          path: 'tb',
          component: () => import('@/views/console/union/tb'),
          name: 'TBUnion',
          meta: { title: '淘宝联盟' }
        },
        {
          path: 'jd',
          component: () => import('@/views/console/union/jd'),
          name: 'JDUnion',
          meta: { title: '京东联盟' }
        }
      ]
    },
    {
      path: 'reply',
      name: 'Reply',
      component: () => import('@/views/console/index'),
      redirect: '/console/union',
      children: [
        {
          path: 'template',
          name: 'ReplyTemplate',
          component: () => import('@/views/console/reply/template'),
          meta: { title: '回复配置' }
        }
      ]
    },
    {
      path: 'rebate',
      name: 'Rebate',
      component: () => import('@/views/console/index'),
      redirect: '/console/union',
      children: [
        {
          path: 'rate',
          name: 'RebatePercentage',
          component: () => import('@/views/console/rebate/rate'),
          meta: { title: '返利比例' }
        }
      ]
    },
    {
      path: 'order',
      name: 'Order',
      component: () => import('@/views/console/index'),
      redirect: '/console/union',
      children: [
        {
          path: 'sync',
          name: 'OrderSync',
          component: () => import('@/views/console/order/sync'),
          meta: { title: '订单同步设置' }
        }
      ]
    }
  ]
}

export default consoleRouter
