<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="支付宝授权认证">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height: 40px;"></div>

    <!--授权弹框-->
    <layer title="支付宝扫码授权" :show="showAuthorizeLayer" :complete="bindAuthorizeLayer" tempStyle="width:16rem;margin-left:-8rem;" confirmText="打开支付宝">
      <div slot="content">
        <img :src="authorizeImgUrl" class="lay-img" />
      </div>
    </layer>
    <mt-cell title="授权状态">
      <span  v-bind:class="model.authorizeState == 2?  'span-authorize':''">
        <span v-if="model.authorizeState==1">未授权</span>
        <span v-if="model.authorizeState==2">已授权</span>
        <i v-bind:class="model.authorizeState == 2 ?  'icon iconfont icon-chenggong':'icon iconfont icon-weirenzheng'"></i> </span>
   </mt-cell>
    <mt-cell title="认证状态">
      <span   v-bind:class="model.identificationState == 4 ?  'span-authorize':''">
        <span v-if="model.identificationState==1">未认证</span>
        <span v-if="model.identificationState==2">认证中</span>
        <span v-if="model.identificationState==3">认证失败</span>
        <span v-if="model.identificationState==4">已认证</span>
        <i  v-bind:class="model.identificationState == 4 ?  'icon iconfont icon-chenggong':'icon iconfont icon-weirenzheng'" ></i> </span>
    </mt-cell>
    <mt-field label="收款账号"  placeholder="请输入支付宝收款账号"  :attr="{ maxLength: 16, minLength: 2 }" type="text" v-model="model.name"></mt-field>

    <div class="cell-title">营业执照</div>
    <div class="div-img">
      <div class="div-icon">
        <i class="icon iconfont icon-upload"></i>
        <br />
        <span>点击上传</span>
      </div>
      <img class="img-business" src="" />
    </div>
    <div class="cell-title">身份证正面照</div>
    <div class="div-img">
      <div class="div-icon">
        <i class="icon iconfont icon-upload"></i>
        <br />
        <span>点击上传</span>
      </div>
      <img class="img-business" src="" />
    </div>
    <br />
    <div class="cell-title" style="text-align: center; padding: 1rem 2rem;">
    <mt-button type="primary" size="large">提交认证</mt-button>
    </div>
    <!-- 选择相册或拍照-->
    <mt-actionsheet :actions="imgActions" v-model="imgActionsVisible"></mt-actionsheet>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import Layer from '@/tools/layer'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
import MtField from '../../../node_modules/mint-ui/packages/field/src/field.vue'
export default {
  components: {
    "layer": Layer,
    MtField,
    MtButton
  },
  data () {
    return {
      model: {
        id: -1,
        // 1:未授权 2:已授权
        authorizeState: 1,
        // 1:未认证 2:认证中 3:认证失败 4:已认证
        identificationState: 1
      },
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      imgActionsVisible: false,
      authorizeUrl: '',
      authorizeImgUrl: '',
      showAuthorizeLayer: false
    }
  },
  mounted () {
    this.loadItem()
  },
  methods: {
    // 保存
    save: function () {
      let errorText = this.validate()
      if (errorText !== '') {
        return Toast(errorText)
      }
      let _this = this
      // 提交
      Tools.ajax('json', 'shop/', {
        id: _this.itemModel.id,
        name: _this.itemModel.name,
        businessStart: _this.itemModel.businessStart,
        businessEnd: _this.itemModel.businessEnd,
        minOrderPrice: _this.itemModel.minOrderPrice,
        address: _this.itemModel.address,
        logo: _this.itemModel.logo,
        state: _this.itemModel.state ? 1 : 2
      }, function (res) {
        if (res.code === 0) {
          _this.itemModel.id = res.data
          // 店铺名称保存至本地
          Tools.setKeyVal(Tools.globalKey.shopName, _this.itemModel.name)
          Toast('保存成功')
        }
      })
    },
    // 打开相册
    openAlbum: function () {
      this.choiceImg(2)
    },
    // 拍照
    takePhoto: function () {
      this.choiceImg(1)
    },
    // 图片操作
    choiceImg: function (type) {
      let _this = this
      Tools.choiceImg({openType: type, hasCutImage: 1, hasWatermark: 2}, function (res) {
        if (res.code === 0) {
          _this.itemModel.logo = res.data
          document.getElementById('img_logo').setAttribute('src', res.data)
          _this.modifyImg(_this)
        }
      })
    },
    // 修改图片
    modifyImg: function (_this) {
      if (_this.itemModel.id === -1) {
        return
      }
      Tools.ajax('json', 'shop/', {
        id: _this.itemModel.id,
        icon: _this.itemModel.icon
      }, function (res) {
        if (res.code !== 0) {
          Toast('保存图片失败')
        }
      })
    },
    // 加载数据
    loadItem: function () {
      let _this = this
      // 获取认证信息
      Tools.ajax('get', 'authorize/url', null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.authorizeUrl = res.data
          _this.authorizeImgUrl = Tools.global.httpPath + 'info/qrCodeImg?width=287&context=' + encodeURIComponent(res.data)
        }
      })

      // 获取认证信息
      Tools.ajax('get', 'authorize/', null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.authorizeUrl = res.data
          _this.authorizeImgUrl = Tools.global.httpPath + 'info/qrCodeImg?width=287&context=' + encodeURIComponent(res.data)
        }
      })
    },
    // 授权确定事件
    bindAuthorizeLayer: function (confirm) {
      if (confirm) {
        Tools.openApp('alipays://taobao.com', function (res) {
          Toast('返回' + res)
        })
      } else {
        this.showAuthorizeLayer = false
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

  .cell-select{
    background-color: white;
    margin-right: 1rem;
  }

  .cell-title{
    background: #eee;padding: 10px  10px 0px 10px;color:#aaa;
  }

  .img{
    width: 4rem;
    height: 4rem;
    display: block;
    float: left;
    border-radius: 0.4rem;
  }

  .span-authorize{
    color: forestgreen;
  }

  .lay-img{
    width: 15rem;
    height: 15rem;
    display: block;
    border-radius: 0.4rem;
  }

  .div-img{
    width:100%;
    min-height: 6rem;
  }

  .div-icon{
    color: #cccccc;
    width: 6rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    margin-top: 4rem;
  }
  .div-icon i,.div-icon span{
    display: inline-block;
  }
</style>
