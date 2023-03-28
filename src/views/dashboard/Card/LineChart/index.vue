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
  name: 'LineChart',
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
          type: 'line',
          data: [10, 27, 43, 12, 99, 9],
          // 拐点的样式设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'purple'
          },
          // 填充的样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
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
