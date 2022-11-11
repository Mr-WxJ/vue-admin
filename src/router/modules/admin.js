/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin',
  name: 'Order',
  meta: { title: '后台管理', icon: 'admin-manger' },
  children: [
    {
      path: 'members',
      name: 'Members',
      component: () => import('@/views/admin/members'),
      meta: { title: '会员列表' }
    },
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/admin/setting'),
      meta: { title: '基础设置' }
    }
  ]
}
export default adminRouter
