<template>
  <div class="body">
    <mt-header title="设置"></mt-header>

    <br />
    <mt-cell title="打印设置"  is-link :to="{ path: '/printSetting' }">
      <i slot="icon" class="icon iconfont icon-print" />
    </mt-cell>

    <br />
    <mt-cell title="商品设置" is-link :to="{ path: '/commoditySetting'}" >
      <i slot="icon" class="icon iconfont icon-commodity" />
    </mt-cell>

    <br />
    <mt-cell title="商品分类设置" is-link :to="{ path: '/commodityTypeSetting'}">
      <i slot="icon" class="icon iconfont icon-commodity-type" />
    </mt-cell>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      hello: '检查蓝牙1',
      close: '关闭蓝牙',
      blueTooths:[]
    }
  },
  methods: {
    checkBlueTooth: function () {

    },
    closeBlueTooth: function () {
      Tools.blueTooth(false, function (res) {
        Toast("蓝牙关闭")
      })
    }
  }
}
</script>
