/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const financialRouter = {
  path: '/financial',
  component: Layout,
  redirect: '/financial',
  name: 'Order',
  meta: { title: '财务中心', icon: 'financial' },
  children: [
    {
      path: 'wallet',
      name: 'Wallet',
      component: () => import('@/views/financial/wallet'),
      meta: { title: '钱包' }
    },
    {
      path: 'rebate',
      name: 'Rebate',
      component: () => import('@/views/financial/index'),
      redirect: '/console/union',
      children: [
        {
          path: 'record',
          name: 'TbOrderTable',
          component: () => import('@/views/financial/rebate/record'),
          meta: { title: '提现记录' }
        }
      ]
    }
  ]
}
export default financialRouter
