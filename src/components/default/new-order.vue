<template>
  <div class="body">
    <mt-header title="新订单"></mt-header>
    <order-list height="89" newOrder="true" ref="order"></order-list>
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
    // 当触发展示时
    onShow: function () {
      let that = this
      // 检查登录
      Tools.checkLogin(function (login) {
        if (login) {
          that.$refs.order.loadTop()
        }
      })
    }
  },
  created () {
    let _this = this
    // 注册通知
    Tools.localNotify('local_notify_new_order', function (model) {
      _this.$refs.order.updateLocalItemState(model)
    })
  }
}
</script>

<style lang="css" scoped>
  .body{
    height: 100%;
  }
</style>
