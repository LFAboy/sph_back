<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 此处利用了自定义事件 事件名 是getCategoryId  通过props 传递标记三级联动是否能存操作-->
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin: 0px 0px 20px 0px" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格展示我们的平台属性 -->
        <el-table style="width: 100%;" :border="true" :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          />
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150px"
          />
          <el-table-column
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row }">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0px 5px;">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150px"
          >
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者是修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :model="attrInfo" :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table :border="true" style="width: 100%; margin: 20px 0px" :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          />
          <el-table-column
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要input 和span 来回切换显示与隐藏  我们用$index 来区别input框-->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值" size="mini" @blur="toLook(row)" @keyup.native.enter="row.flag = false" />
              <span v-else style="display: block;" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存与取消按钮 -->
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'ProAttr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 存储展示的品牌属性数据
      attrList: [],
      // 这个属性控制 table 表格显示与隐藏
      isShowTable: true,
      // 收集新增或者修改属性 的数据
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    // 自定义回调，获取子组件的ID 并发送请求获取展示的数据
    // 获取子组件（三级联动三个选项的ID）
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        //  当三级分类的ID都确定 发送请求获取品牌属性
        this.getAttrList()
      }
    },
    // 发送请求获取品牌属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值的回调 点击添加属性值的回调
    addAttrValue() {
      // 当我们点击添加属性值的时候，我们应该向 attrInfo.attrValueList 里面push 元素，当有元素了，结构会遍历展示
      this.attrInfo.attrValueList.push({
        // attrId 是属性值的ID 目前是添加属性值的操作，还没有相应的ID，所以带给服务器的是undefined
        // vlaueName 是相应属性值的名称
        attrId: this.attrInfo.id, // 如果我们是新增的属性添加属性值，这个为undefined 如果是修改属性新增属性值，这个属性值的ID与属性的ID与一致，服务器后端给我们返回的属性ID 与属性值 ID 也是一致的
        valueName: '',
        // 给每一个属性值 添加一个标记 flag 用于 input 与span 的显示与隐藏,好处每一个属性值可以控制自己的切换
        flag: true
      })
      // 当我们点击新增一个属性值时，也应该自动聚焦, 注意在渲染后聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 点击添加属性的回调
    addAttr() {
      // 切换 table 的显示与隐藏
      this.isShowTable = false
      // 清除数据, 清除上次残留的数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id, // 此处我们收集，三级联动选择的分区ID
        categoryLevel: 3
      }
    },
    // 点击修改某个属性的回调
    updateAttr(row) {
      this.isShowTable = false
      // 将选中的属性赋值给 attrInfo, 有了数据后会自动撑开表格 注意深拷贝数据，由于数据结构中存在对象里面套数组，数组里面套对象因此需要使用深拷贝解决深层次的问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，给相应的属性值添加上 flog 这个标记
      this.attrInfo.attrValueList.forEach(item => {
        // 直接这样写，也可以给相应的属性值 加上 flag  属性，但是添加的属性不是响应式的数据。视图不会发送变化。
        // item.flag = false
        // Vue ,没办法探测 普通的新增 prototype 所以上述写法不是响应式数据，我们应该用下面的方法新增属性
        // 第一个参数 的添加对象，第二个参数是添加的属性名， 第三个属性是 属性值
        this.$set(item, 'flag', false)
      })
    },
    // input 属性值输入框，失去焦点的回调
    toLook(row) {
      // row 形参是我们当前用户添加的最新的属性值
      // 新增的属性值不能为空
      if (row.valueName.trim() === '') {
        return this.$message(
          {
            type: 'warning',
            message: '请重新输入属性值'
          })
      }
      // 新增的属性值不能与已经有的属性值相同  数组的some 方法，返回一个布尔值，如果有一个满足里面的回调就返回true 否则false
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // 应该先把 最后一个属性值对象给排除，因为row 就是最后一个属性值
        if (item !== row) {
          // 这个条件判断只是把 最后一个对象排除了，并不能得出是否有重复
          return item.valueName === row.valueName.trim()
        }
      })
      if (isRepeat) {
        // 如果重复了，就删除当前添加的属性值
        this.attrInfo.attrValueList.pop()
        return this.$message({
          type: 'warning',
          message: '属性值重复，请重新输入'
        })
      }
      row.flag = false
    },
    // 当我们点击 span 切换到编辑模式时的回调
    toEdit(row, $index) {
      row.flag = true
      // 获取我们点击的 input 节点
      // 注意： 当我们点击切换 input 和span 的时候，对浏览器而言需要重新渲染一下（需要时间），所以我们不会立即拿到input
      // 点击span 重绘一个input 它是需要耗费时间的，我们不可能立即获取到 input, $nextTick() 方法是当节点渲染完毕后会执行一次
      this.$nextTick(() => {
        // 注意我们 不能用 $refs.$index 因为 $index 是一个变量不是字符串
        this.$refs[$index].focus()
      })
    },
    // 气泡确定框的确定按钮的回调 老版本的确定事件为 oncomfirm
    deleteAttrValue(index) {
      // 当前删除属性值的操作不需要发送请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 当我们点击保存按钮的时候（添加属性 或者是修改属性）的回调
    async addOrUpdateAttr() {
      // 先整理参数，带给服务器的参数 去除 flag属性 去除空的属性值
      // filter过滤方法，这个方法会返回一个新的数组。 如果回调中为真就存在新数组中，为假就过滤掉
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName.trim() !== '') {
          delete item.flag
          return true
        }
      })
      // 发送请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.isShowTable = true // 展示表格
        this.getAttrList()
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
