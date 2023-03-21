
<template>
  <div class="app-container2">
    <div class="filter-container">
      <div class="tool-left-all">
        <div class="tool-left">
          <el-tooltip content="请选择要查看的机器人" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="orderListQuery.robotWxid" placeholder="机器人" class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in robotOptions" :key="item.wxid" size="small" :label="item.wxName" :value="item.wxid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left-fee">
          <el-tooltip content="是否查看佣金" placement="top" effect="light" transition="el-fade-in-linear">
            <el-switch v-model="showFinalFee" size="small" class="filter-item" active-text="佣金" @change="tableKey = tableKey + 1">佣金</el-switch>
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
            <el-option v-for="item in orderStatusOptions" :key="item.code" :label="item.status" :value="item.code" size="small" />
          </el-select>
        </div>
        <div class="tool-left">
          <dateSelect ref="dateTimeRef" @dateRangeChange="dateTimeChange" />
        </div>
        <div class="tool-left">
          <el-input v-model="orderListQuery.orderSid" size="small" placeholder="订单号" style="width: 220px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
      </div>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" size="small" :data="orderList" fit style="width: 100%" :header-cell-style="{height: '60px',}" :row-class-name="tableRowClassName">
      <el-table-column label="订单信息" min-width="500px" align="left">
        <template slot-scope="{ row }">
          <div class="order-goodsInfo">
            <div class="order-itemImg">
              <a :href="row.goodsUrl" style=" width: 100% ; height: 80px">
                <el-image :src="row.goodsImgUrl" class="cover" style="width: 100%  ; height: 80px" />
              </a>
            </div>
            <div class="order-info">
              <div class="order-info-name">
                <div style="width: 100%; float: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; font-size:13px;">
                  <el-tooltip :content="row.goodsName" placement="bottom-start" effect="light" transition="el-fade-in-linear">
                    <a :href="row.goodsUrl">{{ row.goodsName }}</a>
                  </el-tooltip>
                  <span v-if="row.plus === 1" style="float: right; width: 5%;">
                    <el-tooltip content="该订单的购买方为plus会员，佣金可能会有所不同" placement="top" effect="light" transition="el-fade-in-linear">
                      <svg-icon icon-class="jd-plus" style="font-size:18px;" />
                    </el-tooltip>
                  </span>
                  <span v-if="row.traceType === 2" style="float: right; width: 5%;">
                    <el-tooltip content="该商品与推广商品为同一店铺，其余为跨店订单，同跨店会影响您的佣金比例" placement="top" effect="light" transition="el-fade-in-linear">
                      <svg-icon icon-class="same-shop" style="font-size:18px;" />
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="order-info-left">店铺名：{{ row.shopName }}</div>
              <div class="order-info-left"><span>订单标识：{{ row.orderSid }}</span></div>
              <div class="order-info-left"><span>订单编号：{{ row.orderId }}</span><span v-if="row.finishTime" class="order-time">{{ row.finishTime }} 结算</span></div>
              <div><span class="order-info-money">付款金额：<span class="paid-money" style="color: #B22222">￥{{ row.payPrice }}</span></span><span class="order-time">{{ row.payTime }} 付款</span></div>
              <div v-if="row.finishPrice"><span class="order-info-money">结算金额：<span class="paid-money">￥{{ row.finishPrice }}</span></span><span class="order-time">{{ row.finishTime }} 结算</span></div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" min-width="100px" align="center" scoped-slot>
        <template slot="header">
          <OrderStatusTooltip />
        </template>
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-select v-model="row.jdOrderStatusEnum.code" size="mini" value-key="Code" placeholder="请选择">
              <el-option v-for="item in orderStatusOptions" :key="item.code" :label="item.status" :value="item.code" size="mini" />
            </el-select>
          </template>
          <span v-else>
            <el-tag :type="row.jdOrderStatusEnum.code | codeToTagFilter">{{ row.jdOrderStatusEnum.status }}</el-tag>
            <div>
              <span v-if="row.refundPrice > 0">
                <el-tooltip placement="left-end" effect="light" transition="el-fade-in-linear" scoped-slot>
                  <div slot="content">价保金额：{{ row.refundPrice }}</div>
                  <svg-icon icon-class="refund_price" style="font-size:30px;margin-top:5px" />
                </el-tooltip>
              </span>
              <span v-if="row.goodsReturnNum > 0">
                <el-tooltip placement="right-end" effect="light" transition="el-fade-in-linear" scoped-slot>
                  <div slot="content">退货数量：{{ row.goodsReturnNum }}</div>
                  <svg-icon icon-class="refund_order" style="font-size:30px;margin-top:5px" />
                </el-tooltip>
              </span>
            </div>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="用户" min-width="100px" align="left" scoped-slot>
        <template slot="header">
          <RobotFriendTooltip />
        </template>
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-select v-if="row.wxid" v-model="row.wxid" filterable clearable size="mini" value-key="Code" placeholder="请选择">
              <el-option v-for="item in robotFriendOptions" :key="item.wxid" size="mini" :label="item.wxName" :value="item.wxid" />
            </el-select>
            <el-select v-else v-model="row.pid" filterable clearable size="mini" value-key="Code" placeholder="请选择">
              <el-option v-for="item in jdUnionPidOptions" :key="item.pid" size="mini" :label="item.pidName" :value="item.pid" />
            </el-select>
          </template>
          <span v-else>
            <span v-if="row.wxid" style="font-weight: bold; font-size:13px;">{{ row.wxName }}</span>
            <span v-else style="font-weight: bold; font-size:13px;">{{ row.pidName }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="佣金比例" min-width="130px" align="left" scoped-slot>
        <template slot="header">
          <FeeRateTooltip />
        </template>
        <template slot-scope="{ row }">
          <div class="rate-info">
            <div class="rate-info"><span>佣金比例：<span class="rate-info-data">{{ row.feeRate }}%</span></span></div>
            <div class="rate-info"><span>分佣比例：<span class="rate-info-data">{{ row.finalRate }}%</span></span></div>
            <div class="rate-info"><span>平台比例：<span class="rate-info-data">{{ row.platformRate }}%</span></span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户佣金" min-width="150px" scoped-slot>
        <template slot="header">
          <UserFeeTooltip />
        </template>
        <template slot-scope="{ row }">
          <div v-if=" (row.jdOrderStatusEnum.code) !== 3 " class="rate-info">
            <div class="rate-info"><span>付款佣金：</span><span class="rate-info-data">￥{{ row.payUserFee }}</span></div>
            <div v-if="row.finishUserFee" class="rate-info-final"><span>结算佣金：</span><span class="rate-info-final-fee">￥{{ row.finishUserFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="showFinalFee" label="佣金" min-width="180px" scoped-slot>
        <template slot="header">
          <TotalFeeTooltip />
        </template>
        <template slot-scope="{ row }">
          <div v-if=" (row.jdOrderStatusEnum.code) !== 3 " class="rate-info">
            <div class="rate-info"><span>联盟付款佣金：</span><span class="rate-info-data">￥{{ row.payActualFee }}</span></div>
            <div v-if="row.finishActualFee" class="rate-info-final"><span>联盟结算佣金：</span><span class="rate-info-final-fee">￥{{ row.finishActualFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100" class-name="small-padding fixed-width" scoped-slot>
        <template slot="header">
          <EditTooltip />
        </template>
        <template slot-scope="{ row }">
          <div>
            <div v-if="row.edit">
              <span>
                <el-button type="success" icon="el-icon-check" circle @click="confirmEdit(row)" />
              </span><span>
                <el-button type="warning" icon="el-icon-close" circle @click="cancelEdit(row)" />
              </span>
            </div>
            <el-button v-else type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          </div>
          <br>
          <div>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定要将该订单放入回收站吗？" @onConfirm="handleDelete(row)">
              <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="orderListQuery.page" :limit.sync="orderListQuery.limit" @pagination="getOrderList" />
  </div>

</template>

<script>
import { fetchJdOrderList, updateOrder } from '@/api/order'
import { fetchRobotList, fetchRobotFriendList } from '@/api/robot'
import { fetchJdUnionPidSimpleList } from '@/api/union'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateSelect from '@/components/DateSelect'
import OrderStatusTooltip from '@/views/order/jd/components/OrderStatusTooltip'
import RobotFriendTooltip from '@/views/order/jd/components/RobotFriendTooltip'
import UserFeeTooltip from '@/views/order/jd/components/UserFeeTooltip'
import TotalFeeTooltip from '@/views/order/jd/components/TotalFeeTooltip'
import FeeRateTooltip from '@/views/order/jd/components/FeeRateTooltip'
import EditTooltip from '@/views/order/components/EditTooltip'

const orderStatusOptions = [
  // 15：待付款，16：订单付款，17：订单结算，24：付定金， 0：订单失效
  { code: 15, status: '待付款' },
  { code: 16, status: '已付款' },
  { code: 17, status: '已结算' },
  { code: 24, status: '付定金' },
  { code: 3, status: '已失效' },
  { code: 88, status: '已发放' }
]
export default {
  name: 'JdOrderTable',
  components: { Pagination, DateSelect, OrderStatusTooltip, RobotFriendTooltip, FeeRateTooltip, TotalFeeTooltip, UserFeeTooltip, EditTooltip },
  directives: { waves },

  filters: {
    /**
     * 为订单状态增加标签样式
     */
    codeToTagFilter(code) {
      const tagMap = {
        15: 'primary',
        16: 'primary',
        24: 'primary',
        17: 'success',
        3: 'info',
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
        // 京东订单标识
        orderSid: undefined,
        // 订单状态
        orderStatus: undefined,
        // 机器人wxid
        robotWxid: undefined,
        // 订单付款开始时间
        startDateTime: null,
        // 订单付款结束时间
        endDateTime: null,
        page: undefined,
        limit: 20
      },
      // 订单状态下拉列表
      orderStatusOptions,
      // 机器人下拉列表
      robotOptions: [],
      // 机器人好友下拉列表
      robotFriendOptions: [],
      // 京东联盟账户，在后台设置的推广id下拉列表
      jdUnionPidOptions: [],
      // 展示总佣金
      showFinalFee: false,
      downloadLoading: false,
      temp: {
        // 订单id
        orderSid: undefined,
        // 订单状态code
        orderCode: undefined,
        // 用户微信id
        wxid: undefined,
        // 用户微信id
        pid: undefined,
        // 0：未删除，1：已删除
        isDeleted: undefined
      }
    }
  },

  created() {
    // this.getRobotList()
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
      this.getJdUnionPidList()
    },
    // 获取机器人列表
    async getRobotList() {
      await fetchRobotList().then((response) => {
        this.robotOptions = response.data.list
        this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      })
    },
    // 获取订单列表
    async getOrderList() {
      this.listLoading = true
      // this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      const { data } = await fetchJdOrderList(this.orderListQuery)
      const list = data.list
      this.orderList = list.map(v => {
        this.$set(v, 'edit', false)
        v.originalOrderCode = v.jdOrderStatusEnum.code
        v.originalOrderStatus = v.jdOrderStatusEnum.status
        v.originalOrderJdCode = v.jdOrderStatusEnum.jdCode
        v.originalOrderJdStatus = v.jdOrderStatusEnum.jdStatus
        if (v.wxid) {
          v.originalWxid = v.wxid
          v.originalWxName = v.wxName
        } else {
          v.originalPid = v.pid
          v.originalPidName = v.pidName
        }
        return v
      })
      this.listLoading = false
    },
    // 获取淘宝联盟推广位
    async getJdUnionPidList() {
      fetchJdUnionPidSimpleList().then((response) => {
        this.jdUnionPidOptions = response.data.list
      })
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
      if (row.wxid) {
        await this.getRobotFriendList()
      } else {
        await this.getJdUnionPidList()
      }
    },
    // 取消编辑
    cancelEdit(row) {
      row.jdOrderStatusEnum.code = row.originalOrderCode
      row.jdOrderStatusEnum.status = row.originalOrderStatus
      row.wxid = row.originalWxid
      row.wxName = row.originalWxName
      row.edit = false
      this.$notify({
        // title: '取消',
        message: '取消编辑',
        type: 'warning',
        duration: 1000
      })
    },
    // 处理订单修改的信息
    confirmEdit(row) {
      // 判断数据是否修改，数据变化才会进行下一步操作
      if (row.originalOrderCode !== row.jdOrderStatusEnum.code || row.originalWxid !== row.wxid || row.originalPid !== row.pid) {
        const tempData = Object.assign({}, this.temp)
        tempData.orderSid = row.orderSid
        // 判断订单状态是否修改
        if (row.originalOrderCode !== row.jdOrderStatusEnum.code) {
          row.originalOrderCode = row.jdOrderStatusEnum.code
          const statusObj = this.orderStatusOptions.find((item) => item.code === row.jdOrderStatusEnum.code)
          row.originalOrderStatus = statusObj.status
          row.jdOrderStatusEnum.status = row.originalOrderStatus
          tempData.orderCode = row.originalOrderCode
        }
        if (row.wxid) {
          // 判断用户是否修改
          if (row.originalWxid !== row.wxid) {
            row.originalWxid = row.wxid
            if (row.wxid === '') {
              row.wxName = ''
              row.originalWxName = ''
            } else {
              const friendObj = this.robotFriendOptions.find((item) => item.wxid === row.wxid)
              row.wxName = friendObj.wxName
              row.originalWxName = row.wxName
            }
            tempData.wxid = row.originalWxid
          }
        } else {
          // 判断推广是否修改
          if (row.originalPid !== row.pid) {
            row.originalPid = row.pid
            if (row.pid === '') {
              row.pidName = ''
              row.originalPidName = ''
            } else {
              const pidObj = this.jdUnionPidOptions.find((item) => item.pid === row.pid)
              row.pidName = pidObj.pidName
              row.originalPidName = row.pidName
            }
            tempData.pid = row.originalPid
          }
        }
        this.updateOrders(tempData, '修改')
      }
      row.edit = false
    },
    // 更新订单
    updateOrders(tempData, msg) {
      updateOrder(tempData).then(() => {
        this.$notify({
          // title: '成功',
          message: msg + '成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 处理删除订单
    handleDelete(row) {
      if (row.jdOrderStatusEnum.code === 3) {
        const index = this.orderList.indexOf(row)
        const tempData = Object.assign({}, this.temp)
        tempData.orderSid = row.orderSid
        tempData.isDeleted = 1 // 1：删除订单
        this.updateOrders(tempData, '删除')
        this.orderList.splice(index, 1)
      } else {
        this.$notify({
          message: '不可以删除有效订单',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 设置修改行颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.edit) {
        return 'success-row'
      }
      return ''
    },

    handleDownload() {
      this.$message('功能暂未开发，敬请期待！')
    },
    // 这个函数名字绑定的是你上边的导出按钮
    orderDownload() {
      this.downloadLoading = true
      // 这个文件是vue-element-admin里边自带的，跟着路径你就能找到，不用担心把报错
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['头像', '标题', 'Author', 'Readings', 'Date'] // 这个就是excel表格的头部名称
        const filterVal = ['actvr', 'title', 'author', 'pageviews', 'display_time'] // 这个就是从导出的数据在你数组里的名字
        const list = this.list // 这个就是你页面循环的那个数组,如果你想全部导出的话,数组就需要是全部数据
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename, // 这个就是你导出的文件的名字
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

