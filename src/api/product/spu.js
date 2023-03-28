// spu  接口的模块
// 引入我们二次封装的axios
import request from '@/utils/request'

// 获取SPU 列表数据的接口
//  /admin/product/{page}/{limit} get 参数 page limit category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// 当我们点击修改SPU 按钮的时候，需要发送四个请求，请求SPU信息，请求SPU 对应品牌的列表数据,请求SPU 图标的信息，请求SPU对应的销售属性
// 获取SPU 信息 get /admin/product/getSpuById/{spuId} /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取SPU 对应品牌的列表数据
// /admin/product/baseTrademark/getTrademarkList get
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取SPU 图标的信息接口
// /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取SPU对应的销售属性，整个平台一共设置了三个销售属性 固定的
// get /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 修改或者是添加SPU 的接口  修改或者是添加SPU 的请求接口是一样的，携带的参数唯一的区别就是，修改携带了ID 而添加没有携带ID
// 地址 /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 如果携带ID 那么就是修改SPU请求
  if (spuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 删除SPU的接口 /admin/product/deleteSpu/{spuId}  请求方法delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取销售属性的数据接口
//  /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的的数据  /admin/product/attrInfoList/{category1Id}/{category2Id}/{categoty3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加SKU, 给已经有的SPU添加一个SKU 实例
// /admin/product/saveSkuInfo  post 请求
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取SKU 列表的数据 /admin/product/findBySpuId/{spuId} get请求
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
