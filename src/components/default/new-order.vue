<template>
  <div class="body">
    <mt-header title="新订单"></mt-header>
    <order-list height="89"></order-list>
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
    return {
      // 消息列表
      msgArray: [{orderNum: '001'}, {orderNum: '002'}, {orderNum: '003'}]
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
    },
    loadTop: function () {
      let _this = this
      setTimeout(function () {
        _this.$refs.loadmore.onTopLoaded()
      }, 2000)
    },
    // 刷新消息
    refreshMsg: () => {
      console.log(12321)
      Tools.ajax('post', 'info/msg', {}, (res) => {
        if (res.code == 0) {
          for (let item in res.data.length) {
            this.msgArray.push(item)
          }
        }
      })
    }
  },
  created () {
    if (this.msgArray.length == 0) {
      this.refreshMsg()
    }
  }
}
</script>

<style lang="css" scoped>
  .body{
    height: 100%;
  }
</style>
