<template>
  <div class="app-container">
    <div class="middle-body-background">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全部订单" name="allOrder">
          <keep-alive>
            <AllOrder />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="维权退款订单" name="refundOrder">
          <keep-alive>
            <RefundOrder v-if="activeName=='refundOrder'" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="回收站" name="recycleOrder">
          <keep-alive>
            <RecycleOrder v-if="activeName == 'recycleOrder'" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>

import AllOrder from './all/'
import RefundOrder from './refund/'
import RecycleOrder from './recycle/'

export default {
  components: { AllOrder, RefundOrder, RecycleOrder },
  data() {
    return {
      activeName: 'allOrder'
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
.el-tabs__item {
  font-size: 18px !important;
  color: rgb(128, 128, 128);
  scroll-margin-left: 10px;
}
.el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
    90deg,
    transparent 0,
    transparent 0%,
    #4d72f6 0,
    #4d72f6 100%,
    transparent 0,
    transparent
  );
}
</style>
