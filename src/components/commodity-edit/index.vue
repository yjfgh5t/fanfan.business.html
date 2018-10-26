<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="编辑商品">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="save()">保存</mt-button>
    </mt-header>

    <!--添加规格弹出层 -->
    <div class="commodity-shard" v-if="showNorms"></div>
    <div class="temp-bluetooth"  v-if="showNorms">
      <header class="mint-header" style="height: 1.8rem;"><h1 class="mint-header-title">添加规格</h1></header>
      <mt-field label="规格名称" placeholder="大份" v-model="normsModel.title" length="16"></mt-field>
      <mt-field label="商品价格" placeholder="0" v-model="normsModel.price" length="16"></mt-field>
      <div class="foot-bluetooth">
        <mt-button size="small" type="danger" v-on:click="showNorms=false">取消</mt-button> &nbsp;
        <mt-button size="small" type="primary" v-on:click="sureAddNorms()">确定</mt-button>
      </div>
    </div>

    <div style="height: 40px;"></div>
    <div class="cell-title">商品设置</div>
    <mt-cell title="商品图片" class="mint-field" >
      <img class="img" :src="itemModel.icon" v-on:click="imgActionsVisible=true" id="img_icon" />
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
    <mt-field label="打包费" placeholder="请输入商品打包费用" type="number" length="5" v-model="itemModel.packagePrice"></mt-field>

    <div class="cell-title">规格设置</div>
    <div class="div-guige">
      <ul class="ul-table">
        <li>
          <ul class="ul-tr ul-th">
            <li>名称</li>
            <li>价格</li>
            <li>操作</li>
          </ul>
        </li>
        <li  v-for="item in itemModel.norms">
          <ul class="ul-tr">
            <li v-text="item.title"></li>
            <li v-text="item.commodityPrice"></li>
            <li class="li-del" v-on:click="deleteNorms(item)">删除</li>
          </ul>
        </li>
        <li class="li-bottom" v-on:click="addNorms"> 点击添加规格 </li>
      </ul>
    </div>
    <div class="cell-title">其它设置</div>
    <mt-cell :title="'是否上架'" class="mint-field"><mt-switch v-model="itemModel.selling"></mt-switch></mt-cell>
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
  data () {
    return {
      itemModel: {id: 0, categoryId: 0, inventory: 9999, saleType: 1, selling: true, order: 0, unit: '份', norms: []},
      commodityTypes: [{id: 0, name: '请选择'}],
      imgActions: [{name: '打开相册', method: this.openAlbum}, {name: '拍照', method: this.takePhoto}],
      normsModel: {title: '', price: ''},
      imgActionsVisible: false,
      showNorms: false
    }
  },
  mounted () {
    if (this.$route.params.id && this.$route.params.id > 0) {
      this.itemModel.id = this.$route.params.id
    }
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
      Tools.ajax('json', 'commodity/', {
        id: _this.itemModel.id,
        icon: _this.itemModel.icon,
        title: _this.itemModel.title,
        categoryId: _this.itemModel.categoryId,
        desc: _this.itemModel.desc,
        price: _this.itemModel.price,
        salePrice: _this.itemModel.salePrice,
        inventory: _this.itemModel.inventory,
        saleType: _this.itemModel.saleType,
        status: _this.itemModel.selling ? 1 : 2,
        order: _this.itemModel.order,
        unit: _this.itemModel.unit,
        extendList: _this.itemModel.norms,
        mustOrder: _this.itemModel.mustOrder,
        packagePrice: _this.itemModel.packagePrice
      }, function (res) {
        if (res.code === 0) {
          _this.itemModel.id = res.data
          Toast('保存成功')
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
      if (this.itemModel.price === '' || isNaN(this.itemModel.price)) {
        return '请输入商品原价'
      }
      if (this.itemModel.salePrice === '' || isNaN(this.itemModel.salePrice)) {
        return '请输入商品售价'
      }
      if (this.itemModel.packagePrice === '' || isNaN(this.itemModel.packagePrice)) {
        return '请输入商品打包费'
      }
      if (this.itemModel.inventory === '' || isNaN(this.itemModel.inventory)) {
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
    // 删除对象
    deleteNorms: function (item) {
      // 删除数组元素
      for (let i = 0; i < this.itemModel.norms.length; i++) {
        if (item.id === this.itemModel.norms[i].id) {
          this.itemModel.norms.splice(i, 1)
          break
        }
      }
    },
    // 添加规格
    addNorms: function () {
      this.normsModel = {title: '', price: ''}
      this.showNorms = true
    },
    // 确认添加规格
    sureAddNorms: function () {
      let model = this.normsModel
      if (model.title === '') {
        return Toast('请输入规格名称')
      }

      if (model.price === '' || isNaN(model.price)) {
        return Toast('请输入商品售价')
      }
      // 添加规格
      this.itemModel.norms.push({id: 0, title: model.title, commodityPrice: model.price, type: 1});
      this.showNorms = false
    },
    // 打开相册
    openAlbum: function () {
      let _this = this
      Tools.choiceImg(2, function (res) {
        if (res.code === 0) {
          _this.itemModel.icon = res.data
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
          _this.itemModel.icon = res.data
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

      // 加载分类
      Tools.ajax('get', 'commodityCategory/', null, function (res) {
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
      Tools.ajax('get', 'commodity/' + _this.itemModel.id, null, function (res) {
        if (res.code === 0 && res.data) {
          let items = []
          if (res.data.extendList !== null && res.data.extendList.length > 0) {
            res.data.extendList.forEach(function (item) {
              items.push({id: item.id, title: item.title, type: item.type, commodityPrice: item.commodityPrice})
            })
          }
          _this.itemModel = {
            id: _this.itemModel.id,
            icon: res.data.icon,
            title: res.data.title,
            categoryId: res.data.categoryId,
            desc: res.data.desc,
            price: res.data.price,
            salePrice: res.data.salePrice,
            inventory: res.data.inventory,
            saleType: res.data.saleType,
            // 是否上架
            selling: res.data.status === 1,
            order: res.data.order,
            unit: res.data.unit,
            packagePrice: res.data.packagePrice,
            norms: items
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
  .ul-table{
    padding: 0 0.6rem;
    list-style: none;
  }

  .ul-table > li{
    border-bottom: 0.01rem solid #cccccc;
    line-height: 2.6rem;
    overflow:auto;
  }
  .ul-table > li:last-child{
    border-bottom: none;
  }

  .li-bottom{
    text-align: center;
    color: #cccccc;
  }

  ul-tr{
    width:100%;
    overflow: hidden;
    list-style: none;
  }
  .ul-tr.ul-th li{
    color: #5a5a5a;
  }
  .ul-tr li{
    float: left;
    width:33%;
    overflow: hidden;
    line-height: 2.6rem;
    color: #5a5a5a;
    text-align: center;
  }

  .ul-tr li.li-del{
    color: orangered;
  }

  .commodity-shard{
    width:100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    position: fixed;
    top: 40px;
    z-index: 1;
  }

  .temp-bluetooth{
    width: 80%;
    height: 9rem;
    position: fixed;
    z-index: 2;
    background: white;
    left:60%;
    margin-left: -10rem;
    top: 15%;
  }

  .foot-bluetooth{
    height: 1.8rem;
    text-align: right;
    padding-right: 1rem;
  }

</style>
