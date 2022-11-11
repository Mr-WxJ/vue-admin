<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-options">
        <span>
          <el-select v-model="orderListQuery.orderStatus" placeholder="订单状态" class="filter-item" style="width: 110px" left>
            <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </span>
        <span>
          <el-select v-model="orderListQuery.orderStatus" placeholder="订单状态" class="filter-item" style="width: 110px" left>
            <el-option v-for="item in tbUnionAccountOptions" :key="item.value" :label="item.name" :value="item.value" />
            <el-checkbox-button v-model="showPromote" class="filter-item" style="margin-left: 15px" @change="tableKey = tableKey + 1">推广订单</el-checkbox-button>
          </el-select>
        </span>
        <span>
          <el-tooltip :disabled="disabled" content="查看总佣金" placement="bottom" effect="light" transition="el-fade-in-linear">
            <el-checkbox-button v-model="showRate" class="filter-item" style="margin-left: 15px" @change="tableKey = tableKey + 1">佣金</el-checkbox-button>
          </el-tooltip>
        </span>
      </div>
      <div class="search-box">
        <el-input v-model="orderListQuery.orderId" placeholder="订单号" style="width: 220px" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" size="small" :data="list" fit style="width: 100%" :header-cell-style="{height: '60px',}">
      <el-table-column label="订单信息" width="520px" min-width="500px" align="left">
        <template slot-scope="{ row }">
          <div class="order-goodsInfo">
            <div class="order-itemImg">
              <a :href="row.goodsInfo.itemUrl" style=" width: 100% ; height: 80px">
                <el-image :src="row.goodsInfo.itemImg" class="cover" style="width: 100%  ; height: 80px" />
              </a>
            </div>
            <div class="order-info">
              <div class="order-info-name"><a :href="row.goodsInfo.itemUrl">{{ row.goodsInfo.itemName }}</a></div>
              <div class="order-info-left">店铺名：{{ row.goodsInfo.shopName }}</div>
              <div class="order-info-left">父订单编号：{{ row.parentOrderId }}</div>
              <div class="order-info-left"><span>子订单编号：{{ row.orderId }}</span><span v-if="row.finishTime" class="order-time">{{ row.finishTime }} 结算</span></div>
              <div><span class="order-info-money">付款金额：<span class="paid-money">￥{{ row.estimateCosPrice }}</span></span><span class="order-time">{{ row.paidTime }} 付款</span></div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="70px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.orderStatus | statusFilter">{{ row.orderStatus | statusToChFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="微信备注" min-width="100px" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.wxName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" min-width="130px" align="left">
        <template slot-scope="{ row }">
          <div class="rate-info">
            <div class="rate-info"><span>佣金比例：<span class="rate-info-data">{{ row.commissionRate }}%</span></span></div>
            <div class="rate-info"><span>分成比例：<span class="rate-info-data">{{ row.subSideRate }}%</span></span></div>
            <div class="rate-info"><span>平台比例：<span class="rate-info-data">{{ row.platformRate }}%</span></span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户佣金" min-width="155px">
        <template slot-scope="{ row }">
          <div v-if="(row.customerEstimateFee)" class="rate-info">
            <div class="rate-info"><span>预估计佣金额：</span><span class="rate-info-data">￥{{ row.estimateCosPrice }}</span></div>
            <div class="rate-info"><span>付款预估佣金：</span><span class="rate-info-data">￥{{ row.customerEstimateFee }}</span></div>
            <div v-if="row.actualCosPrice" class="rate-info"><span>实际计佣金额：</span><span class="rate-info-data">￥{{ row.actualCosPrice }}</span></div>
            <div v-if="row.actualFee" class="rate-info-final"><span>结算预估佣金：</span><span class="rate-info-final-fee">￥{{ row.customerActualFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="showRate" label="佣金" min-width="155px">
        <template slot-scope="{ row }">
          <div class="rate-info">
            <div class="rate-info"><span>预估计佣金额：</span><span class="rate-info-data">￥{{ row.estimateCosPrice }}</span></div>
            <div class="rate-info"><span>付款预估佣金：</span><span class="rate-info-data">￥{{ row.estimateFee }}</span></div>
            <div v-if="row.actualCosPrice" class="rate-info"><span>实际计佣金额：</span><span class="rate-info-data">￥{{ row.actualCosPrice }}</span></div>
            <div v-if="row.actualFee" class="rate-info-final"><span>结算预估佣金：</span><span class="rate-info-final-fee">￥{{ row.actualFee }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="showPromote" label="推广" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span class="promote-logo">{{ row.promote }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <div>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          </div>
          <br>
          <div>
            <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="orderListQuery.page" :limit.sync="orderListQuery.limit" @pagination="getOrderList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in orderStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要性">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top: 8px" />
        </el-form-item>
        <el-form-item label="点评">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchOrderList, fetchPv, updateOrder } from '@/api/order'
import { fetchTbUnionAccountList } from '@/api/robot'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const orderStatusOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { value: undefined, name: '全部订单' },
  { value: '12', name: '已付款' },
  { value: '3', name: '已结算' },
  { value: '13', name: '已失效' },
  { value: '88', name: '已发放' }
]
const tbUnionAccountOptions = [
  // 3：订单结算，12：订单付款， 13：订单失效
  { value: this.clientList.data.clientList.clientId, name: this.clientList.data.clientList.clientName }]

export default {
  name: 'OrderTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    // 为订单状态增加标签样式
    statusFilter(orderStatus) {
      const statusMap = {
        3: 'success',
        13: 'info',
        88: 'warning'
      }
      return statusMap[orderStatus]
    },
    // 将数字订单状态转为中文
    statusToChFilter(orderStatus) {
      // 3：订单结算，12：订单付款， 13：订单失效
      if (orderStatus === 3) {
        orderStatus = '结算'
      } else if (orderStatus === 12) {
        orderStatus = '付款'
      } else if (orderStatus === 13) {
        orderStatus = '失效'
      } else if (orderStatus === 88) {
        orderStatus = '发放'
      }
      return orderStatus
    }

  },
  data() {
    return {
      tableKey: 0,
      orderList: null,
      clientList: null,
      total: 0,
      listLoading: true,
      orderListQuery: {
        orderId: undefined,
        orderStatus: undefined,
        page: 1,
        limit: 20
      },
      // 订单状态下拉列表
      orderStatusOptions,
      // 淘宝联盟账户推广id下拉列表
      tbUnionAccountOptions,

      importanceOptions: [1, 2, 3],
      showPromote: false,
      showRate: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getOrderList()
    // this.getTbUnionAccountList()
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

    // 获取订单列表
    getOrderList() {
      this.listLoading = true
      fetchOrderList(this.orderListQuery).then((response) => {
        this.orderList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 获取机器人列表
    getTbUnionAccountList() {
      fetchTbUnionAccountList().then((response) => {
        this.clientList = response.data.clientList
      })
    },
    // 搜索订单
    handleFilter() {
      this.orderListQuery.page = 1
      console.log(this.orderListQuery)
      this.getOrderList()
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateOrder(tempData).then(() => {
            const index = this.orderList.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
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

<style>
.el-header {
  /* 设置行间的距离(行高) */
  line-height: 50px;
  color: rgb(250, 248, 248);
  /* 字体大小 */
  font-size: 20px;
}

.search-options {
  float: left;
}
.search-box {
  float: right;
}
.order-goodsInfo {
  height: 100%;
  width: 500px;
  display: flex;
  align-items: center;
}
.order-itemImg {
  float: left;
  width: 15%;
  height: 80px;
}
.order-info {
  float: right;
  width: 85%;
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
  font-size: 6px;
  float: right;
}

/* 佣金比例 */
.rate-info {
  text-align: left;
  font-size: 11px;
  /* color: rgb(128, 128, 128); */
  color: #8492a6;
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
  color: rgb(221, 120, 76);
}
.promote-logo {
  font-weight: bold;
  font-size: 11px;
  color: rgb(221, 120, 76);
}
</style>
