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
  name: 'ProgressChart',
  mounted() {
    // 当我们的组件挂载完毕后，就开始获取容器绘图。
    const lineChart = echarts.init(this.$refs.charts)

    // 配置echarts参数
    lineChart.setOption({
      xAxis: {
        show: false,
        // x 轴的 最大值 与最小值的设置
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        // 均分 设置在 Y 轴就是 Y轴均分，设置在 X 轴就是 X轴均分
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: '#72FA93',
          // 设置柱状图的宽度
          barWidth: 10,
          // 设置显示背景颜色
          showBackground: true,
          // 背景样式的设置
          backgroundStyle: {
            color: '#eee'
          },
          // 文本标签的设置
          label: {
            show: true,
            formatter: '|', // 把这个文本标签的内容改变
            // 设置这个文本标签 的位置
            position: 'right'
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
