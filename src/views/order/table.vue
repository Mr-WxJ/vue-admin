<template>
  <div class="app-container">
    <div class="middle-body-background">
      <div class="filter-container">
        <div class="tool-left-all">
          <div class="tool-left">
            <el-tooltip content="请选择要查看的机器人" placement="top-start" effect="light" transition="el-fade-in-linear">
              <el-select v-model="orderListQuery.robotWxid" placeholder="机器人" class="filter-item" style="width: 150px" left size="small">
                <el-option v-for="item in robotOptions" :key="item.wxid" size="small" :label="item.wxName" :value="item.wxid" />
              </el-select>
            </el-tooltip>
          </div>
          <div class="tool-left">
            <el-tooltip content="请选择要查看的推广位" placement="top" effect="light" transition="el-fade-in-linear">
              <el-select v-model="orderListQuery.pid" placeholder="请选择推广位" class="filter-item" style="width: 200px" left size="small">
                <el-option v-for="item in tbUnionAccountOptions" :key="item.pid" size="small" :label="item.pidName" :value="item.pid" />
              </el-select>
            </el-tooltip>
          </div>
          <div class="tool-left-fee">
            <el-tooltip content="是否查看总佣金" placement="top" effect="light" transition="el-fade-in-linear">
              <el-switch v-model="showFinalFee" size="small" class="filter-item" active-text="总佣金" @change="tableKey = tableKey + 1">佣金</el-switch>
            </el-tooltip>
          </div>
        </div>
        <div class="tool-right-all">
          <div class="tool-right">
            <el-tooltip content="导出所有订单" placement="bottom" effect="light" transition="el-fade-in-linear">
              <el-button v-waves :loading="downloadLoading" class="filter-item" size="small" type="success" plain icon="el-icon-download" @click="handleDownload">导出</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="filter-container">
        <div class="tool-left-all">
          <div class="tool-left">
            <el-select v-model="orderListQuery.orderStatus" placeholder="全部订单" class="filter-item" left size="small" style="width: 150px; margin-bottom: 20px;">
              <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.name" :value="item.value" size="small" />
            </el-select>
          </div>
          <div class="tool-left">
            <dateSelect ref="dateTimeRef" @dateRangeChange="dateTimeChange" />
          </div>
          <div class="tool-left">
            <el-input v-model="orderListQuery.orderId" size="small" placeholder="订单号" style="width: 220px" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
        </div>
      </div>

      <el-table :key="tableKey" v-loading="listLoading" size="small" :data="orderList" fit style="width: 100%" :header-cell-style="{height: '60px',}">
        <el-table-column label="订单信息" min-width="480px" align="left">
          <template slot-scope="{ row }">
            <div class="order-goodsInfo">
              <div class="order-itemImg">
                <a :href="row.goodsUrl" style=" width: 100% ; height: 80px">
                  <el-image :src="row.goodsImgUrl" class="cover" style="width: 100%  ; height: 80px" />
                </a>
              </div>
              <div class="order-info">
                <div class="order-info-name"><a :href="row.goodsUrl">{{ row.goodsName }}</a></div>
                <div class="order-info-left">店铺名：{{ row.shopName }}</div>
                <div class="order-info-left"><span v-if=" (row.orderStatus) === 13 " class="order-time">{{ row.finishTime }} 失效</span></div>
                <div class="order-info-left"><span>父订单编号：{{ row.parentOrderId }}</span></div>
                <div class="order-info-left"><span>子订单编号：{{ row.orderId }}</span><span v-if="row.finishTime" class="order-time">{{ row.finishTime }} 结算</span></div>
                <div><span class="order-info-money">付款金额：<span class="paid-money">￥{{ row.payPrice }}</span></span><span class="order-time">{{ row.payTime }} 付款</span></div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单状态" min-width="100px" align="center" :render-header="orderStatusTooltips">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-select v-model="row.tbOrderStatusEnum.code" size="mini" value-key="Code" placeholder="请选择">
                <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.name" :value="item.value" size="mini" />
              </el-select>
            </template>
            <span v-else>
              <el-tag :type="row.tbOrderStatusEnum.code | codeToTagFilter">{{ row.tbOrderStatusEnum.status }}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="微信备注" min-width="100px" align="left">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-select v-model="row.wxName" filterable clearable size="mini" value-key="Code" placeholder="请选择">
                <el-option v-for="item in robotFriendOptions" :key="item.wxid" size="mini" :label="item.wxName" :value="item.wxid" />
              </el-select>
            </template>
            <span v-else>
              <span style="font-weight: bold">{{ row.wxName }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="佣金比例" min-width="130px" align="left">
          <template slot-scope="{ row }">
            <div class="rate-info">
              <div class="rate-info"><span>佣金比例：<span class="rate-info-data">{{ row.feeRate }}%</span></span></div>
              <div class="rate-info"><span>分成比例：<span class="rate-info-data">{{ row.subSideRate }}%</span></span></div>
              <div class="rate-info"><span>平台比例：<span class="rate-info-data">{{ row.platformRate }}%</span></span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户佣金" min-width="180px">
          <template slot-scope="{ row }">
            <div v-if=" (row.orderStatus) !== 13 " class="rate-info">
              <div class="rate-info"><span>付款预估佣金：</span><span class="rate-info-data">￥{{ row.payUserFee }}</span></div>
              <div v-if="row.finishUserFee" class="rate-info-final"><span>结算预估佣金：</span><span class="rate-info-final-fee">￥{{ row.finishUserFee }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="showFinalFee" label="佣金" min-width="180px">
          <template slot-scope="{ row }">
            <div v-if=" (row.orderStatus) !== 13 " class="rate-info">
              <div class="rate-info"><span>淘宝预估佣金：</span><span class="rate-info-data">￥{{ row.payPreFee }}</span></div>
              <div class="rate-info"><span>实际预估佣金：</span><span class="rate-info-data">￥{{ row.payActualFee }}</span></div>
              <div v-if="row.finishPreFee" class="rate-info"><span>淘宝结算佣金：</span><span class="rate-info-data">￥{{ row.finishPreFee }}</span></div>
              <div v-if="row.finishActualFee" class="rate-info-final"><span>实际结算佣金：</span><span class="rate-info-final-fee">￥{{ row.finishActualFee }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广位" min-width="80px" align="center">
          <template slot-scope="{ row }">
            <span class="pid-name">{{ row.pidName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <div>
              <div v-if="row.edit">
                <span>
                  <el-button type="success" icon="el-icon-check" circle @click="confirmEdit(row)" />
                </span>
                <span>
                  <el-button type="warning" icon="el-icon-close" circle @click="cancelEdit(row)" />
                </span>
              </div>
              <el-button v-else type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
            </div>
            <br>
            <div>
              <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="orderListQuery.page" :limit.sync="orderListQuery.limit" @pagination="getOrderList" />
    </div>

  </div>
</template>

<script>
import { fetchOrderList, updateOrder } from '@/api/order'
import { fetchTbUnionAccountList } from '@/api/tbUnion'
import { fetchRobotList, fetchRobotFriendList } from '@/api/robot'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateSelect from '@/components/DateSelect'

const orderStatusOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { value: '12', name: '已付款' },
  { value: '3', name: '已结算' },
  { value: '13', name: '已失效' },
  { value: '88', name: '已发放' }
]
export default {
  name: 'OrderTable',
  components: { Pagination, DateSelect },
  directives: { waves },

  filters: {
    /**
     * 为订单状态增加标签样式
     */
    codeToTagFilter(code) {
      const tagMap = {
        3: 'success',
        13: 'info',
        88: 'warning'
      }
      return tagMap[code]
    }
  },
  data() {
    return {
      tableKey: 0,
      orderList: null,
      pidList: null,
      total: 0,
      listLoading: true,
      orderListQuery: {
        // 订单编号
        orderId: undefined,
        // 订单状态
        orderStatus: undefined,
        // 机器人wxid
        robotWxid: undefined,
        // 推广位pid
        pid: undefined,
        // 是否是维权订单查询
        showRefund: undefined,
        // 订单付款开始时间
        startDateTime: null,
        // 订单付款结束时间
        endDateTime: null,
        page: undefined,
        limit: 20
      },
      // 订单状态下拉列表
      orderStatusOptions,
      // 淘宝联盟账户推广id下拉列表
      tbUnionAccountOptions: [],
      // 机器人下拉列表
      robotOptions: [],
      // 机器人好友下拉列表
      robotFriendOptions: [],
      // 展示总佣金
      showFinalFee: false,
      // 维权订单
      showRefund: false,
      downloadLoading: false,
      temp: {
        orderId: undefined,
        orderCode: undefined,
        wxId: undefined
      }
    }
  },

  created() {
    // this.getRobotList()
    // this.getTbUnionAccountList()
    // this.getOrderList()
    this.tableInit()
  },

  methods: {
    // 隐藏表头
    headerStyle({ row, column, rowIndex, columnIndex }) {
      row[0].colSpan = 0
      row[1].colSpan = 2 // 第2列的表头占据2个单元格
      if (columnIndex === 0) {
        // 第1列的表头隐藏
        return 'display: none'
      }
    },

    // 页面初始化用到的请求
    async tableInit() {
      await this.getRobotList()
      await this.getOrderList()
      this.getTbUnionAccountList()
    },
    // 获取机器人列表
    async getRobotList() {
      await fetchRobotList().then((response) => {
        this.robotOptions = response.data.list
        this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      })
    },
    // 获取淘宝联盟推广位
    async getTbUnionAccountList() {
      fetchTbUnionAccountList().then((response) => {
        this.tbUnionAccountOptions = response.data.list
      })
    },
    // 获取订单列表
    async getOrderList() {
      this.listLoading = true
      // this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      const { data } = await fetchOrderList(this.orderListQuery)
      const list = data.list
      this.orderList = list.map(v => {
        this.$set(v, 'edit', false)
        v.originalOrderCode = v.tbOrderStatusEnum.code
        v.originalOrderStatus = v.tbOrderStatusEnum.status
        v.originalWxid = v.wxid
        v.originalWxName = v.wxName
        return v
      })
      this.listLoading = false
    },
    // 获取机器人好友列表-简版
    async getRobotFriendList() {
      fetchRobotFriendList().then((response) => {
        this.robotFriendOptions = response.data.list
      })
    },
    // 搜索订单
    handleFilter() {
      this.orderListQuery.page = 1
      this.getOrderList()
    },
    // 设置查询的订单起止时间
    dateTimeChange(start, end) {
      this.orderListQuery.startDateTime = start
      this.orderListQuery.endDateTime = end
    },

    // 点击编辑按钮后，请求好友列表
    async handleUpdate(row) {
      row.edit = true
      await this.getRobotFriendList()
    },
    // 取消编辑
    cancelEdit(row) {
      row.tbOrderStatusEnum.code = row.originalOrderCode
      row.tbOrderStatusEnum.status = row.originalOrderStatus
      row.wxid = row.originalWxid
      row.wxName = row.originalWxName
      row.edit = false
      this.$notify({
        title: '取消',
        message: '已取消编辑',
        type: 'warning',
        duration: 1000
      })
    },
    // 提交编辑
    confirmEdit(row) {
      const tempData = Object.assign({}, this.temp)
      console.log(row)
      if (row.originalOrderCode !== row.tbOrderStatusEnum.code || row.originalWxid !== row.wxid) {
        tempData.orderId = row.orderId
        if (row.originalOrderCode !== row.tbOrderStatusEnum.code) {
          row.originalOrderCode = row.tbOrderStatusEnum.code
          row.originalOrderStatus = this.codeToStatus(row.tbOrderStatusEnum.code)
          row.tbOrderStatusEnum.status = row.originalOrderStatus
          tempData.orderCode = row.originalOrderCode
        }
        if (row.originalWxid !== row.wxid) {
          console.log(row)
          row.originalWxid = row.wxid
          row.originalWxName = row.wxName
          tempData.wxId = row.originalWxid
        }
        console.log(row)
        updateOrder(tempData).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      }
      row.edit = false
    },
    /**
     * 根据订单状态code 改变 status描述
     */
    codeToStatus(code) {
      const statusMap = {
        3: '已结算',
        12: '已付款',
        13: '已失效',
        88: '已发放'
      }
      return statusMap[code]
    },
    // 订单状态的小提示
    orderStatusTooltips(h, { column }) {
      return h('div', [
        h('span', column.label),
        h('el-tooltip', { props: { placement: 'top' } }, [
          h(
            'div',
            {
              slot: 'content',
              // 与下一行间隔
              style: 'margin-bottom:5px'
            },
            '付款：指订单已付款，但还未确认收货'
          ),
          h(
            'div',
            {
              slot: 'content',
              // 与下一行间隔
              style: 'margin-bottom:5px'
            },
            '结算：指订单已确认收货，但佣金并未发放'
          ),
          h(
            'div',
            {
              slot: 'content',
              // 与下一行间隔
              style: 'margin-bottom:5px'
            },
            '失效：指订单关闭/订单佣金小于0.01元'
          ),
          h(
            'div',
            {
              slot: 'content',
              // 与下一行间隔
              style: 'margin-bottom:5px'
            },
            '发放：指订单佣金已经发放到用户账户余额'
          ),
          h('i', {
            class: 'el-icon-warning-outline',
            style: 'color:orange;margin-left:5px;cursor:pointer;'
          })
        ])
      ])
    },

    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.orderList.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.orderList.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.orderListQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss">
.tool-head {
  padding-bottom: 10px;
  background-color: #00ff00;
  padding: 20px 10px 20px 10px;
  margin-bottom: 15px;
}
.el-header {
  /* 设置行间的距离(行高) */
  line-height: 50px;
  color: rgb(250, 248, 248);
  /* 字体大小 */
  font-size: 20px;
}

.middle-body-background {
  padding: 20px 10px 10px 10px;
  border-radius: 15px;
  background-color: #ffffff;
}
.tool-left-all {
  float: left;
  width: 70%;
  height: 100%;
}
.tool-left {
  float: left;
  height: 100%;
}
.tool-left-fee {
  float: left;
  margin-left: 10px;
  margin-top: 5px;
}
.tool-right-all {
  float: right;
  width: 30%;
  height: 100%;
}
.tool-right {
  float: right;
  height: 100%;
}

/* 商品信息--第一格 */
.order-goodsInfo {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.order-itemImg {
  float: left;
  width: 80px;
  min-width: 80px;
  height: 80px;
}
.order-info {
  float: right;
  width: 85%;
  min-width: 380px;
  height: 100%;
}
.order-info-name {
  margin-left: 10px;
  text-align: left;
  font-size: 12px;
  color: rgb(0, 0, 0);
}
.order-info-left {
  margin-left: 10px;
  text-align: left;
  font-size: 11px;
  color: rgb(128, 128, 128);
}
.order-info-money {
  margin-left: 10px;
  text-align: left;
  font-size: 11px;
  color: rgb(128, 128, 128);
}
.paid-money {
  font-size: 13px;
  font-weight: 500;
  color: rgb(0, 0, 0);
}
.order-time {
  float: right;
}

/* 佣金比例 */
.rate-info {
  text-align: left;
  font-size: 11px;
  /* color: rgb(128, 128, 128); */
  color: #a3a3a3;
}
.rate-info-data {
  font-size: 11px;
  color: rgb(60, 60, 60);
}
.rate-info-final {
  text-align: left;
  font-size: 12px;
  color: rgb(50, 50, 50);
}
.rate-info-final-fee {
  font-weight: bold;
  font-size: 13px;
  color: #ff7000;
}
.pid-name {
  font-weight: bold;
  font-size: 12px;
}

.el-tooltip__popper {
  max-width: 400px !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}
</style>
