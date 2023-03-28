<template>
  <div>
    <!-- 准备一个容器 -->
    <div ref="charts" class="charts" />
  </div>
</template>

<script>
// 引入 echarts 依赖包
import * as echarts from 'echarts'
export default {
  name: 'SearchChart',
  mounted() {
    this.charts = echarts.init(this.$refs.charts)
    this.charts.setOption({
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
}

</style>
