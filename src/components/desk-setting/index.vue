<template>
  <div class="body" style="height: 100%;">
    <mt-header title="客桌设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.back(-1)" >返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="editItems(-1)">
        <i class="icon iconfont icon-tianjia"></i>
      </mt-button>
    </mt-header>

    <!--添加修改弹出层 -->
    <div class="shard" v-if="isEdit>0"></div>
    <div class="lay-body"  v-if="isEdit>0">
      <header class="mint-header"><h1 class="mint-header-title">{{ isEdit ==1 ? '添加客桌':'修改客桌'}}</h1></header>
      <mt-field label="客桌名称" placeholder="请输入客桌名称（如：A1）" v-model="model.title"></mt-field>
      <div class="lay-foot">
        <mt-button size="small" type="danger" v-on:click="cancel()">取消</mt-button> &nbsp;
        <mt-button size="small" type="primary" v-on:click="save()">确定</mt-button>
      </div>
    </div>
    <div v-for="(item,index) in deskArray"  class="type-item">
      <mt-cell :title="item.title">
        <i v-show="item.qrCodeId!=''" slot="icon" class="icon iconfont icon-erweima" />
        <span  style="margin-right:0.4rem;" v-on:click="deleteItems(item.id)" ><mt-badge size="small" type="error"><span class="badge">删除</span></mt-badge></span>
        <span  style="margin-right:0.4rem;" v-on:click="editItems(index)" ><mt-badge size="small"><span class="badge">编辑</span></mt-badge></span>
        <span  style="margin-right:0.4rem;" v-on:click="qrCodeItems(index)" ><mt-badge size="small"><span class="badge">设置二维码</span></mt-badge></span>
      </mt-cell>
    </div>

    <div class="no-items" v-if="deskArray.length===0">
      <p>还未添加客桌</p>
    </div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast,MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      deskArray: [],
      // 0:未编辑 1:添加 2:修改
      isEdit: 0,
      model: {title: '', id: -1}
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    deleteItems: function (id) {
      let _this = this
      MessageBox.confirm('确认删除该客桌吗?').then(action => {
        Tools.ajax('post', 'desk/delete/' + id, null, function (res) {
          if (res.code === 0) {
            Toast('删除成功！')
            _this.loadItems()
          }
        })
      })
    },
    editItems: function (index) {
      let _this = this
      if (index === -1) {
        _this.isEdit = 1
        _this.model = {title: '', id: -1}
      } else {
        _this.isEdit = 2
        _this.model =  _this.deskArray[index]
      }
    },
    // 扫描
    qrCodeItems: function (index) {
      let _this = this
      let model = _this.deskArray[index]
      Tools.scanQRCode(function (data) {
        // 验证二维码是否合法
        if (data === null || data.length === 0 || data.indexOf('qrcode=') === -1) {
          return Toast('不正确的客桌二维码')
        }
        let qrcode = data.split('qrcode=')[1]
        if (qrcode.length !== 32) {
          return Toast('不正确的客桌二维码')
        }
        let subModel = {id: model.id, qrCodeId: qrcode, title: model.title}
        if (model.qrCodeId !== '') {
          MessageBox.confirm('确认替换原有的二维码吗?').then(action => {
            // 执行保存
            _this.submit(_this, subModel)
          })
        } else {
          // 执行保存
          _this.submit(_this, subModel)
        }
      })
    },
    cancel: function () {
      this.isEdit = 0
    },
    save: function () {
      if (this.model.title === '') {
        Toast('请输入客桌名称')
        return null
      }
      let subModel = {id: this.model.id, title: this.model.title}

      // 执行保存
      this.submit(this, subModel)
    },
    // 提交保存
    submit: function (_this, model) {
      // 执行保存
      Tools.ajax('json', 'desk/', model, function (res) {
        // 刷新数据
        if (res.code === 0) {
          _this.cancel()
          _this.loadItems()
        }
      })
    },
    // 加载列表
    loadItems: function () {
      let _this = this
      Tools.ajax('get', 'desk/', null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _deskData = []
          res.data.forEach((item) => {
            _deskData.push({title: item.title, id: item.id, qrCodeId: item.qrCodeId})
          })
          _this.deskArray = _deskData
        }
      })
    }
  }
}
</script>

<style type="text/css">
  .shard{
    width:100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    position: fixed;
    top: 40px;
    z-index: 1;
  }

  .lay-body{
    width: 16rem;
    position: fixed;
    z-index: 2;
    background: white;
    left:50%;
    margin-left: -8rem;
    top: 15%;
    padding-bottom: 1rem;
  }
  .lay-foot{
    height: 10%;
    text-align: right;
    padding-right: 1rem;
  }
  .no-items{
    margin-top: 20%;
    text-align: center;
    color: #aaa;
  }
  .badge{
    font-size: 0.526rem;
  }
  .mint-cell-title .icon{
    position: relative;
    top: 0.2rem;
  }
  .icon-erweima{
    color: #26a2ff;
  }
</style>
