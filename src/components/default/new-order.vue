<template>
  <div class="body">
    <mt-header title="新订单"></mt-header>
    <order-list height="89" ref="order"></order-list>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import OrderList from '@/components/default/list-order'
import { Toast, Loadmore } from 'mint-ui'
export default {
  name: 'new-order',
  components: {
    "order-list": OrderList
  },
  data () {
    return {}
  },
  methods: {
    loadTop: function () {
      let _this = this
      setTimeout(function () {
        _this.$refs.loadmore.onTopLoaded()
      }, 2000)
    }
  },
  created () {
  },
  activated () {
    // 刷新订单
    if (this.$route.query.refreshOrder) {
      this.$refs.order.loadTop()
    }
    Tools.global.newOrder = this
  }
}
</script>

<style lang="css" scoped>
  .body{
    height: 100%;
  }
</style>
