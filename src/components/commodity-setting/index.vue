<template>
  <div class="body" style="height: 100%">
    <mt-header title="商品设置">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>


    <div class="div-content" v-bind:style="divBodyStyle">
      <!--类别栏 -->
      <ul class="ul-type">
        <li v-for="items in commodityTypes"  v-bind:class="{active: items.id==activeTypeId}" v-on:click="commodityTypeClick(items.id)">海鲜虾仁饭</li>
      </ul>

      <!--商品栏 -->
      <div class="div-commonditys">
        <div v-for="items in commoditiesTypeFilter(commodities,activeTypeId)" class="div-item">
          <img src="https://fuss10.elemecdn.com/4/7d/412c58ad49fed41f849989dc66270jpeg.jpeg?imageMogr/format/webp/thumbnail/!140x140r/gravity/Center/crop/140x140/" />
          <div class="div-item-right">
            <p class="item-title" v-text="items.title"></p>
            <div class="div-tag">
              <span v-text="'月售'+items.sales"></span> <span v-text="'库存'+items.inventory"></span> <span class="price" v-text="'￥'+items.price"></span>
            </div>
            <div class="div-btn">
              <mt-button size="small" type="danger">下架</mt-button>
              <mt-button size="small" type="primary">编辑</mt-button>
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
      commodityTypes: [{id: 0, name: '海鲜虾仁饭1'}, {id: 1, name: '海鲜虾仁饭2'}, {id: 2, name: '海鲜虾仁饭3'}],
      commodities: [
        {title: '麻辣香鲜黄焖排骨饭 + 狮子头一个 + 卤蛋一个', sales: 232, inventory: 2000, price: 32, id: 1, commodityTypeId: 0},
        {title: '麻辣香鲜黄焖排骨饭 + 狮子头一个 + 卤蛋一个', sales: 232, inventory: 2000, price: 32, id: 2, commodityTypeId: 2},
        {title: '麻辣香鲜黄焖排骨饭 + 狮子头一个 + 卤蛋一个', sales: 232, inventory: 2000, price: 32, id: 3, commodityTypeId: 0},
        {title: '麻辣香鲜黄焖排骨饭 + 狮子头一个 + 卤蛋一个', sales: 232, inventory: 2000, price: 32, id: 4, commodityTypeId: 1}
      ]
    }
  },
  methods: {
    commodityTypeClick: function (id) {
      this.activeTypeId = id
    },
    commoditiesTypeFilter: function (items, commodityTypeId) {
      return items.filter(function (item) {
        return item.commodityTypeId === commodityTypeId
      })
    }
  }
}
</script>

<style type="text/css" scoped>
  .ul-type{
    width:6rem;
    background-color: #eee;
    height: 100%;
    overflow: scroll;
    float: left;
  }

  .ul-type li{
    border: 1px solid #ccc;
    border-bottom: none;
    padding: 1.2rem 0.6rem;
  }
  .ul-type li:last-child{
    border-bottom:1px solid #ccc;
  }

  .ul-type li.active{
    background-color: white;
    border-left: 2px solid #99CCFF;
    border-right: none;
  }

  .div-commonditys{
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
    width: 17.5rem;
    padding: 0rem 0.75rem;
  }

  .div-item{
    padding: 1rem 0rem;
    border-bottom: 1px  solid #ccc;
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
  }

  .div-item-right{
    float: left;
    padding-left:1rem;
    width: 12rem;
  }

  .div-item-right .item-title{
    font-weight: 600;
    color: #000;
  }

  .div-tag,.div-btn{
    margin-top: 0.6rem;
    text-align: right;
  }

  .div-tag span{
    color: #aaa;
    margin-right: 0.4rem;
  }
  .div-tag span.price{
    color:orangered;
  }

</style>
