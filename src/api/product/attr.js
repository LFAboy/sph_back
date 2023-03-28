// 平台属性管理 模块的请求 接口文件
import request from '@/utils/request'

// 获取三级联动一级分类的数据 get /admin/product/getCategory1
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

// 获取三级联动二级分类的接口 get /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级联动二级分类的接口 get /admin/product/getCategory3/{category12Id}
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 展示我们三级联动选择后的对应数据 获取平台属性的接口 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加属性与属性值的接口 /admin/product/saveAttrInfo post
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
/*
  这个接口需要携带的参数
  {
    "attrName": "",  属性名
    "attrValueList": [
        {
            'attrId': 0,    属性值的ID
            "valueName": "string" 属性值
        }
    ],
    "categoryId": 0,    属性名的ID
    "categoryLevel": 3   本次请求的级别都是3
  }
*/
