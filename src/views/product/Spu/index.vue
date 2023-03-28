<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 下面的卡片将来有三部分进行切换 -->
      <div v-show="scene === 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" :border="true">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
          />
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          />
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{ row }">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu的全部sku列表" @click="handler(row)" />
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          :total="total"
          layout="prev, pager, next, jumper, ->, sizes, total"
          style="text-align: center;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- 展示 添加 | 修改SPU 模块-->
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene" />
      <!-- 展示 添加SKU 模块 -->
      <SkuForm v-show="scene === 2" ref="sku" @changeScene="changeScene" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :border="true" :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'ProSpu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 收集分类的ID
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 分页器当前第几页
      limit: 3, // 每一页需要展示的数据个数
      records: [], // spu 列表的数据
      total: 0, // spu 列表数据的总个数。
      scene: 0, // 控制下面卡片三种状态显示与隐藏的状态， 0代表展示SPU数据 1 代表添加|修改SPU 2代表添加sku
      dialogTableVisible: false, // 控制对话框的显示与隐藏。
      spu: {}, // 对话框需要展示的Spu
      skuList: [], // 存储的是 我们对话框需要展示的SKU 列表的数据
      loading: true // 控制加载效果
    }
  },
  methods: {
    // CategorySelect 组件绑定的回调，收集三级联动的选项ID 这个事件是一个自定义事件
    getCategoryId({ categoryId, level }) {
      // categoryId 是获取一 二 三 级分类的ID level 为了区分获取的ID 是几级的
      if (level === 1) {
        // 收集一级分类的ID 同时清除之前的二级 三级分类ID
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 当我们有 第三级ID 的时候就该发送请求 获取 SPU 数据了
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    // 获取 SPU 列表的方法
    async getSpuList() {
      const { page, limit, category3Id } = this
      // 需要携带三个参数。
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
      this.scene = 0
    },
    // 当我们点击 分页器的时候 自定义事件 current-change
    handleCurrentChange(page) {
      // elementUI 给我们传入一个参数，就是我们点击的页码数
      this.page = page
      this.getSpuList() // 再次发送请求
    },
    // 当我们分页器每一页展示数据的个数发送变化的回调
    handleSizeChange(limit) {
      // 该事件触发 会给我们传入变化后的 每页个数
      this.limit = limit
      this.getSpuList()
    },
    // 点击 添加 SPU 的回调
    addSpu() {
      this.scene = 1
      // 通知子组件发送请求 同时把 category3Id 给子组件保存
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 点击修改 SPU 的回调
    updateSpu(row) {
      this.scene = 1
      // 拿到子组件，让子组件，发送四个请求获取数据
      this.$refs.spu.initSpuData(row)
    },
    // 子组件的自定义事件changeScene回调 切换这三个显示模块
    changeScene({ scene, flag }) {
      // flag 用来标记是添加还是修改
      this.scene = scene
      if (flag === '添加') {
        this.page = 1
      }
      this.getSpuList() // 重新获取一次SPU列表数据
    },
    // 删除SPU 的按钮的回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.page = this.records.length > 1 ? this.page : this.page - 1
        this.getSpuList()
      }
    },
    // 点击添加 SKU按钮的回调
    addSku(row) {
      // 切换场景
      this.scene = 2
      // 获取子组件，调用子组件的方法，让子组件发送请求 三个请求，记得传给子组件参数
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 查看Sku 列表的回调
    async handler(row) {
      this.spu = row // 保存我们点击的 SPU信息
      // 当点击这个按钮的时候，咱们的对话框是显示的
      this.dialogTableVisible = true
      // 获取sku 列表的数据进行展示。
      const result = await this.$API.spu.reqSkuList(this.spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false // 隐藏我们的loading 效果
      }
    },
    // 关闭对话框的回调
    close(done) {
      // 注意 before-close 属性，关闭前的回调，会暂停 Dialog 的关闭	function(done)，done 用于关闭 Dialog
      this.loading = true // 把加载效果加上，下次再加载的时候继续有这个效果。
      this.skuList = [] // 清空 skuList 列表的数据，让下次展示的时候没有上次的数据残余
      done() // 我们执行一下才会关闭这个对话框
    }
  }
}
</script>

<style scoped>
</style>
