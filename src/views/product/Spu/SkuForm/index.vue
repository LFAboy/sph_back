<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="请描述规格" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <!-- 注意，此处我们将平台属性收集到了 每一个平台属性对象新增的一个属性上，不能直接收集到每一个平台属性对象上，因为此处收集的是一个字符串，两个数据合成的字符串，后期整理参数的时候再改 -->
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" :border="true" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80px" />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px">
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
          />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault === 0" type="primary" size="mini" @click="changeDeafult(row)">设置默认</el-button>
              <el-button v-else type="success" size="mini">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [], // 存储图片的信息
      spuSaleAttrList: [], // 存储销售属性的数据
      attrInfoList: [], // 存储平台属性的数据
      // 收集 sku 数据
      skuInfo: {
        // 收集的第一类数据， 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二大类需要收集的数据 是通过v-model 双向绑定收集的
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类收集的数据 需要自己写代码
        skuDefaultImg: '', // 默认的图片
        skuAttrValueList: [ // 平台属性
          {
            attrId: 0,
            valueId: 0
          }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [ // 收集销售属性
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      imageList: [] // 收集选中的图片的数组，这个数组元素没有isDefault属性，后期再整理到skuInfo中
    }
  },
  methods: {
    // 获取skuForm 初始化数据
    async getData(category1Id, category2Id, spu) {
      // 在此处收集我们的第一类数据 也就是父组件传递给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId

      this.spu = spu
      // 获取图片的数据
      const imageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imageResult.code === 200) {
        const list = imageResult.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取 销售属性的数据
      const saleAttrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (saleAttrResult.code === 200) {
        this.spuSaleAttrList = saleAttrResult.data
      }
      // 获取平台属性的数据
      const attrResult = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.id)
      if (attrResult.code === 200) {
        this.attrInfoList = attrResult.data
      }
    },
    // 当我们的含有复选框表格 选择发生变化时的回调
    handleSelectionChange(selection) {
      // selection 是该事件给我们注入的一个参数 这个参数是一个数组（用户选中的图片的数组，数组元素对象中缺少isDefault属性）
      this.imageList = selection
    },
    // 用排他思想设置 默认
    changeDeafult(row) {
      // console.log('点击了设置默认')
      this.spuImageList.forEach(item => {
        if (item === row) {
          item.isDefault = 1
          // 收集默认图片的地址
          this.skuInfo.skuDefaultImg = item.imgUrl
        } else {
          item.isDefault = 0
        }
      })
    },
    // 点击取消按钮
    cancel() {
      // 通知父组件切换场景
      this.$emit('changeScene', 0)
      // 清空数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击保存按钮的回调
    async save() {
      // 先整理参数，再发送请求
      const { attrInfoList, spuSaleAttrList, imageList } = this // 先整理平台属性数据
      // 这里使用了数组的reduce 方法，reduce归并方法，接受两个参数，第一个归并函数，第二个是初始值。
      // 注意第一个参数归并函数也有很多参数，第一个是上次调用这个函数的返回值，初始的时候是我们传入的reduce方法的第二个参数
      // reduce的第一个参数归并函数返回的值，会替换掉我们reduce方法的第二个参数。
      // 当reduce方法遍历的对象遍历结束后，reduce的第二个参数就是我们调用 数组的reduce方法返回的值.
      this.skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      // 整理销售属性
      this.skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      // 整理图片的参数
      this.skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 发送请求
      const result = await this.$API.spu.reqAddSku(this.skuInfo)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$emit('changeScene', 0)
      }
    }
  }
}
</script>

<style>

</style>
