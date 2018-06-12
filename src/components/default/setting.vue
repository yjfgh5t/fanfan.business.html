<template>
  <div class="body">
    <mt-header title="设置"></mt-header>
    <p v-on:click="checkBlueTooth">{{ hello }}</p>
    <p v-on:click="closeBlueTooth">{{ close }}</p>
    <p v-for="item in blueTooths">{{ (item.name?item.name:item.address) }}</p>
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
      let _this = this
      Tools.blueTooth(true, function (res) {
        if (res.data.event) {
          Toast("蓝牙状态 "+res.data.event)
        } else {
          _this.blueTooths.push({address: res.data.address, name: res.data.name})
        }
      })
    },
    closeBlueTooth: function () {
      Tools.blueTooth(false, function (res) {
        Toast("蓝牙关闭")
      })
    }
  }
}
</script>
