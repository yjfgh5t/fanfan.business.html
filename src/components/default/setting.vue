<template>
  <div class="body">
    <mt-header title="设置"></mt-header>
    <p v-on:click="checkBlueTooth">{{ hello }}</p>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      hello: '检查蓝牙'
    }
  },
  methods: {
    checkBlueTooth: function () {
      Tools.blueTooth(true, function (data) {
        Toast(JSON.stringify(data))
      })
    }
  }
}
</script>
