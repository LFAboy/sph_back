<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="销售总额" count="￥126500">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.71%<svg t="1677510584009" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4057" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" fill="#d81e06" p-id="4058" /></svg>
              </span>
              &nbsp;
              <span>日同比&nbsp;&nbsp;6.98%<svg t="1677510770678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5470" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" fill="#1afa29" p-id="5471" /></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额￥12482</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="887679">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量 1324</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88430">
            <template slot="charts">
              <BarChart />
            </template>
            <template slot="footer">
              <span>转化率  67%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart />
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.71%<svg t="1677510584009" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4057" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" fill="#d81e06" p-id="4058" /></svg>
              </span>
              &nbsp;
              <span>日同比&nbsp;&nbsp;6.98%<svg t="1677510770678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5470" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" fill="#1afa29" p-id="5471" /></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入我们的子组件 Detail
import Detail from './Detail'
// 引入 子组件 lineChart
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart'

export default {
  name: 'CardIndex',
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  },
  data() {
    return {
      num: 0
    }
  }
}
</script>

<style>

</style>
