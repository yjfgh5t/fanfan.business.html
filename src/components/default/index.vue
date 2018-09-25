<template>
  <div class="main">
    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active">
        <!-- msg 内容 -->
        <mt-tab-container-item id="container-msg">
          <new-order></new-order>
        </mt-tab-container-item>

        <!-- 订单 内容 -->
        <mt-tab-container-item id="container-order">
          <search-order></search-order>
        </mt-tab-container-item>

        <!-- me 内容 -->
        <mt-tab-container-item id="container-me">
          <setting></setting>
        </mt-tab-container-item>

      </mt-tab-container>
    </div>
    <div class="nav">
      <div  v-on:click="itemClick('container-msg')" class="menu-item" v-bind:class="{ active: active=='container-msg' }">
        <i class="icon iconfont icon-order"></i>
        <p>新订单</p>
      </div>
      <div v-on:click="itemClick('container-order')" class="menu-item" v-bind:class="{ active: active=='container-order' }">
        <i class="icon iconfont icon-search-order"></i>
        <p>查询订单</p>
      </div>
      <div v-on:click="itemClick('container-me')" class="menu-item" v-bind:class="{ active: active=='container-me' }">
        <i class="icon iconfont icon-shezhi"></i>
        <p>设置</p></div>
    </div>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast, Loadmore } from 'mint-ui'
import NewOrder from '@/components/default/new-order'
import SearchOrder from '@/components/default/search-order'
import Setting from '@/components/default/setting'
import '../../assets/font/iconfont.css'

export default {
  name: 'page-tab-container',
  components: {
    'new-order': NewOrder,
    'search-order': SearchOrder,
    'setting': Setting
  },
  data () {
    return {
      active: 'container-msg'
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
    }
  },
  activated () {
    if (this.$route.query.active) {
      this.active = this.$route.query.active
      this.$route.query.active = undefined
    }
  }
}
</script>

<style lang="css" scoped>
  .main,.page-tab-container,.mint-tab-container,.mint-tab-container-wrap,.mint-tab-container-item,.mint-loadmore{
    height: 100%;
  }

  .main{
    background-color:#eeeeee;
    font-size: 0.5rem;
    color: #333333;
  }
  .nav{
    position: fixed;
    z-index: 8;
    bottom:0rem;
    width:100%;
    border-top:1px solid #eee;
    background-color: white;
    height: 48px;
  }
  .menu-item{
    padding:0px;
    margin:0px;
    width:33.3333%;
    float: left;
    text-align: center;
    margin-top: 4px;
  }
  .menu-item .icon{
    font-size: 1.2rem;
    color: #5e5e5e;
  }
  .menu-item p{
    font-size: 0.6rem;
    color: #5e5e5e;
  }

  .menu-item.active p, .menu-item.active .icon{
    color:#1afa29;
  }

</style>
