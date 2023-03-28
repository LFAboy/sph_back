<template>
  <!-- 容器 -->
  <div ref="charts" class="charts">
    <!-- 这是我们的容器 -->
  </div>
</template>

<script>
// 引包 echarts
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    // 当我们的组件挂载完毕后，就开始获取容器绘图。
    const lineChart = echarts.init(this.$refs.charts)

    // 配置echarts参数
    lineChart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [10, 27, 43, 12, 99, 9, 65, 9, 23, 81, 32],
          color: 'cyan'
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts{
    width: 100%;
    height: 100%;
}
</style>
