<template>
  <div>
     详情-{{ orderId }} {{ this.$route.params.orderId }}
  </div>
</template>

<script>
import Tools from '../commons/tools'

export default {
  name: 'page-tab-container',
  data () {
    return {
      orderId: ''
    }
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
