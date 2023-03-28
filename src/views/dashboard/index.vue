<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入子组件 Card
import Card from './Card'
// 引入子组件 Sale
import Sale from './Sale'
// 引入 底部的大组件
import Observe from './Observe'

export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>
