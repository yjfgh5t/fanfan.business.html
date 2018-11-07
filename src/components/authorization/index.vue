<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="支付宝授权认证">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height: 40px;"></div>

    <!--授权弹框-->
    <layer :title="authorizeLayerType===1?'支付宝扫码授权':'支付宝扫码认证确认'" :show="showAuthorizeLayer" :complete="bindAuthorizeLayer" tempStyle="width:16rem;margin-left:-8rem;" confirmText="打开支付宝">
      <div slot="content">
        <img :src="authorizeImgUrl" class="lay-img" />
      </div>
    </layer>

    <mt-cell title="授权状态">
      <span v-on:click="bindShowAuthorize"  v-bind:class="model.authorizeState == 1?  'span-authorize':''">
        <span v-if="model.authorizeState==0">未授权</span>
        <span v-if="model.authorizeState==1">已授权</span>
        <i v-bind:class="model.authorizeState == 1 ?  'icon iconfont icon-chenggong':'icon iconfont icon-weirenzheng'"></i> </span>
   </mt-cell>
    <mt-cell title="认证状态">
      <span   v-bind:class="model.identificationState == 4 ?  'span-authorize':''">
        <span v-if="model.identificationState==0">未认证</span>
        <span v-if="model.identificationState==1">认证中</span>
        <span v-if="model.identificationState==2">认证失败</span>
        <span v-if="model.identificationState==3">认证通过待确认</span>
        <span v-if="model.identificationState==4">已认证</span>
        <i  v-bind:class="model.identificationState == 4 ?  'icon iconfont icon-chenggong':'icon iconfont icon-weirenzheng'" ></i> </span>
    </mt-cell>
    <!--如果用户授权的账号已经签约 则不需要提交相关信息-->
    <div v-if="!(model.identificationState==4 && model.payeeId=='')">
      <mt-field label="收款账号"  placeholder="请输入支付宝账号"  :attr="{ maxLength: 36, minLength: 2 }" type="text" v-model="model.payeeId"></mt-field>
      <mt-field label="收款人姓名"  placeholder="请输入支付宝姓名"  :attr="{ maxLength: 16, minLength: 2 }" type="text" v-model="model.payeeName"></mt-field>
      <mt-field label="营业执照有效期" placeholder="请输入到期时间" readonly type="text" @click.native.capture="showDatePicker" v-model="model.businessLicenseDate"></mt-field>
      <div class="cell-title">营业执照</div>
      <div class="div-img" v-on:click="bindClickImg(1)">
        <div class="div-icon"  v-if="model.businessLicensePhoto.length===0">
          <i class="icon iconfont icon-upload"></i>
          <br />
          <span>点击上传</span>
        </div>
        <img class="img-photo"  v-if="model.businessLicensePhoto.length>0" :src="model.businessLicensePhoto" />
      </div>

      <div class="cell-title">营业执照主体身份证正面照</div>
      <div class="div-img" v-on:click="bindClickImg(2)">
        <div class="div-icon"  v-if="model.idCardPhoto.length===0">
          <i class="icon iconfont icon-upload"></i>
          <br />
          <span>点击上传</span>
        </div>
        <img class="img-photo" v-if="model.idCardPhoto.length>0" :src="model.idCardPhoto" />
      </div>

      <div class="cell-title">店铺门头照</div>
      <div class="div-img" v-on:click="bindClickImg(3)">
        <div class="div-icon"  v-if="model.shopPhoto.length===0">
          <i class="icon iconfont icon-upload"></i>
          <br />
          <span>点击上传</span>
        </div>
        <img class="img-photo" v-if="model.shopPhoto.length>0" :src="model.shopPhoto" />
      </div>
      <br />
      <div class="cell-title" style="text-align: center; padding: 1rem 2rem;">
      <mt-button type="primary" :disabled="!canEdit" v-on:click="save" class="btn-large" size="large">提交认证</mt-button>
      </div>
    </div>
    <!-- 选择相册或拍照-->
    <mt-actionsheet :actions="imgActions" v-model="imgActionsVisible"></mt-actionsheet>

    <!-- 日期控件-->
    <mt-datetime-picker
      ref="picker"
      type="date"
      v-model="dateVal"
      @confirm="choicePicker"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast,MessageBox } from 'mint-ui'
import Layer from '@/tools/layer'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
import MtField from '../../../node_modules/mint-ui/packages/field/src/field.vue'
import moment from 'moment'
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
        authorizeState: 0,
        // 0:未认证 1:认证中 2:认证失败 3:认证通过待确认 4:已认证
        identificationState: 0,
        // 收款账号
        payeeId: '',
        // 收款姓名
        payeeName: '',
        // 营业执照
        businessLicensePhoto: '',
        // 营业执照有效期
        businessLicenseDate: '',
        // 身份证照
        idCardPhoto: '',
        // 店铺照
        shopPhoto: '',
        // 审核失败原因
        failRemark: '',
        // 支付宝签约成功后地址
        identificationUrl: '',
        // 授权地址
        authorizeUrl: ''
      },
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      imgActionsVisible: false,
      authorizeImgUrl: '',
      authorizeLayerType: 1,
      showAuthorizeLayer: false,
      // 上传图片类型 1: 营业执照 2:身份证照 3:店铺门头照
      optionImgType: -1,
      dateVal: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    canEdit: function () {
      return this.model.identificationState === 0 || this.model.identificationState === 2
    }
  },
  mounted () {
    let _that = this

    // 注册授权成功事件
    Tools.localNotify(Tools.globalKey.authorizeKey, function (data) {
      _that.showAuthorizeLayer = false
      _that.loadState()
    })

    // 加载数据
    this.loadItem()
  },
  activated () {
    // 查询状态
    if (this.showAuthorizeLayer) {
      this.loadState()
    }
  },
  methods: {
    // 显示授权
    bindShowAuthorize: function () {
      if (this.canEdit) {
        this.authorizeLayerType = 1
        this.showAuthorizeLayer = true
      }
    },
    // 验证
    validate: function () {
      if (this.model.authorizeState === 0) {
        return '请先通过支付宝授权'
      }
      if (this.model.payeeId === '') {
        return '请输入支付宝收款账号'
      }
      if (this.model.payeeName === '') {
        return '请输入支付宝收款人姓名'
      }
      if (this.model.businessLicenseDate === '') {
        return '请输入营业执照有效期'
      }
      if (this.model.businessLicensePhoto === '') {
        return '请上传营业执照'
      }
      if (this.model.idCardPhoto === '') {
        return '请上传营业执照主体人身份证照'
      }
      if (this.model.shopPhoto === '') {
        return '请上店铺门头照'
      }

      return ''
    },
    // 保存
    save: function () {
      let errorText = this.validate()
      if (errorText !== '') {
        return Toast(errorText)
      }
      let model = {
        id: this.model.id,
        // 0:未认证 1:认证中 2:认证失败 3:认证通过待确认 4:已认证
        identificationState: 1,
        // 收款账号
        payeeId: this.model.payeeId,
        // 收款姓名
        payeeName: this.model.payeeName,
        // 营业执照有效期
        businessLicenseDate: this.model.businessLicenseDate
      }
      let _that = this
      // 提交
      Tools.ajax('json', 'authorize/', model, function (res) {
        if (res.code === 0) {
          _that.identificationState = 1
          Toast('已提交认证，请等待审核')
        }
      })
    },
    // 上传图片点击
    bindClickImg: function (type) {
      if (this.canEdit) {
        this.optionImgType = type
        this.imgActionsVisible = true
      }
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
      Tools.choiceImg({openType: type, hasCutImage: 2, hasWatermark: 1, watermark: '仅限于支付宝签约'}, function (res) {
        if (res.code === 0) {
          let key = ''
          switch (_this.optionImgType) {
            case 1: key = 'businessLicensePhoto'; break
            case 2: key = 'idCardPhoto'; break
            case 3: key = 'shopPhoto'; break
          }
          _this.model[key] = res.data
          _this.modifyImg(_this, key, res.data)
        }
      })
    },
    // 修改图片
    modifyImg: function (_this, imgKey, imgSrc) {
      if (_this.model.id === -1) {
        return
      }
      let model = {id: _this.model.id}
      model[imgKey] = imgSrc
      Tools.ajax('json', 'authorize/', model, function (res) {
        if (res.code !== 0) {
          Toast('保存图片失败')
        }
      })
    },
    // 加载数据
    loadItem: function () {
      let _this = this
      // 获取认证信息
      Tools.ajax('get', 'authorize/', null, function (res) {
        if (res.code === 0 && res.data !== null) {
          let model = {
            id: res.data.id,
            // 0:未授权 1:已授权
            authorizeState: res.data.authorizeState,
            // 0:未认证 1:认证中 2:认证失败 3:认证通过待确认 4:已认证
            identificationState: res.data.identificationState,
            // 收款账号
            payeeId: res.data.payeeId,
            // 收款姓名
            payeeName: res.data.payeeName,
            // 营业执照
            businessLicensePhoto: res.data.businessLicensePhoto,
            // 营业执照有效期
            businessLicenseDate: res.data.businessLicenseDate,
            // 身份证照
            idCardPhoto: res.data.idCardPhoto,
            // 店铺照
            shopPhoto: res.data.shopPhoto,
            // 审核失败原因
            failRemark: res.data.failRemark,
            // 支付宝签约成功后地址
            identificationUrl: res.data.identificationUrl,
            // 授权地址
            authorizeUrl: res.data.authorizeUrl
          }
          _this.model = model
          _this.showAuthorizeLayer = false
          // 显示授权二维码
          if (model.authorizeState === 0) {
            _this.authorizeImgUrl = Tools.global.httpPath + 'info/qrCodeImg?width=287&context=' + encodeURIComponent(model.authorizeUrl) + '&v=' + Math.random()
            _this.showAuthorizeLayer = true
            _this.authorizeLayerType = 1
          }
          // 显示认证二维码
          if (model.identificationState === 3) {
            _this.authorizeImgUrl = Tools.global.httpPath + 'info/qrCodeImg?width=287&context=' + encodeURIComponent(model.identificationUrl)
            _this.showAuthorizeLayer = true
            _this.authorizeLayerType = 2
          }
          // 认证失败
          if (model.identificationState === 2) {
            MessageBox.alert(model.failRemark, '认证失败')
          }
        }
      })
    },
    // 查询状态
    loadState: function () {
      let _this = this
      // 获取认证信息
      Tools.ajax('get', 'authorize/state', {id: _this.model.id}, function (res) {
        if (res.code === 0 && res.data !== null) {
          // 0:未授权 1:已授权
          _this.model.authorizeState = res.data.authorizeState
          // 0:未认证 1:认证中 2:认证失败 3:认证通过待确认 4:已认证
          _this.model.identificationState = res.data.identificationState
        }
      })
    },
    // 授权确定事件
    bindAuthorizeLayer: function (confirm) {
      if (confirm) {
        let url = this.authorizeLayerType === 1 ? this.model.authorizeUrl : this.model.identificationUrl
        Tools.openApp(Tools.global.openApliPayLink + encodeURIComponent(url))
      } else {
        this.showAuthorizeLayer = false
      }
    },
    // 显示时间控件
    showDatePicker: function () {
      this.$refs.picker.open()
    },
    // 时间选择事件
    choicePicker: function (val) {
      this.dateVal = val
      this.model.businessLicenseDate = moment(val).format('YYYY-MM-DD')
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

  .btn-large{
    font-size: 0.8rem;
    height: 1.7rem;
    margin-left: auto;
    width: 80%;
    margin-right: auto;
  }
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

  .div-img .img-photo{
    width: 90%;
    margin: 1rem;
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
