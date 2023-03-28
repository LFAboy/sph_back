<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片，action是上传的地址，list-type 文件列表的类型 file-list上传的文件列表 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option v-for="unselect in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plue" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- table 展示的是当前的 SPU自己的销售属性 -->
        <el-table style="width: 100%;" :border="true" :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          />
          <el-table-column
            label="属性值名称列表"
            width="width"
          >
            <template slot-scope="{ row}">
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                @click="showInput"
                下面的结构类似 input 与 span 来回切换，由于有多个 input 与 span 所以我们不能在data 中用 一个标记来控制切换
                所以我们在每一个销售属性的对象上加上一个标记属性来控制这个销售属性值input span的切换
               -->
              <el-input
                v-if="row.inputVisible"
                ref="saveInputValue"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.native.enter="row.inputVisible = false"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{ $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      tradeMarkList: [], // 存储我们获取的SPU对应的品牌数据列表
      spuImageList: [], // 存储SPU对应的图片数据数组
      saleAttrList: [], // 存储平台中所有的销售属性列表数据
      attrIdAndAttrName: '', // 收集我们未选择的销售属性的ID
      // spu 属性初始化的时候如果是一个空对象，在修改SPU 的时候，会向服务器发送请求，返回SPU的值，此时如果我们修改SPU 那么实质就是把
      // 我们要收集的数据，放在了服务器返回的SPU 对象上。
      // 添加SPU 如果是添加SPU 的时候，由于并没有向服务器发送请求，所以SPU 不能是一个空对象，否则没法收集数据
      // 存储我们收集到的SPU 数据
      spu: {
        category3Id: 0, // 添加三级分类的ID
        description: '', // SPU的描述
        spuName: '', // SPU 名称
        tmId: '', // 品牌的ID
        spuImageList: [ // 收集SPU图片的信息
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        spuSaleAttrList: [ // SPU销售属性与属性值的收集
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: 'sdf',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      }
    }
  },
  computed: {
    // 计算该SPU没有的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个，在 data 的 saleAttrList,当前的SPU 拥有的属于自己的销售属性在 spu.spuSaleAttrList
      // filter 数组的过滤方法，可以从已经有的数组中过滤出用户需要的元素，并且返回一个新的数组, 这个方法返回的是一个布尔值
      const result = this.saleAttrList.filter(item => {
        // every 是数组的一个方法，会返回一个布尔值
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      // 计算属性必须要有一个返回值，把属性值返回
      return result
    }
  },
  methods: {
    // 放在图片上的删除按钮回调(照片墙组件的事件回调)
    handleRemove(file, fileList) {
      // file 是我们要删除的那张图， fileList 是照片墙删除某一张后的剩余的其他图片
      // console.log(file, fileList)
      // 收集照片墙的数据 收集到 data 下的 supImageList 注意照片墙中显示的图片有 name 和 url 字段 因为照片墙显示数据要有这俩属性
      // 对于服务器而言，不需要带这俩数据，所以我们提交的时候，要去掉这俩属性
      this.spuImageList = fileList
    },
    // 预览照片墙的回调（照片墙组件的事件回调）
    handlePictureCardPreview(file) {
      // 将照片地址赋值给这个属性
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 初始化 SpuForm 组件的数据的方法
    async initSpuData(spu) {
      // 如果是修改，则发送四个请求，获取需要修改的数据
      // 获取SPU信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取SPU 对应品牌的列表数据
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取SPU 图标的信息接口
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        // 由于照片墙，在修改模式下展示图片的数据需要数组，且数组里面的元素要有 name url字段
        // 所以我们需要把服务器返回的SPU图片数据，中的每一个元素加上 name url 属性再赋值给 this.spuImageList
        const listAttr = spuImageResult.data
        listAttr.forEach(item => {
          // 数组的 数据进行变更或者进行替换的时候，Vue 能够监测到，是响应式数据
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值
        this.spuImageList = listAttr
      }
      // 获取平台中所有的销售属性种类
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 照片墙 新增照片成功的回调
    handlerSuccess(response, file, fileList) {
      // response对象中可以看图片在服务器中的地址 file对象是关于我们上传成功的那张图的 fileList对象是上传成功后所有的图片的信息
      // 收集图片的信息 这里面的图片也是有 name 和 url 属性的注意后期去掉
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到了需要添加属性的信息在 data 下的attrIdAndAttrName， 我们需要放到 sup里面
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu 对象的 spuSaleAttrList 中添加上面的属性信息
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = '' // 清空数据
    },
    // 点击添加属性值的按钮的回调
    addSaleAttrValue(row) {
      // 切换为 input
      // 注意此处要用响应式方式添加 inputVisible 控制 span input 切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据 inputValue 字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        // 注意我们 不能用 $refs.$index 因为 $index 是一个变量不是字符串
        this.$refs.saveInputValue.focus()
      })
    },
    // el-input 失去焦点的回调
    handleInputConfirm(row) {
      // 解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row
      // 注意判断新增的属性值不能为空，不能重复
      if (inputValue.trim() === '') {
        this.$message({
          type: 'warning',
          message: '输入不能为空'
        })
        this.$nextTick(() => {
        // 注意我们 不能用 $refs.$index 因为 $index 是一个变量不是字符串
          this.$refs.saveInputValue.focus()
        })
        return 0
      }
      // 判断属性值不能重复
      const isRepeat = row.spuSaleAttrValueList.some(item => {
        if (item.saleAttrValueName === inputValue.trim()) {
          return true
        }
      })
      if (isRepeat) {
        this.$message({
          type: 'error',
          message: '该属性值已经存在，请重新输入！'
        })
        row.inputValue = ''
        // this.$nextTick(() => {
        // // 注意我们 不能用 $refs.$index 因为 $index 是一个变量不是字符串
        //   this.$refs[$index].focus()
        // })
        row.inputVisible = true
        this.$nextTick(() => {
        // 注意我们 不能用 $refs.$index 因为 $index 是一个变量不是字符串
          this.$refs.saveInputValue.focus()
        })
        return 0
      }
      // 新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 切换为 span
      row.inputVisible = false
    },
    // 点击保存 添加或者是修改SPU 的回调
    async addOrUpdateSpu() {
      // 整理参数，需要整理照片墙的数据，对于图片，需要携带 imageName 与 imageUrl 字段
      // 注意 map 的用法。
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发送请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 通知父组件 回到场景0
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? '修改' : '添加'
        })
      } else {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
      // 清除数据残留，下次点击添加或者修改的时候，没有数据残留 this.$options 获取这个VC实例的配置项
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加 SPU 按钮的时候发请求的函数
    async addSpuData(category3Id) {
      // category3Id参数是 收集category3Id
      this.spu.category3Id = category3Id
      // 获取SPU 对应品牌的列表数据
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台中所有的销售属性种类
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 点击 取消，按钮的回调
    cancel() {
      // 通知父组件改变场景
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清空数据 Object.assigon() 合并对象的方法
      // this.$options 可以获得配置对象，配置对象的data 函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
