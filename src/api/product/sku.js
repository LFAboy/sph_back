// 我们的 SKU 模块
import request from '@/utils/request' // 引入我们二次封装的axios

// sku 列表的接口  /admin/product/list/{page}/{limit} get 请求
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架的请求 /admin/product/onSale/{skuId} get请求
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 下架的请求 /admin/product/cancelSale/{skuId} get 请求
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取SKU 详情的接口 /admin/product/getSkuById/{skuId}  get请求
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
