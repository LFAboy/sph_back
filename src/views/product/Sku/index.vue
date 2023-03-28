<template>
  <div>
    <!-- 该模块的数据是用一个表格展示的 -->
    <el-table :data="skuList" style="width: 100%" :border="true">
      <el-table-column label="序号" type="index" width="80px" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110px">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80px" />
      <el-table-column prop="price" label="价格" width="80px" />
      <el-table-column label="操作" width="width">
        <template slot-scope="{row}">
          <HintButton v-if="row.isSale === 0" type="success" icon="el-icon-top" title="上架" size="mini" style="margin: 0px 5px" @click="sale(row)" />
          <HintButton v-else type="success" icon="el-icon-bottom" title="下架" size="mini" style="margin: 0px 5px" @click="cancel(row)" />
          <HintButton type="primary" icon="el-icon-edit" title="编辑" size="mini" style="margin: 0px 5px" @click="edit()" />
          <HintButton type="info" icon="el-icon-info" title="查看" size="mini" style="margin: 0px 5px" @click="getSkuInfo(row)" />
          <HintButton type="danger" icon="el-icon-delete" title="删除" size="mini" style="margin: 0px 5px" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :page-sizes="[10, 15, 20]"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes"
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right: 5px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <div class="block">
            <el-carousel trigger="click" height="150px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'ProSku',
  data() {
    return {
      page: 1, // 记录当前的页码
      limit: 10, // 记录分页器每一页显示的数据个数
      skuList: [], // 保存我们请求的 skulist数据
      total: 0, // 分页器一共展示的数据
      skuInfo: {}, // 存储我们点击sku 查看详情的数据
      drawer: false, // 控制抽屉的显示与隐藏
      direction: 'rtl' // 控制抽屉的方向，默认是 从右到左，不写就是从右到左
    }
  },
  mounted() {
    // 当我们的组件一挂载 发送一次请求，注意这个请求不止发一次，所以我们定义在methods 中
    this.getSkuList()
  },
  methods: {
    // 发送请求 获取 SKu列表的回调
    async getSkuList() {
      const result = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.skuList = result.data.records
      }
    },
    // 点击分页器中的某一页时，的回调
    handleCurrentChange(pageNo) {
      // 这个方法会把我们点击的页码传递过来 也就是 pageNo
      this.page = pageNo
      this.getSkuList()
    },
    // 当每一页显示的条数发生变化时会触发
    handleSizeChange(limit) {
      // 这个方法会把我们选择的每页显示的个数传递过来
      this.limit = limit
      this.getSkuList() // 不要忘了再次发送请求
    },
    // 上架的回调
    async sale(row) {
      const rowNo = row
      const result = await this.$API.sku.reqSale(rowNo.id)
      if (result.code === 200) {
        rowNo.isSale = 1
        this.$message({
          type: 'success',
          message: '上架成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '上架失败!'
        })
      }
    },
    // 下架的回调
    async cancel(row) {
      const rowNo = row
      const result = await this.$API.sku.reqCancel(rowNo.id)
      if (result.code === 200) {
        rowNo.isSale = 0
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '下架失败！'
        })
      }
    },
    // 点击编辑按钮的回调
    edit() {
      this.$message('正在开发中...')
    },
    // 点击查看详情的按钮的回调
    async getSkuInfo(row) {
      this.drawer = true // 展示抽屉
      // 发送请求 获取 SKU 详情
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
 .el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
 }
 .el-col {
  margin: 10px 10px;
 }

 .el-carousel >>> .el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
