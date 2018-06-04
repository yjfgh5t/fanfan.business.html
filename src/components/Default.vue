<template>
  <div>
    <div class="nav">
      <div  v-on:click="itemClick('container-msg')" class="menu-item" v-bind:class="{ active: active=='container-msg' }">
        <img v-if=" active=='container-msg' " src="@/assets/imgs/icon_msg_active.png" />
        <img v-if=" active!='container-msg' " src="@/assets/imgs/icon_msg.png" />
        <p>消息</p>
      </div>
      <div v-on:click="itemClick('container-order')" class="menu-item" v-bind:class="{ active: active=='container-order' }">
        <img v-if=" active=='container-order' " src="@/assets/imgs/icon_msg_active.png" />
        <img v-if=" active!='container-order' " src="@/assets/imgs/icon_msg.png" />
        <p>消息</p>
      </div>
      <div v-on:click="itemClick('container-me')" class="menu-item" v-bind:class="{ active: active=='container-me' }">
        <img v-if=" active=='container-me' " src="@/assets/imgs/icon_msg_active.png" />
        <img v-if=" active!='container-me' " src="@/assets/imgs/icon_msg.png" />
        <p>消息</p></div>
    </div>
    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active" swipeable>
        <!-- msg 内容 -->
        <mt-tab-container-item id="container-msg">
          <div>
            <router-link to="/orderDetail/:1232"> Detail </router-link>
          </div>
        </mt-tab-container-item>
        <!-- 订单 内容 -->
        <mt-tab-container-item id="container-order">
          <div>view2</div>
        </mt-tab-container-item>
        <!-- me 内容 -->
        <mt-tab-container-item id="container-me">
          <div>view3</div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import Tools from '../commons/tools'

export default {
  name: 'page-tab-container',
  data () {
    return {
      active: 'tab-container1'
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
      Tools.ajax('post', 'url/', 'dd')
    }
  }
}
</script>

<style lang="css" scoped>
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
  }
  .menu-item img{
    width:1.6rem;
    height: 1.6rem;
  }
  .menu-item p{
    font-size: 0.36rem;
    color: #cccccc;
  }

  .menu-item.active p{
    color:#1afa29;
  }

</style>
