<template>
  <div class="body">
      <!-- 标题-->
      <header class="mint-header">
        <div class="mint-header-button is-left"></div>
          <h1 class="mint-header-title">查询订单</h1>
        <div class="mint-header-button is-right"></div>
      </header>

      <div class="div-order">
        <ul class="ul-order">
          <li>订单数：<span v-text="orderStatistics.orderCount"></span></li>
          <li>订单总额：<span v-text="orderStatistics.orderTotal"></span></li>
          <li>退单数：<span v-text="orderStatistics.cancelOrderCount"></span></li>
          <li>退单总额：<span v-text="orderStatistics.cancelOrderTotal"></span></li>
        </ul>
      </div>
    <div class="div-date">
      <h1 class="mint-header-title">{{ dateVal | moment("YYYY-MM-DD") }} <i class="iconfont icon-xiala" v-on:click="openPicker"></i> </h1>
    </div>

    <!-- tab -->
    <mt-navbar v-model="orderState" class="div-tab">
      <mt-tab-item id="0">全部</mt-tab-item>
      <mt-tab-item id="1" >进行中</mt-tab-item>
      <mt-tab-item id="2">已完成</mt-tab-item>
      <mt-tab-item id="3">已取消</mt-tab-item>
    </mt-navbar>

    <!-- 日期控件-->
    <mt-datetime-picker
      ref="picker"
      type="date"
      v-model="defDateVal"
      @confirm="choicePicker"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
    <div style="clear: both;"></div>
    <!-- 订单列表-->
    <order-list height="250" :queryDate="dateVal | moment('YYYY-MM-DD')" :orderState="orderState" style="z-index: 0" ref="order"></order-list>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import OrderList from '@/components/default/list-order'
import Tools from '../../commons/tools/index'
import moment from 'moment'
export default {
  name: 'search-order',
  components: {
    'order-list': OrderList
  },
  data () {
    return {
      defDateVal: moment().format('YYYY-MM-DD'),
      dateVal: moment().format('YYYY-MM-DD'),
      orderState: '0',
      orderStatistics: {orderTotal: 0, orderCount: 0, cancelOrderTotal: 0, cancelOrderCount: 0}
    }
  },
  mounted () {
    let that = this
    // 检查登录
    Tools.checkLogin(function (login) {
      if (login) {
        that.loadOrderStatistic()
      }
    })
  },
  methods: {
    // 触发展示时
    onShow: function () {
      this.loadOrderStatistic()
      this.$refs.order.loadTop()
    },
    openPicker: function () {
      this.$refs.picker.open()
    },
    choicePicker: function (val) {
      this.dateVal = val
      this.loadOrderStatistic()
    },
    // 加载订单统计数据
    loadOrderStatistic: function () {
      let _this = this
      Tools.ajax('get', 'order/statistics/' + moment(this.dateVal).format('YYYY-MM-DD'), {}, function (res) {
        if (res.code === 0) {
          _this.orderStatistics.orderTotal = res.data.orderTotal || 0
          _this.orderStatistics.orderCount = res.data.orderCount || 0
          _this.orderStatistics.cancelOrderTotal = res.data.cancelOrderTotal || 0
          _this.orderStatistics.cancelOrderCount = res.data.cancelOrderCount || 0
        }
      })
    }
  },
  created () {
    let _this = this
    // 注册通知
    Tools.localNotify('local_notify_search_order', function (model) {
      _this.$refs.order.updateLocalItemState(model)
    })
  }
}
</script>

<style lang="css" scoped>
  .body{
    height: 100%;
  }

  .mint-navbar{
    border-bottom: 1px solid #eee;
  }
  .mint-navbar .mint-tab-item{
    z-index: 1;
  }

  .div-order{
    background: linear-gradient(#26a2ff 0,#00c7ff 100%);
    width: 100%;
    padding-bottom: 0.8rem;
  }

  .ul-order{
    overflow: hidden;
    width: 18rem;
    list-style: none;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 0.5rem;
  }
  .ul-order li{
    width: 8rem;
    float: left;
    line-height: 1.8rem;
    color: white;

  }
  .ul-order li > span{
    width: 2rem;
    display: inline-block;
  }
  .ul-order li > span:nth-child(2n+1){
    margin-right: 0.2rem;
    text-align: left;
  }
  .ul-order li:nth-child(2n+1){
    text-align: right;
  }
  .ul-order li:nth-child(2n){
    text-align: left;
    margin-left: 2rem;
  }
  .div-date{
    width: 14rem;
    height: 1.8rem;
    background-color: rgba(38,162,255,0.9);
    border-radius: 0.9rem;
    color: white;
    text-align: center;
    line-height: 1.8rem;
    position: absolute;
    top:6.17rem;
    left: 50%;
    margin-left: -7rem;
  }
  .div-date .iconfont{
    font-size: 0.6rem;
  }

  .div-tab{
    top:40px;
    z-index: 1;
    padding-top: 0.7rem;
  }

</style>
