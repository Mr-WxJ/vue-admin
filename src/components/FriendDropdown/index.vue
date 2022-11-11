<template>
  <div>
    <friendDropdown ref="sel" v-model="searchValue" v-popover:popSel style="width:100%;" placeholder="请选择" :suffix-icon="popShow?'el-icon-arrow-up':'el-icon-arrow-down'" :size="size" :placeholder="placeholder" :clearable="clearable" :disabled="disabled" :filterable="filterable" @click.native="togglePanel($event)" @change="getGridList()" />
    <el-popover ref="popSel" v-model="popShow" :width="width" placement="bottom-start" trigger="click" @hide="tableHide" @show="tableShow">
      <div>
        <el-table ref="moviesTable" border fit :data="datalist" highlight-current-row size="small" width="100%" :height="height" @row-click="rowClick">
          <!--  插槽  -->
          <slot />

        </el-table>
        <div v-if="isPage">
          <pagination v-show="isPage" :limit.sync="page.pageSize" :page.sync="page.currentPage" :total="page.total" layout="total, prev, pager, next" @pagination="queryGridList" />
        </div>
      </div>
    </el-popover>
  </div>

</template>

<script>

import request from '@/utils/request'
import FriendDropdown from '@/components/FriendDropdown'

export default {
  name: 'ComboGrid',
  components: { FriendDropdown },
  props: {
    value: String,

    // 查询参数
    queryObject: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否分页
    isPage: {
      type: Boolean,
      default: true
    },
    url: {
      type: String
    },
    // 弹出选择框的高度,非输入框的
    height: {
      type: String,
      default: '40px'
    },
    // 弹出选择框的宽度
    width: {
      type: String,
      default: '100px'
    },
    placeholder: { // 占位提示
      type: String,
      default: ''
    },
    disabled: { // 是否只读
      type: Boolean,
      default: false,
      required: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    filterable: { // 是否可搜索
      type: Boolean,
      default: true
    },
    remote: { // 远程搜索，与el-select一致
      type: Boolean,
      default: true
    },
    clearable: { // 是否可清空
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格数据源
      datalist: [],
      // 是否显示下拉
      popShow: false,
      // 显示值
      searchValue: '',
      // 分页对象
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      // 选中行对象
      row: {}
    }
  },
  watch: {
    searchValue: function(newVal) {
      if (!this.popShow) {
        return false
      }
      setTimeout(() => { // 延迟300ms查询
        this.getGridList()
        this.popShow = true
      }, 300)
    },
    // 传入id
    value: function(newVal) {
      if (newVal) {
        this.getGridList(newVal)
        this.$parent.$emit('el.form.blur')
        this.$parent.$emit('el.formItem.blur')
      }
    }
  },
  created() {
    this.getGridList()
  },
  mounted() {
    // 初始化组件赋值
    if (this.isPage) {
      if (this.queryObject.pageSize) this.page.pageSize = this.queryObject.pageSize
      if (this.queryObject.currentPage) this.page.currentPage = this.queryObject.currentPage
      if (this.queryObject.total) this.page.total = this.queryObject.total
    }
  },
  methods: {
    queryGridList() {
      this.getGridList(false)
    },

    /**
     * 查询方法
     * @param isInit
     */
    getGridList(id) {
      if (this.url) {
        let queryParam = {}
        // 开启分页赋值
        if (this.isPage) {
          queryParam.pageSize = this.page.pageSize
          queryParam.currentPage = this.page.currentPage
          if (id) {
            queryParam.agreementCode = id
          } else {
            // 模糊查询协议代码以及 协议名称
            queryParam.agreementCode = this.searchValue
            queryParam.agreementName = this.searchValue
          }
        }
        // 没有开启分页采用 父组件传入值
        if (!this.isPage) {
          queryParam = this.queryObject
        }
        // 信息查询
        request({
          url: this.url,
          methods: 'get',
          data: queryParam
        }).then(request => {
          if (id) {
            this.searchValue = request.data.records[0].agreementName
          } else {
            this.datalist = request.data.records
            // 分页开启时设置信息
            if (this.isPage) {
              this.page.total = request.data.total
            }
          }
        })
      }
    },

    togglePanel(event) {
      event || (event = window.event)
      event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
    },
    tableShow() {
      if (this.disabled) {
        this.popShow = false
        return
      }
      if (this.searchValue === '') {
        this.getGridList()
      }
    },
    tableHide() {
      if (this.datalist.length === 0) {
        this.searchValue = ''
        this.popShow = false
      }
    },
    rowClick(row) {
      this.popShow = false
      this.$emit('rowClick', row)
      this.row = JSON.parse(JSON.stringify(row))
      this.searchValue = row['agreementName']
      this.$refs.sel.blur()
    }
  }
}
</script>

<style lang="scss">
.pop-div-my {
  padding: 0;
  line-height: normal;
  box-shadow: 0 0 11px 0 rgba(174, 187, 211, 0.24);
  border: solid 1px #9eff00;
}
</style>

