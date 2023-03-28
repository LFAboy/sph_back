<template>
  <el-card class="box-card" style="magin: 10px 0px">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visite" />
      </el-tabs>
      <!-- 头部 标签页 右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 日历 -->
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>
    <!-- 中间的内容区域  分栏 的 gutter 属性是设置 每一栏之间的间隔，默认间隔为 0。-->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
            <li>
              <span class="rindex">7</span>
              <span>肯德基</span>
              <span>323</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
// 引入 我们获取日历日期的 依赖包
import dayjs from 'dayjs'
export default {
  name: 'SaleIndex',
  data() {
    return {
      activeName: 'sale',
      date: [] // 收集日历的数据，双向绑定在 日历上。
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    // 设置一个监听属性，监听 title 也就是柱形图的标题, 当我们的 title 发生变化的时候，再次配置echarts 来改变标题
    title() {
      // 当变化时，重新修改 图表的配置数据，注意图表的数据可以再次修改，如果有新的数值就使用新的数值，没有就使用老的数值
      this.charts.setOption({
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    // 当我们的组件挂载的时候，echarts 开始获取DOM 绘画
    // 我们把 echarts 挂到 组件实例上，在其他的地方就可以拿到这个echarts 配置项，然后可以交互变更echarts
    this.charts = echarts.init(this.$refs.charts)

    this.charts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 110, 346, 160, 180, 270],
          color: 'yellowgreen'
        }
      ]
    })
  },
  methods: {
    // 点击日历 今天的回调
    setDay() {
      //  得到今天的日期 并让日历显示，由于日历显示的数据绑定的是 date 所以我们赋值给 date
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day] // 这里注意 date 是一个数组。
    },
    // 点击 本周的回调
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 点击本月的回调
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 点击本年的回调
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.box-card {
    margin-top: 15px;
}
.clearfix {
    display: flex;
    justify-content: space-between;
    position: relative;
}
.tab {
    width: 100%;
}
.right {
    position: absolute;
    right: 0;
}
.date {
    width: 250px;
    margin: 0px 20px;
}
.right span {
    margin: 0px 20px;
}
.charts {
    width: 100%;
    height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0px;
  display: flex;
  justify-content: space-between;
}
ul li span:first-child {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: black;
  color: white;
  padding-left: 4px;
}
.right span {
  cursor: pointer;
}
</style>
