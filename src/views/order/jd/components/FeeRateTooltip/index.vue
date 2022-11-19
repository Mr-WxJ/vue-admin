<template>
  <div>
    <span>佣金比例</span>
    <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
      <div slot="content" style="margin-bottom: 5px">佣金比例：京东联盟设置的佣金比例</div>
      <div slot="content" style="margin-bottom: 5px">分佣比例：京东联盟设置的最终分佣比例</div>
      <div slot="content" style="margin-bottom: 5px">平台比例：本平台设置的用户佣金比例</div>
      <i class="el-icon-warning-outline" style="color:orange; margin-left:5px; cursor:pointer;" />
    </el-tooltip>
  </div>
</template>

