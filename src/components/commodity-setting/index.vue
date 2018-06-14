<template>
  <div class="body" style="height: 100%">
    <mt-header title="商品设置">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>

    <!--类别栏 -->
    <div></div>

    <!--商品栏 -->
    <div></div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      blueTooths: [],
      redioOptions: [],
      redioVal: null,
      isSearch: true,
      showBlueTooths: false
    }
  },
  methods: {

  }
}
</script>
