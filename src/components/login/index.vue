<template>
  <div class="back" v-bind:style="{background:'url('+backImg+')'}">
    <img :src="logo" class="logo" />
    <div class="login">
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="model.mobile"></mt-field>
      <br/>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="model.pwd"></mt-field>
      <br/>
      <mt-button type="primary" plain="true" size="large" style="color:white;border-color: white;" v-on:click="login">登陆</mt-button>
    </div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import backImg from '../../assets/imgs/img_back.jpg'
import logo from '../../assets/imgs/icon_logo.png'
import { Toast,MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      backImg: backImg,
      logo: logo,
      model: { mobile: '', pwd: '' }
    }
  },
  methods: {
    login: function () {
      let _this = this
      if (_this.model.mobile === '') {
        return Toast('请输入手机号')
      }
      if (_this.model.mobile === '' || _this.model.mobile.length !== 11 || isNaN(_this.model.mobile)) {
        return Toast('您输入的手机号格式不正确')
      }
      if (_this.model.pwd === '') {
        return Toast('请输入密码')
      }
      if (_this.model.pwd.length < 6) {
        return Toast('密码长度不能小于6个字符')
      }

      // 执行登陆
      Tools.ajax(Tools.method.post, 'user/customer/login', {mobile: _this.model.mobile, userPwd: _this.model.pwd}, function (res) {
        if (res.code === 0 && res.data !== undefined) {
          let userInfo = {
            userId: res.data.userId,
            userName: res.data.userId,
            mobile: res.data.mobile,
            picPath: res.data.picPath
          }
          // 保存至本地
          Tools.setKeyVal(Tools.globalKey.userInfo, JSON.stringify(userInfo), function (success) {
            Tools.globalParams(Tools.globalKey.userInfo, userInfo)
            // 绑定用户至信鸽推送
            Tools.bindUser(Tools.globalKey.userInfo.userId, function (bandState) {
              // 跳转
              _this.$router.push({name: 'default'})
            })
          })
        } else {
          Toast('用户名或密码错误')
        }
      })
    }
  }
}
</script>

<style type="text/css">
  .back{
    height: 100%;
    background-size: contain !important;
    text-align: center;
  }
  .logo{
    width:8rem;
    height: 8rem;
  }
  .login{
    width:80%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
