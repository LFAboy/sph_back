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
        <!-- 这里是一个 echarts 饼图 -->
      </div>
      <el-pagination
        :total="50"
        layout="prev, pager, next"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ObserveCategory'
}
</script>

<style>

</style>
