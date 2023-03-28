<template>
  <div>
    <el-row :gutter="15" class="observe">
      <el-col :span="12">
        <Search />
      </el-col>
      <el-col :span="12">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入 自己的两个子组件 category search
import Search from './search'
import Category from './category'
export default {
  name: 'ObserveIndex',
  components: {
    Search,
    Category
  }
}
</script>

<style scoped>
.observe {
  margin-top: 20px;
}
</style>
