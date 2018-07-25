<template>
  <div class="list-order-body" :style="{height:bodyHeight+'px'}">
    <mt-loadmore :top-method="loadTop" ref="loadmore" >
      <ul class="ul-order">
        <li v-for="item in orderArray" class="li-item">
          <div class="item-title" style="color: #aaa;">
            <label> 编号：<label class="item-no" v-text="item.orderDateNum">003</label></label>
            <label style="float: right;" v-text="item.stateText">订单已支付</label>
          </div>
          <div class="item-body">
            <div class="body-commodity-size"><label v-text="item.commoditySize+'件商品'"></label> <label style="float: right" v-text="item.open?'关闭':'展开'"></label> </div>
            <div class="body-commodity" v-show="item.open">
              <div class="commodity" v-for="commodity in item.details">
                <label class="name" v-text="commodity.outTitle"></label> <label class="size" v-text="'x '+commodity.outSize"></label> <label class="price" v-text="commodity.outPrice"></label>
              </div>
            </div>
          </div>
          <div class="item-foot">
            <div class="foot-price">
              <label class="foot-line"><label class="lab-title">订单总额：</label>{{item.orderPay}}</label>
              <label class="foot-line"><label class="lab-title">桌号：</label>{{item.orderDeskNum}}</label>
            </div>
            <div class="foot-option">
              <mt-button size="small" type="danger">取消订单</mt-button>
              <mt-button size="small" type="primary">打印</mt-button>
            </div>
          </div>
        </li>
        <!--加载更多-->
        <li class="li-loadmore">
          <mt-button plain="plain" v-if="loadState===0" v-on:click="loadMore" class="btn-loadmore" type="primary" size="large">加载更多</mt-button>
          <p class="txt-loadmore" v-if="loadState==1">加载中...</p>
          <p class="txt-loadmore" v-if="loadState==2">全部加载完毕</p>
          <p class="txt-loadmore" v-if="loadState==3">没有订单</p>
        </li>
      </ul>
      <div class="div-empty"></div>
    </mt-loadmore>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast, Loadmore } from 'mint-ui'
import moment from 'moment'
export default {
  name: 'new-order',
  data () {
    return {
      // 消息列表
      orderArray: [],
      bodyHeight: window.document.body.clientHeight - this.height,
      // 加载状态 0:加载更多  1:加载中  2: 为没有更多
      loadState: 1,
      minLoadId: -1,
      maxLoadId: -1
    }
  },
  methods: {
    loadTop: function () {
      let _this = this
      // 加载数据 向上拉取数据
      this.loadItems({isMax: true, lastId: this.maxLoadId}, function () {
        _this.$refs.loadmore.onTopLoaded()
      })
    },
    // 加载更多
    loadMore: function () {
      this.loadItems({isMax: false, lastId: this.minLoadId})
    },
    // 设置加载文本
    setLoadText: function (data) {
      let _this = this
      // 加载数据 向下拉取数据
      _this.loadState = 1
      if (data !== null && data.length === 10) {
        _this.loadState = 0
      } else {
        _this.loadState = 2
      }
      if (_this.orderArray.length === 0) {
        _this.loadState = 3
      }
    },
    loadItems: function (option, callback) {
      let _this = this
      // 清空订单列表
      if (option.clear) {
        _this.orderArray = []
      }
      // 最后一个订单id
      if (option.lastId === undefined) {
        option.lastId = -1
      }

      // 拉取订单列表
      Tools.ajax('post', 'order/query/' + _this.queryDate, {lastId: option.lastId, isMax: option.isMax}, (res) => {
        if (callback) {
          callback(res.data)
        }
        _this.setLoadText(res.data)
        if (res.code === 0 || res.data.length > 0) {
          let resData = res.data
          // 初始加载时 同时设置两个记录id值
          if (_this.orderArray.length === 0) {
            _this.minLoadId = resData[resData.length - 1].id
            _this.maxLoadId = resData[0].id
          }
          // 数组顶部反向添加数据
          if (option.isMax) {
            _this.maxLoadId = resData[0].id
            for (let i = resData.length - 1; i >= 0; i--) {
              Toast(JSON.stringify(resData[i]))
              _this.orderArray.unshift(_this.convertItem(resData[i]))
            }
          } else {
            _this.minLoadId = resData[resData.length - 1].id
            // 顺序添加数据
            for (let item in resData) {
              _this.orderArray.push(_this.convertItem(resData[item]))
            }
          }
        }
      })
    },
    // 转换对象
    convertItem: function (item) {
      let details = []
      if (item.details !== null && item.details !== undefined) {
        details = item.details.map(function (detail) {
          // if(detail.outType==2)
          return {
            id: detail.id,
            outId: detail.outId,
            outTitle: detail.outTitle,
            outPrice: detail.outPrice,
            outSize: detail.outSize,
            outType: detail.outType
          }
        })
      }
      return {
        id: item.id,
        orderNum: item.orderNum,
        stateText: item.orderStateText,
        orderPay: item.orderPay,
        orderTime: item.orderTime,
        userNick: item.userNick,
        userIcon: item.userIcon,
        orderDeskNum: item.orderDeskNum,
        details: details,
        commoditySize: 0 || item.commoditySize,
        orderDateNum: item.orderDateNum,
        open: false
      }
    }
  },
  props: {
    'height': {default: 0},
    'queryDate': {default: moment().format("YYYY-MM-DD")},
    'lastId': {default: 0},
    'refsh': {}
  },
  watch: {
    queryDate (val, oldVal) {
      if (val !== oldVal) {
        // 向下拉取数据
        this.minLoadId = -1
        this.maxLoadId = -1
        this.loadItems({isMax: false, clear: true, lastId: this.minLoadId})
      }
    }
  },
  created () {
    this.loadItems({isMax: false, clear: true, lastId: this.minLoadId})
  }
}
</script>

<style>
  .mint-tab-container-wrap{
    height: 100%;
  }
</style>

<style lang="css" scoped>
  .list-order-body{
    overflow-y: scroll;
  }

  .ul-order{
    width:92%;
    margin-left:4%;
    list-style: none;
    min-height: 12rem;
  }
  .ul-order .li-item{
    box-shadow:#ccc 0rem 0rem 0.2rem 0.05rem;
    padding:0.5rem;
    margin-top: 0.6rem;
    border-radius: 0.2rem;
    background-color: white;
  }

  .item-title, .item-body, .item-foot{
    padding: 0.6rem 0rem;
    width:100%;
    overflow: hidden;
    border-top: 0.05rem solid #99CCFF;
  }

  .item-title{
    padding-top: 0rem;
  }

  .item-foot{
    padding-bottom: 0rem;
  }

  .item-title{
    color: #aaa;
    border-top: none;
  }

  .item-title .item-no{
    color: #333333;
  }
  .item-body{
    border-top: 0.05rem solid #99CCFF;
  }

  .body-commodity-size{
    font-size:0.625rem;
    padding-bottom: 0.4rem;
  }
  .body-commodity{
    overflow: hidden;
  }
  .item-body .commodity{
    line-height: 1.6rem;
    width: 100%;
  }
  .commodity .name, .commodity .size, .commodity .price{
    float: left;
  }
  .commodity .name{
    width:65%;
  }
  .commodity .price{
    float: right;
  }

  .item-foot{
    overflow: hidden;
  }
  .item-foot div{
    float: left;
  }
  .foot-price{
    width:60%;
    border-right: 0.05rem solid #99CCFF;
  }

  .foot-option{
    line-height: 2.8rem;
    text-align: right;
    width: 38%;
  }

  .foot-line{
    display: block;
  }
  .foot-line .lab-title{
    width:4.8rem;
    line-height: 1.4rem;
    display: inline-block;
  }

  .div-empty{
    width: 100%;
    height: 0.8rem;
  }

  .li-loadmore{
    margin-top: 10px;
  }

  .btn-loadmore{
    margin-left: auto;
    margin-right: auto;
    width:60%;
    font-size: 0.5666rem;
    line-height: 1.8rem;
    color: #99CCFF;
    height: 1.8rem;
    border: 0.1rem solid #99CCFF;
  }

  .txt-loadmore{
    color: #aaa;
    text-align: center;
  }

</style>
