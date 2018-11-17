<template>
  <div class="body">
    <mt-header slot="left" title="设置"></mt-header>
    <div class="div-user" >
      <div style="overflow: hidden;float:left;" v-on:click="$router.push({path: '/userSetting'});">
        <img :src="userInfo.icon" class="img-user"/>
        <div class="p-user">
          <p v-text="userInfo.mobile"></p>
          <p v-text="userInfo.name"></p>
        </div>
      </div>
      <div class="div-program" v-on:click="openProgram">
        <i class="icon iconfont icon-commodity"></i> 我的店铺
      </div>
    </div>

    <mt-cell title="店铺设置" is-link :to="{ path: '/shopSetting'}" >
      <i slot="icon" class="icon iconfont icon-commodity" />
    </mt-cell>

    <mt-cell title="商品设置" is-link :to="{ path: '/commoditySetting'}" >
      <i slot="icon" class="icon iconfont icon-shangpin" />
    </mt-cell>

    <br />
    <mt-cell title="商品分类设置" is-link :to="{ path: '/commodityTypeSetting'}">
      <i slot="icon" class="icon iconfont icon-commodity-type" />
    </mt-cell>

    <br />
    <mt-cell title="打印设置"  is-link :to="{ path: '/printSetting' }">
      <i slot="icon" class="icon iconfont icon-print" />
    </mt-cell>

    <br />
    <mt-cell title="客桌设置" is-link :to="{ path: '/deskSetting'}">
      <i slot="icon" class="icon iconfont icon-zhuozi" />
    </mt-cell>

    <br />
    <mt-cell title="支付宝认证" is-link :to="{ path: '/authorization'}">
      <i slot="icon" class="icon iconfont icon-shouquan" />
    </mt-cell>

    <div class="login-out">
      <mt-button size="large" style="height: 1.8rem;line-height: 1.8rem;font-size: 0.8rem;" type="danger" v-on:click="loginOut">退 出</mt-button>
    </div>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import userIcon from  '../../assets/imgs/icon_user.png'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    // 触发展示时
    onShow: function () {
      // 加载用户信息
      this.loadUser()
      // 检查状态
      Tools.checkShopState()
    },
    // 退出登录
    loginOut: function () {
      let _this = this
      Tools.getKeyVal(Tools.globalKey.userInfo, function (userInfo) {
        // 删除用户信息
        Tools.setKeyVal(Tools.globalKey.userInfo, '', function () {
          // 退出登录
          Tools.loginOut(userInfo.userId, function () {
            _this.$router.push({name: 'login'})
          })
        })
      })
    },
    // 打开小程序
    openProgram: function () {
      Tools.getKeyVal(Tools.globalKey.userInfo, function (userInfo) {
        Tools.openApp(Tools.global.openAliPayProgram + '&page=pages/home/home&query=' + encodeURIComponent('customerId=' + userInfo.userId))
      })
    },
    loadUser: function () {
      let _this = this
      Tools.getKeyVal(Tools.globalKey.userInfo, function (data) {
        _this.userInfo = {
          name: data.name,
          mobile: data.mobile,
          icon: (data.picPath === '' || data.picPath === undefined) ? userIcon : data.picPath
        }
      })
    }
  },
  mounted () {
    // 加载用户信息
    this.loadUser()
  }
}
</script>
<style lang="css" scoped="scoped">
  .login-out{
    width: 90%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 3rem;
  }
  .div-user{
    background: linear-gradient(#26a2ff 0,#00c7ff 100%);
    padding: 0 0.5rem 0.5rem 1rem;
    overflow: hidden;
  }
  .img-user{
    border-radius: 1.5rem;
    border: 0.1rem solid #fff;
    width: 3rem;
    height: 3rem;
    float: left;
  }
  .p-user{
    float:left;
    height: 3rem;
    padding: 0.6rem 0rem 0rem 0.6rem;
    color: white;
  }
  .p-user p{
    display: block;
    line-height: 1.0rem;
  }

  .div-program{
    float: right;
    margin-right: 1rem;
    color: white;
    border: 1px solid white;
    padding: 0.3rem;
    border-radius: 0.3rem;
    margin-top: 0.78rem;
  }

  .mint-cell-title .icon{
    position: relative;
    top: 0.1rem;
  }
</style>
