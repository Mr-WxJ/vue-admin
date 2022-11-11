/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order',
  name: 'Order',
  meta: { title: '订单', icon: 'orders' },
  children: [
    {
      path: 'tb',
      name: 'TbOrder',
      component: () => import('@/views/order/tb'),
      meta: { title: '淘宝订单', icon: 'tb_lm' }
    },
    {
      path: 'jd',
      name: 'JdOrder',
      component: () => import('@/views/order/jd'),
      meta: { title: '京东订单', icon: 'jd' }
    },
    {
      path: 'table',
      name: 'TbOrder',
      component: () => import('@/views/order/table'),
      meta: { title: '订单模板', icon: 'orders' }
    }

  ]
}
export default orderRouter
