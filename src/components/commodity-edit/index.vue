<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="编辑商品">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="save()">保存</mt-button>
    </mt-header>

    <div style="height: 40px;"></div>
    <mt-cell title="商品图片" class="mint-field" >
      <img class="img" :src="itemModel.icon" v-on:click="imgActionsVisible=true" />
    </mt-cell>
    <mt-field label="商品名称" placeholder="请输入商品名称" v-model="itemModel.title" length="32"></mt-field>
    <mt-cell title="商品分类" class="mint-field" >
      <select class="cell-select mint-field-core mint-cell-allow-right" v-model="itemModel.categoryId"><option v-for="item in commodityTypes" :value="item.id" v-text="item.name"></option></select>
    </mt-cell>
    <mt-field label="商品描述" placeholder="请输入商品描述"  type="textarea" rows="2" length="128" v-model="itemModel.desc"></mt-field>

    <div class="cell-title">售价设置</div>
    <mt-field label="商品原价" placeholder="请输入商品原价" type="number" length="7" v-model="itemModel.price"></mt-field>
    <mt-field label="商品售价" placeholder="请输入商品售价" type="number" length="7" v-model="itemModel.salePrice"></mt-field>
    <mt-field label="商品库存" placeholder="请输入商品库存" type="number" length="5" v-model="itemModel.inventory"></mt-field>

    <div class="cell-title">其它设置</div>
    <mt-cell :title="'非卖品'" class="mint-field"><mt-switch v-model="itemModel.saleType"></mt-switch></mt-cell>
    <mt-field label="排序号" placeholder="请输入排序号" type="number" length="5" v-model="itemModel.order"></mt-field>
    <mt-field label="商品单位" placeholder="请输入商品单位" length="10" v-model="itemModel.unit"></mt-field>

    <!-- 选择相册或拍照-->
    <mt-actionsheet :actions="imgActions" v-model="imgActionsVisible"></mt-actionsheet>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
export default {
  components: {MtButton},
  data () {
    return {
      itemModel: {id: 0, categoryId: 0, inventory: 9999, saleType: false, order: 0, unit: '份'},
      commodityTypes: [{id: 0, name: '请选择'}],
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      imgActionsVisible: false
    }
  },
  mounted () {
    this.itemModel.id = this.$route.params.id
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
      Tools.ajax("json", "commodity/", {
        id: _this.itemModel.id,
        icon: _this.itemModel.icon,
        title: _this.itemModel.title,
        categoryId: _this.itemModel.categoryId,
        desc: _this.itemModel.desc,
        price: _this.itemModel.price,
        salePrice: _this.itemModel.salePrice,
        inventory: _this.itemModel.inventory,
        saleType: _this.itemModel.saleType ? 2 : 1,
        order: _this.itemModel.order,
        unit: _this.itemModel.unit,
        mustOrder: _this.itemModel.must
      }, function (res) {
        if (res.code === 0) {
          _this.itemModel.id = res.data
          Toast("保存成功")
        }
      })
    },
    // 验证
    validate: function () {

      if (this.itemModel.icon === '') {
        return '请设置商品图片'
      }
      if (this.itemModel.title === '') {
        return '标题不能为空'
      }
      if (this.itemModel.categoryId === 0) {
        return '请选择商品分类'
      }
      if (this.itemModel.price === '') {
        return '请输入商品原价'
      }
      if (this.itemModel.salePrice === '') {
        return '请输入商品售价'
      }
      if (this.itemModel.inventory === '') {
        return '请输入商品库存'
      }
      if (this.itemModel.order === '') {
        return '请输入排序号'
      }
      if (this.itemModel.unit === '') {
        return '请输入商品单位'
      }
      return ''
    },
    // 打开相册
    openAlbum: function () {
      let _this = this
      Tools.choiceImg(2, function (res) {
        if (res.code === 0) {
          _this.itemModel.icon = res.data
        }
      })
    },
    // 拍照
    takePhoto: function () {
      let _this = this
      Tools.choiceImg(1, function (res) {
        if (res.code === 0) {
          _this.itemModel.icon = res.data
        }
      })
    },
    // 加载数据
    loadItem: function () {
      let _this = this

      // 加载分类
      Tools.ajax("get", "commodityCategory/", null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _commodityData = [{id: 0, name: '请选择'}]
          res.data.forEach((item) => {
            _commodityData.push({name: item.name, id: item.id})
          })
          _this.commodityTypes = _commodityData
        }
      })

      if (_this.itemModel.id === 0) {
        return
      }
      // 加载商品
      Tools.ajax("get", "commodity/"+_this.itemModel.id, null, function (res) {
        if (res.code === 0 && res.data) {
          _this.itemModel = {
            id: _this.itemModel.id,
            icon: res.data.icon,
            title: res.data.title,
            categoryId: res.data.categoryId,
            desc: res.data.desc,
            price: res.data.price,
            salePrice: res.data.salePrice,
            inventory: res.data.inventory,
            saleType: res.data.saleType === 2,
            order: res.data.order,
            unit: res.data.unit
          }
        }
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
    width: 4rem;
    height: 4rem;
    display: block;
    float: left;
    border-radius: 0.4rem;
  }
</style>
