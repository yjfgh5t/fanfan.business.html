<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="编辑店铺信息">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="save()">保存</mt-button>
    </mt-header>

    <div style="height: 40px;"></div>
    <mt-cell title="店铺Logo" class="mint-field" >
      <img class="img" :src="itemModel.logo" v-on:click="imgActionsVisible=true" id="img_logo" />
    </mt-cell>
    <mt-field label="店铺名称" placeholder="请输入店铺名称" v-model="itemModel.name" length="32"></mt-field>
    <mt-cell title="是否营业" class="mint-field" >
      <mt-switch v-model="itemModel.state">{{itemModel.state?'是':'否'}}</mt-switch>
    </mt-cell>
    <mt-cell title="营业时间" class="mint-field" >
     <mt-field type="text" v-model="itemModel.businessStart" placeholder="开始时间" @click.native.capture="openPicker(true)" readonly="readonly" ></mt-field> -
      <mt-field type="text"  v-model="itemModel.businessEnd"  placeholder="结束时间" @click.native.capture="openPicker(false)" readonly="readonly"></mt-field>
    </mt-cell>
    <mt-field label="起订价格" placeholder="请输入起订价格" type="number" length="7" v-model="itemModel.minOrderPrice"></mt-field>
    <mt-field label="店铺地址" placeholder="请输入店铺地址"  type="textarea" rows="2" length="128" v-model="itemModel.address"></mt-field>
    <!-- 选择相册或拍照-->
    <mt-actionsheet :actions="imgActions" v-model="imgActionsVisible"></mt-actionsheet>
    <!-- 日期控件-->
    <mt-datetime-picker
      ref="picker"
      type="time"
      v-model="defDateVal"
      @confirm="choicePicker">
    </mt-datetime-picker>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
import MtField from '../../../node_modules/mint-ui/packages/field/src/field.vue'
export default {
  components: {
    MtField,
    MtButton},
  data () {
    return {
      itemModel: {id: -1, name: '', businessStart: '00:00', businessEnd: '23:59', minOrderPrice: 0, address: '', logo: '', state: false},
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      imgActionsVisible: false,
      isStartTime: true,
      defDateVal: ''
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
      let _this = this
      Tools.choiceImg(2, function (res) {
        if (res.code === 0) {
          _this.itemModel.logo = res.data
          document.getElementById('img_logo').setAttribute('src', res.data)
          _this.modifyImg(_this)
        }
      })
    },
    // 拍照
    takePhoto: function () {
      let _this = this
      Tools.choiceImg(1, function (res) {
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
      // 获取信息
      Tools.ajax('get', 'shop/' + _this.itemModel.id, null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.itemModel = {
            id: res.data.id,
            name: res.data.name,
            businessStart: res.data.businessStart,
            businessEnd: res.data.businessEnd,
            minOrderPrice: res.data.minOrderPrice,
            address: res.data.address,
            logo: res.data.logo,
            state: res.data.state === 1
          }
        }
      })
    },
    // 打开时间选择器
    openPicker: function (type) {
      this.isStartTime = type
      if (this.isStartTime) {
        this.defDateVal = this.itemModel.businessStart
      } else {
        this.defDateVal = this.itemModel.businessEnd
      }
      this.$refs.picker.open()
    },
    // 选择时间
    choicePicker: function (val) {
      if (this.isStartTime) {
        this.itemModel.businessStart = val
      } else {
        this.itemModel.businessEnd = val
      }
    },
    // 验证
    validate: function () {
      if (this.itemModel.logo === '') {
        return '请上传店铺logo'
      }

      if (this.itemModel.name === '') {
        return '请输入店铺名称'
      }

      if (isNaN(this.itemModel.minOrderPrice)) {
        return '起订价格输入有误'
      }
      return ''
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
</style>
