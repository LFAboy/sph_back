<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
    >添加</el-button>
    <!-- elementUI 表格组件
      data: 表格将来需要展示的数据（数组类型）
      border:是否带有纵向边框
      el-table-column属性：注意这个组件是“一列”
        label: 显示标题，这一列的标题
        width: 对应列的宽度
        align: 标题的对应方式     -->
    <el-table style="width: 100%" :border="true" :data="list">
      <el-table-column
        label="序号"
        width="80px"
        algin="center"
        type="index"
      />
      <el-table-column
        label="品牌名称"
        width="width"
        prop="tmName"
      />
      <el-table-column
        label="品牌LOGO"
        width="width"
        prop="logoUrl"
      >
        <!-- 此处是 table 给 table-column 传递数据，由table-column 形成解构再传递给table，
          每次传递的数据是： 这个table 绑定的数据（数组）中的一个，
          这里table 绑定的数组是对象构成的，传递的是一个对象，table-column 用 row接受传递过来的数据，
          用形参 $index 接受这个数据在数组中的索引 -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:100px; height:100px">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="width"
      >
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- element UI 分页器组件
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="margin-top: 20px; text-align: center;"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      :page-count="7"
      layout="prev, pager, next, jumper, ->, sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 添加或者修改品牌的对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- el-upload 组件action 属性是我们图片提交的地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 当前分页器的页码  第几页
      page: 1,
      // 当前页码展示数据的条数
      limit: 3,
      // 整个品牌列表的总条数  也就是数据库中关于品牌的数据条数
      total: 0,
      // 列表展示的数据，当前页码中列表所展示的数据 是一个数组
      list: [],
      // 保存对话框显示与隐藏的状态
      dialogFormVisible: false,
      // 上传图片时，保存图片的地址
      imageUrl: '',
      // 收集添加品牌表单的数据 tmForm 的属性命名需要与后端的接口一致
      tmForm: {
        logoUrl: '',
        tmName: ''
      },
      // 表单验证的规则
      // required 是否必须验证， message 提示信息 trigger 触发验证的事件名称 blur 是失去焦点 由于图片上传，change 指的是文本发生改变，而图片的文本并没有改变，所以我们不用 change，加上没有意义
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌的LOGO图片' }
        ]
      }
    }
  },
  // 当组件挂载完毕需要发送请求，获取数据库中的品牌列表
  mounted() {
    // 获取品牌列表
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的方法
    async getPageList() {
      // 解构出参数
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当当前页码改变时触发的回调  且会把我们点击的页码传递给这个回调
    handleCurrentChange(toPage) {
      this.page = toPage
      this.getPageList()
    },
    // 当每一页展示数据的个数发生变化时，会触发该回调，并传递一个参数：选中的每页个数
    handleSizeChange(toLimit) {
      this.limit = toLimit
      this.getPageList()
    },
    // 点击显示对话框（添加或修改品牌属性的对话框）
    showDialog() {
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogFormVisible = true
    },
    // 点击修改某一个品牌的回调
    updateTradeMark(row) {
      this.tmForm = { ...row }
      this.dialogFormVisible = true
    },
    // 上传图片成功时的回调
    handleAvatarSuccess(res, file) {
      // 参数 res是上传成功后返回的 结果，其中data属性保存的是上传的图片在服务器中的地址
      // 参数 file 是上传成功后服务器返回的数据。
      this.imageUrl = URL.createObjectURL(file.raw)
      this.tmForm.logoUrl = res.data
    },
    // 当图片开始上传前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 当我们点击添加或者修改品牌对话框的确定时的回调 如果通过了验证规则，我们才能发送请求
    addOrUpdateTradeMark() {
      // validate 方法可以验证是否全部的验证通过，如果通过就给回调传递 true 有一个没通过就是false,然后执行里面的回调
      this.$refs.ruleForm.validate(async(success) => {
        // 如果全部符合 才发送请求
        if (success) {
          this.dialogFormVisible = false
          // 发送请求，有可能是添加或修改
          // const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
          // this.$message(this.tmForm.id ? '修改成功' : '添加成功')
            this.$message({
              message: this.tmForm.id ? '修改成功' : '添加成功',
              type: 'success'
            })
            this.getPageList()
          }
        } else {
          this.$message.error('添加品牌失败')
          return false
        }
      })
    },
    // 删除品牌的回调
    deleteTradeMark(row) {
      // 弹框 确认是否删除
      this.$confirm(`确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当我们点击确定按钮的时候，需要向服务器发送请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
