<template>
  <div class="main">
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
    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active">

        <!-- msg 内容 -->
        <mt-tab-container-item id="container-msg">
            <mt-header title="新订单"></mt-header>
            <mt-loadmore :top-method="loadTop" ref="loadmore">
              <ul>
                <li v-for="item in msgArray"><router-link to="/orderDetail/62"> {{ item.orderNum }} </router-link></li>
              </ul>
            </mt-loadmore>
        </mt-tab-container-item>

        <!-- 订单 内容 -->
        <mt-tab-container-item id="container-order">
          <mt-header title="查询订单"></mt-header>
        </mt-tab-container-item>

        <!-- me 内容 -->
        <mt-tab-container-item id="container-me">
          <mt-header title="设置"></mt-header>
        </mt-tab-container-item>

      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import Tools from '../commons/tools'
import { Toast, Loadmore } from 'mint-ui'
import '../assets/font/iconfont.css'
export default {
  name: 'page-tab-container',
  data () {
    return {
      active: 'container-msg',
      // 消息列表
      msgArray: [{orderNum: '001'}, {orderNum: '002'}, {orderNum: '003'}]
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
    },
    loadTop: function () {
      let _this = this;
      setTimeout(function () {
        _this.$refs.loadmore.onTopLoaded();
      },2000)
    },
    // 刷新消息
    refreshMsg: () => {
      Tools.ajax('post', 'info/msg', {}, (res) => {
        if (res.code==0) {
          for (let item in res.data.length) {
            this.msgArray.push(item)
          }
        }
      })
    }
  },
  created () {
    if (this.msgArray.length== 0) {
      this.refreshMsg()
    }
  }
}
</script>

<style lang="css" scoped>
  .main,.page-tab-container,.mint-tab-container,.mint-tab-container-wrap,.mint-tab-container-item,.mint-loadmore{
    height: 100%;
  }

  .nav{
    position: fixed;
    z-index: 8;
    bottom:0rem;
    width:100%;
    border-top:0.1rem solid #cccccc ;
    padding:0.3rem 0;
  }
  .menu-item{
    padding:0px;
    margin:0px;
    width:33.3333%;
    float: left;
    text-align: center;
  }
  .menu-item .icon{
    font-size: 1.6rem;
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
