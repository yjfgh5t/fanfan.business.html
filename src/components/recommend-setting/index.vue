<template>
  <div class="body" style="height: 100%">
    <mt-header title="推荐商品设置">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="addItem">
        <i class="icon iconfont icon-tianjia"></i>
      </mt-button>
    </mt-header>

    <div class="div-content">
      <!--商品栏 -->
      <div class="div-commonditys">
        <div v-if="recommends.length>0" v-for="items in recommends" class="div-item">
          <img :src="items.icon==''?defCommodityIcon:items.icon" />
          <div class="div-item-right">
            <p class="item-title" v-text="items.title"></p>
            <div class="div-tag">
             <span class="price" v-text="'￥'+items.price"></span>
            </div>
            <div class="div-btn">
              <mt-button size="small" :type="'danger'" v-text="'删除'" v-on:click="submit(undefined,items.id)"></mt-button>
            </div>
          </div>
        </div>
        <div  v-if="recommends.length==0"  class="div-desc">您还未添加商品 请点击右上角按钮添加商品</div>
      </div>
    </div>

    <!--弹出层-->
    <layer title="选中推荐商品" :show="showCommodityLayer" :complete="bindChoiceComplete" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content"  style="overflow-y: scroll;max-height: 20rem;">
        <div v-if="commodities.length>0" v-for="items in commodities" class="div-item div-layer-item">
          <img :src="items.icon==''?defCommodityIcon:items.icon" />
          <div class="div-item-right">
            <p class="item-title" v-text="items.title"></p>
            <div class="div-tag">
              <span class="price" v-text="'￥'+items.price"></span>
            </div>
            <div class="div-box">
              <i v-on:click="checkItem(items)" v-bind:class="selectedIds.indexOf(items.id) !=-1 ? 'icon iconfont icon-gouxuan active' : 'icon iconfont icon-gouxuan'"></i>
            </div>
          </div>
        </div>
      </div>
    </layer>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import defCommodityIcon from '../../assets/imgs/icon_commodity.png'
import Layer from '@/tools/layer'
import { Toast } from 'mint-ui'
export default {
  components: {
    "layer": Layer
  },
  data () {
    return {
      // 商品数据
      commodities: [],
      // 推荐的商品数据
      recommends: [],
      defCommodityIcon: defCommodityIcon,
      showCommodityLayer: false,
      // 选中的Id
      selectedIds: []
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData: function () {
      let _this = this
      // 加载商品
      Tools.ajax('get', 'commodity/getRecommend', null, function (res) {
        if (res.code === 0) {
          let _commodityData = []
          let _selectedIds = []
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              _selectedIds.push(item.id)
              _commodityData.push({title: item.title, price: item.salePrice, id: item.id, icon: item.icon})
            })
          }
          _this.recommends = _commodityData
          _this.selectedIds = _selectedIds
        }
      })
    },
    // 添加推荐商品
    addItem: function () {
      let _this = this
      // 显示弹出层
      _this.showCommodityLayer = true
      // 加载商品数据
      Tools.ajax('get', 'commodity/', null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _commodityData = []
          res.data.forEach((item) => {
            _commodityData.push({title: item.title, price: item.salePrice, id: item.id, icon: item.icon, extendArray: item.extendList})
          })
          _this.commodities = _commodityData
        }
      })
    },
    // 绑定选中完成事件
    bindChoiceComplete: function () {
      let _this = this
      // 关闭弹出层
      _this.showCommodityLayer = false
      // 提交数据
      _this.submit(_this.selectedIds)
    },
    // 点击事件
    checkItem: function (items) {
      if (items.icon === '') {
        return Toast('需先设置该商品图片')
      }
      if (items.extendArray !== null && items.extendArray.length > 0) {
        return Toast('不能选择包含规格的商品')
      }
      let index = this.selectedIds.indexOf(items.id)
      if (index > -1) {
        this.selectedIds.splice(index, 1)
      } else {
        if (this.selectedIds.length === 6) {
          return Toast('最多只能设置6个推荐商品')
        }
        this.selectedIds.push(items.id)
      }
    },
    // 提交数据
    submit: function (updateIdArray, deleteId) {
      let _this = this
      let subData = {}
      if (updateIdArray) {
        subData.commodityIds = updateIdArray
      } else {
        subData.deleteId = deleteId
      }
      // 执行提交
      Tools.ajax(Tools.method.json, 'commodity/setRecommend', subData, function (res) {
        _this.loadData()
      })
    }
  }
}
</script>

<style type="text/css" scoped>

  .div-commonditys{
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
    padding: 0rem 0.8rem;
    width: 18rem;
  }

  .div-desc{
    text-align: center;
    margin-top: 2rem;
    color: #ccc;
  }

  .div-item{
    padding: 1rem 0rem;
    border-bottom: 1px  solid #eee;
    overflow: hidden;
  }

  .div-item:last-child{
    border-bottom: none;
  }

  .div-item img{
    width: 4rem;
    height: 4rem;
    display: block;
    float: left;
    border-radius: 0.4rem;
  }

  .div-item-right{
    float: left;
    padding-left: 0.75rem;
    width: 11rem;
    position: relative;
  }

  .div-item-right .item-title{
    font-weight: 600;
    color: #000;
  }

  .div-tag,.div-btn{
    margin-top: 0.4rem;
  }

  .div-tag span{
    color: #aaa;
    margin-right: 0.4rem;
  }
  .div-tag span.price{
    color:orangered;
    margin-right: 0rem;
  }
  .div-item-right .div-box{
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    right: 0rem;
    top: 0.8rem;
  }

  .div-box .iconfont{
    color: #cccccc;
    font-size: 1.2rem;
  }
  .div-box .iconfont.active{
    color: #00c7ff;
  }

  /** 弹出商品样式 **/
  .div-item.div-layer-item{
    padding: 0.3rem 0;
  }
  .div-layer-item img{
    width: 3rem;
    height: 3rem;
  }

</style>
