
<template>
  <div class="app-container2">
    <div class="filter-container">
      <div class="tool-left-all">
        <div class="tool-left">
          <el-tooltip content="请选择要查看的机器人" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="recycleListQuery.robotWxid" placeholder="机器人" class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in robotOptions" :key="item.wxid" size="small" :label="item.wxName" :value="item.wxid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <el-tooltip content="请选择要查看的推广位" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="recycleListQuery.pid" placeholder="请选择推广位" clearable class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in tbUnionPidOptions" :key="item.pid" size="small" :label="item.pidName" :value="item.pid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <el-tooltip content="常规订单、渠道订单、会员运营订单" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="recycleListQuery.sceneId" placeholder="全部订单" class="filter-item" left size="small" style="width: 150px;">
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
          <dateSelect ref="dateTimeRef" @dateRangeChange="dateTimeChange" />
        </div>
        <div class="tool-left">
          <el-input v-model="recycleListQuery.orderId" size="small" placeholder="订单号" style="width: 220px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
      </div>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" size="small" :data="orderList" fit style="width: 100%" :header-cell-style="{height: '60px',}">
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
              <div>
                <span class="order-time-delete">{{ row.deleteTime }} 删除</span>
              </div>
            </div>
          </div>
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
            <div class="rate-info"><span>佣金 比例：<span class="rate-info-data">{{ row.feeRate }}%</span></span></div>
            <div class="rate-info"><span>提成 比例：<span class="rate-info-data">{{ row.totalRate }}%</span></span></div>
            <div class="rate-info"><span>平台 比例：<span class="rate-info-data">{{ row.platformRate }}%</span></span></div>
            <div class="rate-info"><span>技术服务费：<span class="rate-info-data">￥{{ row.deductFee }}</span></span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户佣金" min-width="180px">
        <template slot="header" scoped-slot>
          <span>用户佣金</span>
          <span>
            <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
              <div slot="content" style="margin-bottom: 5px">失效订单用户佣金为空</div><i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showFinalFee" label="佣金" min-width="180px">
        <template slot="header" scoped-slot>
          <span>佣金</span>
          <span>
            <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
              <div slot="content" style="margin-bottom: 5px">失效订单佣金为空</div><i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推广位" min-width="70px" align="center">
        <template slot="header" scoped-slot>
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
        <template slot="header" scoped-slot>
          <span>操作</span>
          <span>
            <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
              <div slot="content" style="margin-bottom: 5px">还原：将订单恢复到全部订单列表</div><i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
            </el-tooltip>
          </span>
        </template>
        <template slot-scope="{ row }">
          <div>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定要将该订单还原？" @onConfirm="handleRestore(row)">
              <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete">还原</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="recycleListQuery.page" :limit.sync="recycleListQuery.limit" @pagination="getOrderList" />
  </div>

</template>

<script>
import { fetchTbRecycleOrderList, updateOrder } from '@/api/order'
import { fetchTbUnionPidSimpleList } from '@/api/union'
import { fetchRobotList, fetchRobotFriendList } from '@/api/robot'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateSelect from '@/components/DateSelect'
import RobotFriendTooltip from '@/views/order/tb/components/RobotFriendTooltip'
import FeeRateTooltip from '@/views/order/tb/components/FeeRateTooltip'

const orderSceneOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { code: 1, scene: '常规订单' },
  { code: 2, scene: '渠道订单' },
  { code: 3, scene: '会员运营订单' }
]

export default {
  name: 'TbRecycleOrderTable',
  components: { Pagination, DateSelect, RobotFriendTooltip, FeeRateTooltip },
  directives: { waves },

  filters: {

  },
  data() {
    return {
      tableKey: 0,
      orderList: null,
      pidList: null,
      total: 0,
      listLoading: true,
      recycleListQuery: {
        // 订单编号
        orderId: undefined,
        // 订单类型
        sceneId: undefined,
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
      // 淘宝联盟账户推广id下拉列表
      tbUnionPidOptions: [],
      // 订单类型下拉列表
      orderSceneOptions,
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
        this.recycleListQuery.robotWxid = this.robotOptions[0].wxid
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
      // this.recycleListQuery.robotWxid = this.robotOptions[0].wxid
      const { data } = await fetchTbRecycleOrderList(this.recycleListQuery)
      this.orderList = data.list
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
      this.recycleListQuery.page = 1
      this.getOrderList()
    },
    // 设置查询的订单起止时间
    dateTimeChange(start, end) {
      this.recycleListQuery.startDateTime = start
      this.recycleListQuery.endDateTime = end
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
    // 处理还原订单
    handleRestore(row) {
      const index = this.orderList.indexOf(row)
      const tempData = Object.assign({}, this.temp)
      tempData.orderId = row.orderId
      tempData.isDeleted = 0 // 1：删除订单
      this.updateOrders(tempData, '还原')
      this.orderList.splice(index, 1)
    },

    handleDownload() {
      this.$message('功能暂未开发，敬请期待！')
    }
  }
}
</script>

