<template>
  <div>
     详情-{{ orderId }} {{ orderModel.orderNum }}
  </div>
</template>

<script>
import Tools from '../commons/tools'
import { Toast } from 'mint-ui';

export default {
  name: 'page-tab-container',
  data () {
    return {
      orderId: this.$route.params.orderId,
      orderModel: {orderNum:0}
    }
  },
  created () {
    let _this = this;
    Tools.ajax('get', 'order/' + this.orderId, {}, (res) => {
      Toast({message:res.data.orderNum, duration: 5000})
      if (res.code==0) {
        _this.orderModel.orderNum = res.data.orderNum
      }
    })
  }
}
</script>

<style lang="css" scoped>
  .item {
    display: inline-block;
  }

  .nav {
    padding: 10px;
  }

  .link {
    color: inherit;
    padding: 20px;
    display: block;
  }
</style>
