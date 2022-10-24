/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const adminMangerRouter = {
  path: '/admin-manger',
  component: Layout,
  redirect: '/admin-manger',
  name: 'Order',
  meta: { title: '后台管理', icon: 'admin-manger' },
  children: [
    {
      path: 'wallet',
      name: 'Wallet',
      component: () => import('@/views/admin-manger/members'),
      meta: { title: '会员列表' }
    },
    {
      path: 'cash-out',
      name: 'TbOrderTable',
      component: () => import('@/views/admin-manger/web-setting'),
      meta: { title: '基础设置' }
    }
  ]
}
export default adminMangerRouter
