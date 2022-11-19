
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
        <div class="tool-left">
          <el-tooltip content="请选择要查看的推广位" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="orderListQuery.pid" placeholder="请选择推广位" clearable class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in tbUnionPidOptions" :key="item.pid" size="small" :label="item.pidName" :value="item.pid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <el-tooltip content="常规订单、渠道订单、会员运营订单" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="orderListQuery.sceneId" placeholder="全部订单" class="filter-item" left size="small" style="width: 150px">
              <el-option v-for="item in orderSceneOptions" :key="item.code" :label="item.scene" :value="item.code" size="small" />
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
          <el-select v-model="orderListQuery.orderStatus" placeholder="全部状态" class="filter-item" left size="small" style="width: 150px; margin-bottom: 20px;">
            <el-option v-for="item in orderStatusOptions" :key="item.code" :label="item.status" :value="item.code" size="small" />
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
                  <span v-if="row.tbOrderSceneEnum.code === 2" style="float: right; width: 8%;">
                    <el-tooltip content="渠道订单" placement="top" effect="light" transition="el-fade-in-linear">
                      <svg-icon icon-class="relation_order" style="font-size:25px;" />
                    </el-tooltip>
                  </span>
                  <span v-if="row.tbOrderSceneEnum.code === 3" style="float: right; width: 8%;">
                    <el-tooltip content="会员运营订单" placement="top" effect="light" transition="el-fade-in-linear">
                      <svg-icon icon-class="special_order" style="font-size:28px;" />
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="order-info-left">店铺名：{{ row.shopName }}</div>
              <div class="order-info-left"><span>父订单编号：{{ row.parentOrderId }}</span></div>
              <div class="order-info-left"><span>子订单编号：{{ row.orderId }}</span></div>
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
            <el-select v-model="row.tbOrderStatusEnum.code" size="mini" value-key="Code" placeholder="请选择">
              <el-option v-for="item in orderStatusOptions" :key="item.code" :label="item.status" :value="item.code" size="mini" />
            </el-select>
          </template>
          <span v-else>
            <el-tag :type="row.tbOrderStatusEnum.code | codeToTagFilter">{{ row.tbOrderStatusEnum.status }}</el-tag>
            <div v-if="row.refundId > 0">
              <el-tooltip content="维权订单，点击可查看详细信息" placement="bottom" effect="light" transition="el-fade-in-linear">
                <svg-icon icon-class="refund_order" style="font-size:30px;margin-top:5px" @click="getRefundOrderInfo(row)" />
              </el-tooltip>
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
            <el-select v-model="row.wxid" filterable clearable size="mini" value-key="Code" placeholder="请选择">
              <el-option v-for="item in robotFriendOptions" :key="item.wxid" size="mini" :label="item.wxName" :value="item.wxid" />
            </el-select>
          </template>
          <span v-else>
            <span style="font-weight: bold; font-size:13px;">{{ row.wxName }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="佣金比例" min-width="150px" align="left" scoped-slot>
        <template slot="header">
          <FeeRateTooltip />
        </template>
        <template slot-scope="{ row }">
          <div class="rate-info">
            <div class="rate-info"><span>佣金比例：<span class="rate-info-data">{{ row.feeRate }}%</span></span></div>
            <div class="rate-info"><span>提成比例：<span class="rate-info-data">{{ row.totalRate }}%</span></span></div>
            <div class="rate-info"><span>平台比例：<span class="rate-info-data">{{ row.platformRate }}%</span></span></div>
            <div class="rate-info"><span>技术服务费：<span class="rate-info-data">￥{{ row.deductFee }}</span></span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户佣金" min-width="180px" scoped-slot>
        <template slot="header">
          <UserFeeTooltip />
        </template>
        <template slot-scope="{ row }">
          <div v-if=" (row.tbOrderStatusEnum.code) !== 13 " class="rate-info">
            <div class="rate-info"><span>付款预估佣金：</span><span class="rate-info-data">￥{{ row.payUserFee }}</span></div>
            <div v-if="row.finishUserFee" class="rate-info-final"><span>结算预估佣金：</span><span class="rate-info-final-fee">￥{{ row.finishUserFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="showFinalFee" label="佣金" min-width="180px" scoped-slot>
        <template slot="header">
          <TotalFeeTooltip />
        </template>
        <template slot-scope="{ row }">
          <div v-if=" (row.tbOrderStatusEnum.code) !== 13 " class="rate-info">
            <div class="rate-info"><span>联盟付款佣金：</span><span class="rate-info-data">￥{{ row.payPreFee }}</span></div>
            <div class="rate-info"><span>实际付款佣金：</span><span class="rate-info-data">￥{{ row.payActualFee }}</span></div>
            <div v-if="row.finishPreFee" class="rate-info"><span>联盟结算佣金：</span><span class="rate-info-data">￥{{ row.finishPreFee }}</span></div>
            <div v-if="row.finishActualFee" class="rate-info-final"><span>实际结算佣金：</span><span class="rate-info-final-fee">￥{{ row.finishActualFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="推广位" min-width="80px" align="center" scoped-slot>
        <template slot="header">
          <span>推广位</span>
          <span>
            <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
              <div slot="content" style="margin-bottom: 5px">指推广该订单的推广位</div><i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
            </el-tooltip>
          </span>
        </template>
        <template slot-scope="{ row }">
          <span class="pid-name">{{ row.pidName }}</span>
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
              </span>
              <span>
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

    <!-- 单个维权订单的详细信息 -->
    <el-dialog title="维权订单详情" :visible.sync="refundOrderInfo">
      <el-table :data="refundInfo">
        <el-table-column label="订单信息" min-width="450px" align="left">
          <template slot-scope="{ row }">
            <div class="order-goodsInfo">
              <div class="order-itemImg">
                <a :href="row.goodsUrl" style=" width: 100% ; height: 80px">
                  <el-image :src="row.goodsImgUrl" class="cover" style="width: 100%  ; height: 80px" />
                </a>
              </div>
              <div class="order-info" style="font-size:12px;">
                <div class="order-info-name">
                  <div style="width: 100%; float: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; font-size:12px;">
                    <el-tooltip :content="row.goodsName" placement="bottom-start" effect="light" transition="el-fade-in-linear"><a :href="row.goodsUrl">{{ row.goodsName }}</a></el-tooltip>
                  </div>
                </div>
                <div class="order-info-left">店铺名：{{ row.shopName }}</div>
                <div><span class="order-info-money">结算金额：<span class="paid-money">￥{{ row.finishPrice }}</span></span><span class="order-time">{{ row.finishTime }} 结算</span></div>
                <div><span class="order-info-money">维权金额：<span class="paid-money" style="color: #3CB371">￥{{ row.refundPrice }}</span></span><span class="order-time">{{ row.refundCreateTime }} 维权</span></div>
                <div><span class="order-info-money" /><span class="order-time">{{ row.refundFinishTime }} 成功</span></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="维权状态" min-width="120px" align="center">
          <template slot-scope="{ row }">
            {{ row.tbRefundStatusEnum.status }}</template>
        </el-table-column>
        <el-table-column label="扣除佣金" min-width="120px">
          <template slot-scope="{ row }">
            <div v-if="row.deductedFee" class="rate-info-final"><span class="rate-info-final-fee">￥{{ row.deductedFee }}</span></div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundOrderInfo = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchTbOrderList, updateOrder, fetchTbRefundOrderInfo } from '@/api/order'
import { fetchTbUnionPidSimpleList } from '@/api/union'
import { fetchRobotList, fetchRobotFriendList } from '@/api/robot'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateSelect from '@/components/DateSelect'
import OrderStatusTooltip from '@/views/order/tb/components/OrderStatusTooltip'
import RobotFriendTooltip from '@/views/order/tb/components/RobotFriendTooltip'
import UserFeeTooltip from '@/views/order/tb/components/UserFeeTooltip'
import TotalFeeTooltip from '@/views/order/tb/components/TotalFeeTooltip'
import FeeRateTooltip from '@/views/order/tb/components/FeeRateTooltip'
import EditTooltip from '@/views/order/components/EditTooltip'

const orderStatusOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { code: 12, status: '已付款' },
  { code: 3, status: '已结算' },
  { code: 13, status: '已失效' },
  { code: 88, status: '已发放' }
]
const orderSceneOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { code: 1, scene: '常规订单' },
  { code: 2, scene: '渠道订单' },
  { code: 3, scene: '会员运营订单' }
]
export default {
  name: 'TbOrderTable',
  components: { Pagination, DateSelect, OrderStatusTooltip, RobotFriendTooltip, FeeRateTooltip, TotalFeeTooltip, UserFeeTooltip, EditTooltip },
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
      refundInfo: null,
      pidList: null,
      total: 0,
      listLoading: true,
      refundOrderInfo: false,
      orderListQuery: {
        // 订单编号
        orderId: undefined,
        // 订单类型
        sceneId: undefined,
        // 订单状态
        orderStatus: undefined,
        // 机器人wxid
        robotWxid: undefined,
        // 推广位pid
        pid: undefined,
        // 订单付款开始时间
        startDateTime: null,
        // 订单付款结束时间
        endDateTime: null,
        page: undefined,
        limit: 20
      },
      // 订单类型下拉列表
      orderSceneOptions,
      // 订单状态下拉列表
      orderStatusOptions,
      // 淘宝联盟账户推广id下拉列表
      tbUnionPidOptions: [],
      // 机器人下拉列表
      robotOptions: [],
      // 机器人好友下拉列表
      robotFriendOptions: [],
      // 展示总佣金
      showFinalFee: false,
      downloadLoading: false,
      temp: {
        // 订单id
        orderId: undefined,
        // 订单状态code
        orderCode: undefined,
        // 用户微信id
        wxid: undefined,
        // 0：未删除，1：已删除
        isDeleted: undefined
      }
    }
  },

  created() {
    // this.getRobotList()
    // this.getTbUnionPidList()
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
      this.getTbUnionPidList()
    },
    // 获取机器人列表
    async getRobotList() {
      await fetchRobotList().then((response) => {
        this.robotOptions = response.data.list
        this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      })
    },
    // 获取淘宝联盟推广位
    async getTbUnionPidList() {
      fetchTbUnionPidSimpleList().then((response) => {
        this.tbUnionPidOptions = response.data.list
      })
    },
    // 获取订单列表
    async getOrderList() {
      this.listLoading = true
      // this.orderListQuery.robotWxid = this.robotOptions[0].wxid
      const { data } = await fetchTbOrderList(this.orderListQuery)
      const list = data.list
      this.orderList = list.map(v => {
        this.$set(v, 'edit', false)
        v.originalOrderCode = v.tbOrderStatusEnum.code
        v.originalOrderStatus = v.tbOrderStatusEnum.status
        if (v.wxid) {
          v.originalWxid = v.wxid
          v.originalWxName = v.wxName
        }
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
    // 查看维权订单详情
    async getRefundOrderInfo(row) {
      const { data } = await fetchTbRefundOrderInfo(row.refundId)
      const list = data.list
      this.refundInfo = list.map(v => {
        this.$set(v, 'goodsUrl', row.goodsUrl)
        this.$set(v, 'goodsName', row.goodsName)
        this.$set(v, 'shopName', row.shopName)
        this.$set(v, 'finishPrice', row.finishPrice)
        this.$set(v, 'finishTime', row.finishTime)
        return v
      })
      this.refundOrderInfo = true
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
        // title: '取消',
        message: '取消编辑',
        type: 'warning',
        duration: 1000
      })
    },
    // 处理订单修改的信息
    confirmEdit(row) {
      // 判断数据是否修改，数据变化才会进行下一步操作
      if (row.originalOrderCode !== row.tbOrderStatusEnum.code || row.originalWxid !== row.wxid) {
        const tempData = Object.assign({}, this.temp)
        tempData.orderId = row.orderId
        // 判断订单状态是否修改
        if (row.originalOrderCode !== row.tbOrderStatusEnum.code) {
          row.originalOrderCode = row.tbOrderStatusEnum.code
          const statusObj = this.orderStatusOptions.find((item) => item.code === row.tbOrderStatusEnum.code)
          row.originalOrderStatus = statusObj.status
          row.tbOrderStatusEnum.status = row.originalOrderStatus
          tempData.orderCode = row.originalOrderCode
        }
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
      if (row.tbOrderStatusEnum.code === 13) {
        const index = this.orderList.indexOf(row)
        const tempData = Object.assign({}, this.temp)
        tempData.orderId = row.orderId
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
