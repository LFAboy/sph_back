// 将“商品管理” 下的四个模块请求的接口统一暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'

// 对外暴露   我们可以把这些暴露的接口放在Vue原型上，这样在任意的组件中都可以使用
export default {
  trademark,
  attr,
  sku,
  spu
}
