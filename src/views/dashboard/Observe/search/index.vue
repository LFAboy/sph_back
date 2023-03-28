<template>
  <div>
    <el-card>
      <div class="header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <!-- <el-button type="info" icon="el-icon-more" size="mini" /> -->
            <i class="el-icon-more el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="content">
        <div class="left">
          <div class="title">
            <span>搜索用户数</span>
            <Chart />
          </div>
        </div>
        <div class="right">
          <div class="title">
            <span>人均搜索次数</span>
            <Chart />
          </div>
        </div>
      </div>
      <div class="footer">
        <el-table
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="排名"
            width="80px"
          />
          <el-table-column
            prop="prop"
            label="搜索关键字"
            width="width"
          />
          <el-table-column
            prop="prop"
            label="用户数"
            width="width"
          />
          <el-table-column
            prop="prop"
            label="周涨幅"
            width="width"
          />
        </el-table>
      </div>
      <el-pagination
        :total="50"
        layout="prev, pager, next"
      />
    </el-card>
  </div>
</template>

<script>
// 引入 子组件
import Chart from './charts'
export default {
  name: 'ObserveSearch',
  components: {
    Chart
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e4e4;
}
.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
