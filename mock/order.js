const Mock = require('mockjs')

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'goodsInfo': {
      'item_image': '@image', // item_image,
      'itemUrl': '@url',
      'shopName': '@cword(5)',
      'itemName': '@cword(15)',
      'orderId|1-10': '@integer' // 订单号
    },
    'wxName': '@cname', // 微信名
    'paidTime': '@date', // 下单时间
    'finishTime': '@date', // 完成时间

    'orderStatus|1': ['3', '12', '13', '14'], // 订单状态

    'commissionRate': '5.0', // 佣金比例
    'subSideRate': '90.0', // 分成比例
    'platformRate': '90.0', // 平台比例
    'finalRate': '90.0', // 最终分佣比例（单位：%）
    'deductFee': '0.0', // 扣除的服务费

    'estimateCosPrice': '54.0', // 预估计佣金额
    'actualCosPrice': '0.0', // 实际计佣金额
    'estimateFee': '2.43', // 预估佣金
    'actualFee': '0.0' // 实际佣金

  }))
}

module.exports = [
  {
    url: '/vue-admin/order/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-admin/order/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-admin/order/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-admin/order/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin/order/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

