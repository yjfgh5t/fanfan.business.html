<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="商户设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="save()">保存</mt-button>
    </mt-header>
    <div style="height: 40px;"></div>
    <mt-cell title="商户头像" class="mint-field" >
      <img class="img" :src="model.icon" v-on:click="imgActionsVisible=true" id="img_icon" />
    </mt-cell>
    <mt-field label="商户姓名" placeholder="请输入商户姓名" v-model="model.name" length="8"></mt-field>
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="model.mobile"></mt-field>
    <div class="cell-title">密码设置</div>
    <mt-cell :title="'修改密码'" class="mint-field"><mt-switch v-model="model.modifyPwd"></mt-switch></mt-cell>
    <mt-field label="新密码" placeholder="请输入密码" type="password"  v-show="model.modifyPwd" v-model="model.newPwd"></mt-field>
    <!-- 选择相册或拍照-->
    <mt-actionsheet :actions="imgActions" v-model="imgActionsVisible"></mt-actionsheet>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
import userIcon from '../../assets/imgs/icon_user.png'
export default {
  data () {
    return {
      model: {userId: 0, mobile: '', name: '', modifyPwd: false, newPwd: '', icon: userIcon},
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      imgActionsVisible: false
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
      let temModel = {
        userId: _this.model.userId,
        mobile: _this.model.mobile,
        name: _this.model.name,
        picPath: _this.model.icon
      }
      if (_this.model.modifyPwd) {
        temModel.password = _this.model.newPwd
      }
      // 提交
      Tools.ajax('json', 'user/customer/save', temModel, function (res) {
        if (res.code === 0) {
          Toast('保存成功')
          let userInfo = {
            userId: res.data.userId,
            name: res.data.name,
            mobile: res.data.mobile,
            picPath: res.data.picPath
          }
          // 保存至本地
          Tools.setKeyVal(Tools.globalKey.userInfo, JSON.stringify(userInfo), function (success) {})
        }
      })
    },
    // 验证
    validate: function () {
      if (this.model.name === '') {
        return '请输入商户姓名'
      }
      if (this.model.modifyPwd && this.model.newPwd.length < 6) {
        return '密码长度必须大于6个字符'
      }
      return ''
    },
    // 打开相册
    openAlbum: function () {
      let _this = this
      Tools.choiceImg(2, function (res) {
        if (res.code === 0) {
          _this.model.icon = res.data
          document.getElementById('img_icon').setAttribute('src', res.data)
          _this.modifyImg(_this)
        }
      })
    },
    // 拍照
    takePhoto: function () {
      let _this = this
      Tools.choiceImg(1, function (res) {
        if (res.code === 0) {
          _this.model.icon = res.data
          document.getElementById('img_icon').setAttribute('src', res.data)
          _this.modifyImg(_this)
        }
      })
    },
    // 修改图片
    modifyImg: function (_this) {
      if (_this.itemModel.id === 0) {
        return
      }
      Tools.ajax('json', 'commodity/', {
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
      Tools.getKeyVal(Tools.globalKey.userInfo, function (data) {
        _this.model = {
          userId: data.userId,
          mobile: data.mobile,
          name: data.name,
          icon: (data.picPath === '' || data.picPath === undefined) ? userIcon : data.picPath
        }
        document.getElementById('img_icon').setAttribute('src', _this.model.icon)
      })
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
    border-radius: 1.5rem;
    width: 3rem;
    height: 3rem;
  }
</style>
