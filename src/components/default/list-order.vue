<template>
  <div class="list-order-body" :style="{height:bodyHeight+'px'}">
    <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="loadBottom" :bottom-all-loaded="isLoadBottom" bottom-distance="-70">
      <ul class="ul-order">
        <li v-for="item in orderArray" class="li-item">
          <div class="item-title" style="color: #aaa;">
            <label> 编号：<label class="item-no">003</label></label>
            <label style="float: right;">订单已支付</label>
          </div>
          <div class="item-body">
            <div class="body-commodity-size"><label>2件商品</label> <label style="float: right">展开</label> </div>
            <div class="body-commodity">
              <div class="commodity">
                <label class="name">酸辣牛肉粉</label> <label class="size">x 1</label> <label class="price">22.00</label>
              </div>
              <div class="commodity">
                <label class="name">酸辣牛肉粉</label> <label class="size">x 1</label> <label class="price">22.00</label>
              </div>
            </div>
          </div>
          <div class="item-foot">
            <div class="foot-price">
              <label class="foot-line"><label class="lab-title">订单总额：</label>44:00</label>
              <label class="foot-line"><label class="lab-title">桌号：</label>A12</label>
            </div>
            <div class="foot-option">
              <mt-button size="small" type="danger">取消订单</mt-button>
              <mt-button size="small" type="primary">打印</mt-button>
            </div>
          </div>

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
      isLoadBottom: false,
      minLoadId: -1,
      maxLoadId: -1
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
    },
    loadTop: function () {
      let _this = this
      // 加载数据 向上拉取数据
      this.loadItems({isMax: true, lastId: this.maxLoadId}, function () {
        _this.$refs.loadmore.onTopLoaded()
      })
    },
    loadBottom: function () {
      let _this = this
      // 设置正在加载数据 防止重复向下拉起数据
      _this.isLoadBottom = true
      // 加载数据 向下拉取数据
      this.loadItems({isMax: false, lastId: _this.minLoadId}, function () {
        _this.isLoadBottom = false
        _this.$refs.loadmore.onBottomLoaded()
      })
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
          callback()
        }
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
              _this.orderArray.unshift(_this.convertItem(resData[i]))
            }
          } else {
            _this.minLoadId = resData[resData.length - 1].id
            // 顺序添加数据
            for (let item in resData) {
              _this.orderArray.push(_this.convertItem(item))
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
        details: details
      }
    }
  },
  props: {
    'height': {default: 0},
    'queryDate': {default: moment().format("YYYY-MM-DD")},
    'lastId': {default: 0}
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
</style>
