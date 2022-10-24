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
      path: 'tb_order_table',
      name: 'TbOrderTable',
      component: () => import('@/views/order/tb_order_table'),
      meta: { title: '淘宝订单', icon: 'tb_lm' }
    },
    {
      path: 'jd_order_table',
      name: 'JdOrderTable',
      component: () => import('@/views/order/jd_order_table'),
      meta: { title: '京东订单', icon: 'jd' }
    },
    {
      path: 'order_table',
      name: 'TbOrderTable',
      component: () => import('@/views/order/order_table'),
      meta: { title: '订单模板', icon: 'orders' }
    }

  ]
}
export default orderRouter
