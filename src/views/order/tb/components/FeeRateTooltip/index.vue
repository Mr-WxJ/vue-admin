<template>
  <div>
    <span>佣金比例</span>
    <el-tooltip placement="top" effect="light" transition="el-fade-in-linear" scoped-slot>
      <div slot="content" style="margin-bottom: 5px">佣金比例：淘宝联盟设置的佣金比例</div>
      <div slot="content" style="margin-bottom: 5px">提成比例：指实际获得收益的比率</div>
      <div slot="content" style="margin-bottom: 5px">平台比例：本平台设置的用户佣金比例</div>
      <div slot="content" style="margin-bottom: 5px">技术服务费：佣金 * 技术服务费率。推广者赚取佣金后支付给阿里妈妈的技术服务费用</div>
      <i class="el-icon-warning-outline" style="color:orange; margin-left:5px; cursor:pointer;" />
    </el-tooltip>
  </div>
</template>

