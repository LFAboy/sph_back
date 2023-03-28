// 这个模块是获取品牌管理数据的模块
import request from '@/utils/request'

// 获取“商品管理”-》“品牌管理” 下的品牌列表接口
// 地址 /admin/product/baseTrademark/{page}/{limit} get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加或这更新品牌的接口
// 新增品牌 POST /admin/product/baseTrademark/save  需要带 品牌的名称和品牌的LOGO
// 修改品牌 /admin/product/baseTrademark/update put 请求 三个参数 品牌名称 品牌LOGO 品牌ID
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 通过 参数中是否有 ID 我们判断是什么请求，然后发送不同的请求
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    // console.log(tradeMark, 'api')
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

// 删除品牌的接口 delete 请求 地址 /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
