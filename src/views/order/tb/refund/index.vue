
<template>
  <div class="app-container2">
    <div class="filter-container">
      <div class="tool-left-all">
        <div class="tool-left">
          <el-tooltip content="请选择要查看的机器人" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="refundListQuery.robotWxid" placeholder="机器人" class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in robotOptions" :key="item.wxid" size="small" :label="item.wxName" :value="item.wxid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <el-tooltip content="请选择要查看的推广位" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="refundListQuery.pid" placeholder="请选择推广位" clearable class="filter-item" style="width: 150px" left size="small">
              <el-option v-for="item in tbUnionPidOptions" :key="item.pid" size="small" :label="item.pidName" :value="item.pid" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <el-tooltip content="常规订单、渠道订单、会员运营订单" placement="top" effect="light" transition="el-fade-in-linear">
            <el-select v-model="refundListQuery.sceneId" placeholder="全部订单" class="filter-item" left size="small" style="width: 150px;">
              <el-option v-for="item in orderSceneOptions" :key="item.code" :label="item.scene" :value="item.code" size="small" />
            </el-select>
          </el-tooltip>
        </div>
        <div class="tool-left">
          <dateSelect ref="dateTimeRef" class="filter-item" @dateRangeChange="dateTimeChange" />
        </div>
        <div class="tool-left">
          <el-button v-waves size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
    <el-table :key="tableKey" v-loading="listLoading" size="small" :data="refundList" fit style="width: 100%" :header-cell-style="{height: '60px',}">
      <el-table-column label="订单信息" min-width="550px" align="left">
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
              <div><span class="order-info-money">结算金额：<span class="paid-money">￥{{ row.finishPrice }}</span></span><span class="order-time">{{ row.finishTime }} 结算</span></div>
              <div><span class="order-info-money">维权金额：<span class="paid-money" style="color: #3CB371">￥{{ row.refundPrice }}</span></span><span class="order-time">{{ row.refundCreateTime }} 维权</span></div>
              <div><span class="order-info-money" /><span class="order-time">{{ row.refundFinishTime }} 成功</span></div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="维权状态" min-width="180px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.tbRefundStatusEnum.code | codeToTagFilter">{{ row.tbRefundStatusEnum.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户" min-width="180px" align="left" scoped-slot>
        <template slot="header">
          <RobotFriendTooltip />
        </template>
        <template slot-scope="{ row }">
          <span style="font-weight: bold; font-size:13px;">{{ row.wxName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣除佣金" min-width="180px" scoped-slot>
        <template slot="header">
          <span>扣除佣金</span>
          <span>
            <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
              <div slot="content" style="margin-bottom: 5px">应该返还的佣金(不包括技术服务费)</div><i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
            </el-tooltip>
          </span>
        </template>
        <template slot-scope="{ row }">
          <div v-if="row.deductedFee" class="rate-info-final"><span class="rate-info-final-fee">￥{{ row.deductedFee }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="推广位" min-width="100px" align="center" scoped-slot>
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
    </el-table>
    <pagination v-show=" total> 0" :total="total" :page.sync="refundListQuery.page" :limit.sync="refundListQuery.limit" @pagination="getRefundList" />
  </div>

</template>

<script>
import { fetchTbRefundOrderList } from '@/api/order'
import { fetchTbUnionPidSimpleList } from '@/api/union'
import { fetchRobotList } from '@/api/robot'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateSelect from '@/components/DateSelect'
import RobotFriendTooltip from '@/views/order/tb/components/RobotFriendTooltip'

const orderSceneOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { code: 1, scene: '常规订单' },
  { code: 2, scene: '渠道订单' },
  { code: 3, scene: '会员运营订单' }
]

export default {
  name: 'TbRefundOrderTable',
  components: { Pagination, DateSelect, RobotFriendTooltip },
  directives: { waves },

  filters: {
    /**
     * 维权创建(淘客结算回执) 4,  维权成功(淘客结算回执) 2,  维权失败(淘客结算回执) 3
     */
    codeToTagFilter(code) {
      const tagMap = {
        2: 'success',
        4: 'info',
        3: 'warning'
      }
      return tagMap[code]
    }
  },
  data() {
    return {
      tableKey: 0,
      refundList: null,
      pidList: null,
      total: 0,
      listLoading: true,
      refundListQuery: {
        // 维权id
        refundId: undefined,
        // 机器人wxid
        robotWxid: undefined,
        // 推广位pid
        pid: undefined,
        // 订单类型
        sceneId: undefined,
        // 维权创建时间
        startDateTime: null,
        // 维权结束时间
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
      downloadLoading: false
    }
  },

  created() {
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
      await this.getRefundList()
      this.getTbUnionPidList()
    },
    // 获取机器人列表
    async getRobotList() {
      await fetchRobotList().then((response) => {
        this.robotOptions = response.data.list
        this.refundListQuery.robotWxid = this.robotOptions[0].wxid
      })
    },
    // 获取淘宝联盟推广位
    async getTbUnionPidList() {
      fetchTbUnionPidSimpleList().then((response) => {
        this.tbUnionPidOptions = response.data.list
      })
    },
    // 获取订单列表
    async getRefundList() {
      this.listLoading = true
      const { data } = await fetchTbRefundOrderList(this.refundListQuery)
      this.refundList = data.list
      this.listLoading = false
    },

    // 搜索订单
    handleFilter() {
      this.refundListQuery.page = 1
      this.getRefundList()
    },
    // 设置查询的订单起止时间
    dateTimeChange(start, end) {
      this.refundListQuery.startDateTime = start
      this.refundListQuery.endDateTime = end
    },

    handleDownload() {
      this.$message('功能暂未开发，敬请期待！')
    }
  }
}
</script>

