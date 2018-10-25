<template>
  <div class="body" style="height: 100%">
    <mt-header title="商品设置">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="$router.push({path: '/commodityEdit/0'})">
        <i class="icon iconfont icon-tianjia"></i>
      </mt-button>
    </mt-header>

    <div class="div-content" v-bind:style="divBodyStyle">
      <!--类别栏 -->
      <ul class="ul-type">
        <li v-for="items in commodityTypes"  v-bind:class="{active: items.id==activeTypeId}" v-on:click="commodityTypeClick(items.id)" v-text=" items.name "></li>
      </ul>
      <!--商品栏 -->
      <div class="div-commonditys">
        <div v-for="items in commoditiesTypeFilter(commodities,activeTypeId)" class="div-item">
          <img :src="items.icon" />
          <div class="div-item-right">
            <p class="item-title" v-text="items.title"></p>
            <div class="div-tag">
              <span hidden="hidden" v-text="'原价'+items.price"></span> <span v-text="'库存'+items.inventory"></span> <span class="price" v-text="'￥'+items.price"></span>
            </div>
            <div class="div-btn">
              <mt-button size="small" :type="items.isPullOff?'primary':'danger'" v-text="items.isPullOff?'上架':'下架'" v-on:click="pullOffShelves(items)"></mt-button>
              <mt-button size="small" type="primary" v-on:click="$router.push({path: '/commodityEdit/'+items.id })">编辑</mt-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      divBodyStyle: {height: (window.document.body.clientHeight-40) + 'px'},
      activeTypeId: 1,
      commodityTypes: [],
      commodities: [
        {title: '麻辣香鲜黄焖排骨饭 + 狮子头一个 + 卤蛋一个', sales: 232, inventory: 2000, price: 32, id: 1, commodityTypeId: 0, icon: 'https://fuss10.elemecdn.com/4/7d/412c58ad49fed41f849989dc66270jpeg.jpeg?imageMogr/format/webp/thumbnail/!140x140r/gravity/Center/crop/140x140/'},
      ]
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    commodityTypeClick: function (id) {
      this.activeTypeId = id
    },
    commoditiesTypeFilter: function (items, commodityTypeId) {
      return items.filter(function (item) {
        return item.commodityTypeId === commodityTypeId
      })
    },
    // 下架
    pullOffShelves: function (items) {
      Tools.ajax('post', 'commodity/pullOffShelves/' + items.id, {pullOffShelves: !items.isPullOff}, function (res) {
        if (res.code === 0) {
          items.isPullOff = !items.isPullOff
        }
      })
    },
    loadItems: function () {
      let _this = this
      // 加载商品分类
      Tools.ajax('get', 'commodityCategory/', null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _commodityTypeData = []
          res.data.forEach((item) => {
            _commodityTypeData.push({name: item.name, id: item.id})
          })
          _this.commodityTypes = _commodityTypeData
          // 默认第一个
          if (_this.commodityTypes.length > 0) {
            _this.activeTypeId = _this.commodityTypes[0].id
          }
        }
      })

      // 加载商品
      Tools.ajax('get', 'commodity/', null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _commodityData = []
          res.data.forEach((item) => {
            _commodityData.push({title: item.title, sales: 0, inventory: item.inventory, price: item.salePrice, id: item.id, commodityTypeId: item.categoryId, icon: item.icon, isPullOff: item.status === 2})
          })
          _this.commodities = _commodityData
        }
      })
    }
  }
}
</script>

<style type="text/css" scoped>
  .ul-type{
    width:5rem;
    background-color: #ddd;
    height: 100%;
    overflow: scroll;
    float: left;
  }

  .ul-type li{
    border: 1px solid #eee;
    border-bottom: none;
    padding: 1.2rem 0.4rem;
  }
  .ul-type li:last-child{
    border-bottom:1px solid #eee;
  }

  .ul-type li.active{
    background-color: white;
    border: none;
    border-left: 3px solid #99CCFF;
  }

  .div-commonditys{
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
    width: 14rem;
    padding: 0rem 0.4rem;
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
    width: 5rem;
    height: 5rem;
    display: block;
    float: left;
    border-radius: 0.4rem;
  }

  .div-item-right{
    float: left;
    padding-left: 0.75rem;
    width: 8.25rem;
  }

  .div-item-right .item-title{
    font-weight: 600;
    color: #000;
  }

  .div-tag,.div-btn{
    margin-top: 0.4rem;
    text-align: right;
  }

  .div-tag span{
    color: #aaa;
    margin-right: 0.4rem;
  }
  .div-tag span.price{
    color:orangered;
    margin-right: 0rem;
  }

</style>
