<template>
  <div>
    <span>订单状态</span>
    <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
      <div slot="content" style="margin-bottom: 5px">待付款：指订单已下单，但还未付款</div>
      <div slot="content" style="margin-bottom: 5px">已付款：指订单已付款，但还未确认收货</div>
      <div slot="content" style="margin-bottom: 5px">已结算：指订单已确认收货，但佣金并未发放</div>
      <div slot="content" style="margin-bottom: 5px">付定金：指订单已付定金</div>
      <div slot="content" style="margin-bottom: 5px">已失效：具体原因在状态上查看</div>
      <div slot="content" style="margin-bottom: 5px">已发放：指订单佣金已经发放到用户账户余额</div>
      <i class="el-icon-warning-outline" style="color:orange;margin-left:5px;cursor:pointer;" />
    </el-tooltip>
  </div>
</template>

