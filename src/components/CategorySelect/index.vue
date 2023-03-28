<template>
  <div>
    <!-- 这个是行内表单 有 inline 属性 一行可以放多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  // eslint-disable-next-line vue/require-prop-types
  props: ['show'],
  data() {
    return {
      // 收集一级分类的数据
      list1: [],
      // 收集二级分类的数据
      list2: [],
      // 收集三级分类的数据
      list3: [],
      // 收集整个三级分离的ID
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 获取一级分类的数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类的方法
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 当一级分类的选中项变化时，我们获取二级分类的数据。 一级分类的回调
    async handler1() {
      // 清空数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      // 给父组件传递 一级分类的ID  用于父组件请求要展示的数据
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 当二级分类我们 选择后，此时我们要请求第三级分类的数据 二级分类的回调
    async handler2() {
      // 清空数据
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      // 给父组件传递 二级分类的ID  用于父组件请求要展示的数据
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 三级分类的回调， 当我们选中三级分类中的选项的时候，此时我们应该发送请求，在下面展示内容
    handler3() {
      const { category3Id } = this.cForm
      // 给父组件传递 一级分类的ID  用于父组件请求要展示的数据
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
