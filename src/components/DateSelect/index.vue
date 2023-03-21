<template>

  <el-date-picker v-model="dateRange" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" size="small" style="width: 280px" @change="dateRangeChange" />

</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      // 查询日期范围
      dateRange: null,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.minDate = minDate
          this.maxDate = maxDate
          console.log(maxDate, minDate, '-')
        },
        disabledDate: (time) => {
          // 查询时间跨度为30天
          const curDate = new Date().getTime()
          const three = 365 * 24 * 3600 * 1000
          const threeMonths = curDate - three
          if (time.getTime() > threeMonths && this.minDate && !this.maxDate) {
            const range = 30 * 24 * 3600 * 1000
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.minDate.getTime() + range ||
              time.getTime() < this.minDate.getTime() - range
            )
          }
          return (
            time.getTime() > Date.now() - 24 * 3600 * 1000 || // 这里限制是前一天
            time.getTime() < threeMonths // 这里是两年前的限制
          )
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const start = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const start = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              const start = moment().weekday(0).format('YYYY-MM-DD')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上周',
            onClick(picker) {
              const start = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const start = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const start = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const start = moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss')
              const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
              picker.$emit('pick', [start, end])
            }
          }
          // {
          //   text: '最近90天',
          //   onClick(picker) {
          //     const start = moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss')
          //     const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
          //     picker.$emit('pick', [start, end])
          //   }
          // }
        ]
      }
    }
  },
  mounted() {
    // 默认查询一个月
    this.initDateRange(
      // moment().subtract('days', 30).toDate(),
      moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    )
  },
  methods: {
    // 初始化日期范围
    initDateRange(startDate, endDate) {
      this.dateRange = [startDate, endDate]
      this.dateRangeChange()
    },
    // 时间范围改变
    dateRangeChange() {
      // 调用父组件传递的有参方法
      // emit 第一个参数：事件名，之后的参数：方法参数
      this.$emit('dateRangeChange', moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss'))
    }
  }
}
</script>

