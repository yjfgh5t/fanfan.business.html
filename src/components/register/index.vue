<template>
  <div class="back" v-bind:style="{background:'url('+backImg+')'}">
    <mt-header :title="title">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回登录</mt-button>
      </router-link>
    </mt-header>
    <layer title="图形验证码" :show="showImgCodeLayer" :complete="bindImgCodeLayer" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content">
        <mt-field label="验证码" placeholder="请输入验证码"  :attr="{ maxLength: 4, minLength: 4 }" v-model="codeModel.code">
          <img width="80" v-on:click="refreshCodeImg" id="img-code" :src="codeModel.imgCodeSrc" />
        </mt-field>
      </div>
    </layer>
    <div class="login">
      <mt-field label="商户姓名" v-if="visitType===1" placeholder="请输入商户姓名"  :attr="{ maxLength: 16, minLength: 2 }" type="text" v-model="model.name"></mt-field>
      <br/>
      <mt-field label="手机号" placeholder="请输入手机号"  :attr="{ maxLength: 11, minLength: 11 }" type="tel" v-model="model.mobile"></mt-field>
      <br/>
      <mt-field label="验证码" placeholder="请输入手机验证码"  :attr="{ maxLength: 4, minLength: 4 }" v-model="model.mobileCode">
        <mt-button size="small" v-text="codeModel.text" :disabled="codeModel.disabled" v-on:click="bindMobileCode"></mt-button>
      </mt-field>
      <br/>
      <mt-field label="密码"  v-if="visitType===1" placeholder="请输入密码6-18位"  :attr="{ maxLength: 18, minLength: 6 }" type="password" v-model="model.pwd"></mt-field>
      <br/>
      <mt-field label="确认密码"  v-if="visitType===1" placeholder="请输入确认密码6-18位" type="password" :attr="{ maxLength: 18, minLength: 6 }" v-model="model.confirmPwd"></mt-field>
      <br/>
      <br/>
      <mt-button type="primary"  v-if="visitType===1" plain="true" size="large" style="color:white;border-color: white;" v-on:click="register">注 册</mt-button>
      <mt-button type="primary"  v-if="visitType===2" plain="true" size="large" style="color:white;border-color: white;" v-on:click="login">登 录</mt-button>
    </div>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import backImg from '../../assets/imgs/img_back.png'
import logo from '../../assets/imgs/icon_logo.png'
import Layer from '@/tools/layer'
import { Toast,MessageBox } from 'mint-ui'
export default {
  components: {
    "layer": Layer
  },
  data () {
    return {
      title: '商户注册',
      visitType: 1,
      backImg: backImg,
      logo: logo,
      codeModel: {text: '发送验证码', disabled: false, showImgCode: false, code: '', imgCodeSrc: ''},
      showImgCodeLayer: false,
      model: {mobile: '', pwd: '', confirmPwd: '', name: '', mobileCode: ''}
    }
  },
  mounted () {
    let type = this.$route.params.type
    if (type === 'code') {
      this.title = '验证码登录'
      this.visitType = 2
    }
  },
  methods: {
    // 绑定发送二维码
    bindMobileCode: function () {
      if (this.model.mobile.length !== 11) {
        return Toast('请输入有效的手机号')
      }
      const _that = this
      // 显示图片二维码
      if (_that.codeModel.showImgCode) {
        _that.showImgCodeLayer = true
        // 刷新图片二维码
        this.refreshCodeImg()
      } else {
        _that.sendMobileCode()
        // 设置下次发送需显输入图片验证码
        _that.codeModel.showImgCode = true
      }
    },
    // 绑定弹出层事件
    bindImgCodeLayer: function (confirm) {
      if (confirm) {
        if (this.codeModel.code === '') {
          return Toast('请输入图形验证码')
        }
        // 发送验证码
        this.sendMobileCode()
      } else {
        this.showImgCodeLayer = false
      }
    },
    // 发送短信验证码
    sendMobileCode: function () {
      let _that = this
      let params = {
        mobile: this.model.mobile,
        imgCode: this.codeModel.code
      }
      _that.codeModel.disabled = true
      Tools.ajax(Tools.method.post, 'user/sendCode', params, function (res) {
        if (res.code === 0) {
          Toast('验证码已发送请注意查收')
          _that.showImgCodeLayer = false
          // 设置计数器
          let start = 60
          let interval = window.setInterval(function () {
            if (--start === 0) {
              window.clearInterval(interval)
              // 设置验证码
              _that.codeModel.text = '发送验证码'
              _that.codeModel.disabled = false
            } else {
              _that.codeModel.text = start + 's'
            }
          }, 1000)
        } else {
          // 发送失败
          _that.showImgCodeLayer = true
          _that.codeModel.disabled = true
          _that.refreshCodeImg()
        }
      })
    },
    // 刷新图片验证码
    refreshCodeImg: function () {
      this.codeModel.imgCodeSrc = Tools.global.httpPath + 'info/imgcode/' + this.model.mobile + '?v=' + parseInt(Math.random() * 100)
    },
    register: function () {
      let _this = this
      if (_this.model.name === '') {
        return Toast('请输入商户姓名')
      }
      if (_this.model.mobile === '') {
        return Toast('请输入手机号')
      }
      if (_this.model.mobile === '' || _this.model.mobile.length !== 11 || isNaN(_this.model.mobile)) {
        return Toast('您输入的手机号格式不正确')
      }
      if (_this.model.mobileCode === '') {
        return Toast('请输入手机验证码')
      }
      if (_this.model.pwd === '') {
        return Toast('请输入密码')
      }
      if (_this.model.pwd.length < 6) {
        return Toast('密码长度不能小于6个字符')
      }
      if (_this.model.confirmPwd === '') {
        return Toast('请输入确认密码')
      }
      if (_this.model.confirmPwd.length < 6) {
        return Toast('确认密码长度不能小于6个字符')
      }
      if (_this.model.pwd !== _this.model.confirmPwd) {
        return Toast('密码和确认密码不匹配')
      }

      let subData = {
        code: _this.model.mobileCode,
        userId: 0,
        name: _this.model.name,
        mobile: _this.model.mobile,
        password: _this.model.pwd
      }
      // 执行注册
      Tools.ajax(Tools.method.json, 'user/customer/register', subData, function (res) {
        if (res.code === 0 && res.data !== '') {
          MessageBox.alert('商户注册成功').then(function () {
            // 跳转
            _this.$router.push({name: 'login'})
          })
        }
      })
    },
    login: function () {
      let _this = this
      if (_this.model.mobile === '') {
        return Toast('请输入手机号')
      }
      if (_this.model.mobile === '' || _this.model.mobile.length !== 11 || isNaN(_this.model.mobile)) {
        return Toast('您输入的手机号格式不正确')
      }
      if (_this.model.mobileCode === '') {
        return Toast('请输入手机验证码')
      }
      let subData = {
        code: _this.model.mobileCode,
        mobile: _this.model.mobile
      }
      // 执行登入
      Tools.ajax(Tools.method.post, 'user/customer/codeLogin', subData, function (res) {
        if (res.code === 0 && res.data !== '') {
          let userInfo = {
            userId: res.data.userInfo.userId,
            name: res.data.userInfo.name,
            mobile: res.data.userInfo.mobile,
            picPath: res.data.userInfo.picPath,
            code: res.data.userInfo.code
          }
          // 保存Token
          Tools.setKeyVal(Tools.globalKey.authTokenKey, res.data.token)
          // 保存CustomerId
          Tools.setKeyVal(Tools.globalKey.customerId, userInfo.userId)
          // 店铺名称保存至本地
          Tools.setKeyVal(Tools.globalKey.shopName, res.data.userInfo.shopName)
          // 保存至本地
          Tools.setKeyVal(Tools.globalKey.userInfo, JSON.stringify(userInfo), function (success) {
            // 绑定用户至信鸽推送
            Tools.bindUser(userInfo.userId)
            // 跳转
            _this.$router.push({name: 'default'})
          })
        }
      })
    }
  }
}
</script>

<style type="text/css">
  .back{
    height: 100%;
    width:100%;
    background-repeat: no-repeat;
    background-size:100%  !important;
    text-align: center;
  }
  .login{
    padding-top: 1rem;
    width:80%;
    margin-left: auto;
    margin-right: auto;
  }
  .login .mint-field{
    background-color: rgba(0,0,0,0.1);
  }
  .login .mint-cell-text{
    color: white;
  }
  .login input{
    background: none;
    color: white;
  }
  .login .mint-cell-wrapper{
    background: none;
  }
  .div-register{
    color: white;
    overflow: hidden;
    margin-top: 0.4rem;
    padding:0 0.6rem;
  }
  .div-register .span-reg{
    float: left;
  }
  .div-register .span-pwd{
    float:right;
  }
</style>
