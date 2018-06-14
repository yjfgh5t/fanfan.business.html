<template>
  <div class="body" style="height: 100%">
    <mt-header title="商品分类设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)" >返回</mt-button>
      </router-link>
    </mt-header>
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
