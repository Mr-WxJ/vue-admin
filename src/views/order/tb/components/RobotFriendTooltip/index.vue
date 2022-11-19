<template>
  <div>
    <span>用户</span>
    <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
      <div slot="content" style="margin-bottom: 5px">不为空：机器人好友备注或微信名</div>
      <div slot="content" style="margin-bottom: 5px">为空：指未绑定微信的订单</div>
      <i class="el-icon-warning-outline" style="color:orange; margin-left:5px; cursor:pointer;" />
    </el-tooltip>
  </div>
</template>

