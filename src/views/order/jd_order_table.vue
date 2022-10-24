<template>
  <el-table :data="list" stripe style="width: 100%" highlight-current-row cell-class-name="container_lefts">
    <el-table-column label="商品信息">
      <!-- 分行显示 -->
      <template slot-scope="scope">
        <el-table :data="scope.row.goodsList" :show-header="false">
          <el-table-column prop="name" />
          <el-table-column prop="num" />
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="goodsCount" label="商品总数" width="140" />
    <el-table-column fixed="right" align="center" width="230" label="操作">
      <el-button type="primary" size="small">打包</el-button>
      <el-button type="primary" size="small">打印</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          goodsList: [
            {
              name: '青椒鸡蛋炒饭',
              num: '3'
            },
            {
              name: '鱼香肉丝盖浇饭',
              num: '2'
            },
            {
              name: '干锅土豆片盖浇饭',
              num: '5'
            }
          ],
          goodsCount: '10'
        },
        {
          goodsList: [
            {
              name: '青椒鸡蛋炒饭',
              num: '3'
            },
            {
              name: '鱼香肉丝盖浇饭',
              num: '2'
            },
            {
              name: '干锅土豆片盖浇饭',
              num: '5'
            }
          ],
          goodsCount: '10'
        }
      ]
    }
  }
}
</script>
