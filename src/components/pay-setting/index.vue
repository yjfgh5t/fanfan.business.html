<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="收款设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height: 40px;"></div>
    <mt-cell title="线下收款" is-link>
      <span slot="icon"><i class="icon iconfont icon-inline" /></span>
      <mt-switch v-model="model.offline"  @change="changeState(1)">{{model.offline?'开启':'关闭'}}</mt-switch>
    </mt-cell>

    <mt-cell title="支付宝收款" is-link>
      <span slot="icon"><i class="icon iconfont icon-zhifubao" /></span>
      <mt-switch v-model="model.alipay"  @change="changeState(2)">{{model.alipay?'开启':'关闭'}}</mt-switch>
    </mt-cell>

    <mt-cell title="微信收款" is-link>
      <span slot="icon"><i class="icon iconfont icon-weixin" /></span>
      <mt-switch v-model="model.wechate"  @change="changeState(3)">{{model.wechate?'开启':'关闭'}}</mt-switch>
    </mt-cell>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      model: {id: -1, offline: true, alipay: false, wechate: false}
    }
  },
  mounted () {
    this.loadItem()
  },
  methods: {
    // 保存
    save: function (text, using) {
      let _this = this
      // 提交
      Tools.ajax('json', 'shop/shopPaySetting', {
        id: _this.model.id,
        offline: _this.model.offline,
        alipay: _this.model.alipay,
        wechate: _this.model.wechate
      }, function (res) {
        if (res.code === 0) {
          // 支付宝未授权
          if (res.data === -1) {
            _this.model.alipay = false
            MessageBox.confirm(res.msg, '系统提示', {
              confirmButtonText: '去设置'
            }).then(action => {
              if (action === 'confirm') {
                window.vueApp.$router.push({name: 'authorization'})
              }
            })
          } else {
            _this.model.id = res.data
            // 店铺名称保存至本地
            Tools.setKeyVal(Tools.globalKey.shopName, _this.model.name)
            Toast((using ? '开启' : '关闭') + text + '成功')
          }
        }
      })
    },
    // 加载数据
    loadItem: function () {
      let _this = this
      // 获取信息
      Tools.ajax('get', 'shop/' + _this.model.id, null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.model = {
            id: res.data.id,
            offline: res.data.offline,
            alipay: res.data.alipay,
            wechate: res.data.wechate
          }
        }
      })
    },
    changeState: function (type) {
      let submit = true
      if (!this.model.offline && !this.model.alipay && !this.model.wechate) {
        Toast('不可关闭所有收款方式')
        submit = false
      }
      switch (type) {
        case 1:
          if (submit) {
            this.save('线下收款', this.model.offline)
          } else {
            this.model.offline = !this.model.offline
          }
          break
        case 2:
          if (submit) {
            this.save('支付宝收款', this.model.alipay)
          } else {
            this.model.alipay = !this.model.alipay
          }
          break
        case 3:
          this.model.wechate = false
          Toast('微信收款真正开发中,敬请期待!')
          break
      }
    }
  }
}
</script>
<style>
  .mint-switch-core{
    width: 42px;
    height:25px;
  }
  .mint-switch-core::before{
    width: 40px;
    height:23px;
  }
  .mint-switch-core::after{
    width: 23px;
    height: 23px;
  }
  .mint-switch-input:checked + .mint-switch-core::after{
    transform: translateX(17px);
  }
</style>
<style type="text/css" scoped>

  .mint-cell-title .icon{
    position: relative;
    top: 0.16rem;
  }
</style>
