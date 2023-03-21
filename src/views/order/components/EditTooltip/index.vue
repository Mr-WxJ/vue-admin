<template>
  <div>
    <span>操作</span>
    <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
      <div slot="content" style="margin-bottom: 5px">编辑：只可修改订单状态以及对应用户</div>
      <div slot="content" style="margin-bottom: 5px">删除：只可删除无效订单，被删除的订单会被放入回收站</div>
      <i class="el-icon-warning-outline" style="color:orange; margin-left:5px; cursor:pointer;" />
    </el-tooltip>
  </div>
</template>

