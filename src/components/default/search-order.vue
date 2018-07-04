<template>
  <div class="body">

    <!-- 标题-->
    <header class="mint-header">
      <div class="mint-header-button is-left"></div>
        <h1 class="mint-header-title">{{ dateVal | moment("YYYY-MM-DD") }} <i class="iconfont icon-xiala" v-on:click="openPicker"></i> </h1>
      <div class="mint-header-button is-right"></div>
    </header>

    <!-- tab -->
    <mt-navbar v-model="orderState" style="top:40px;z-index: 1">
      <mt-tab-item id="1">全部</mt-tab-item>
      <mt-tab-item id="2">进行中</mt-tab-item>
      <mt-tab-item id="3">已完成</mt-tab-item>
      <mt-tab-item id="4">已取消</mt-tab-item>
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
    <order-list height="136" :queryDate="dateVal | moment('YYYY-MM-DD')" style="z-index: 0"></order-list>
  </div>
</template>

<script>
import OrderList from '@/components/default/list-order'
import moment from 'moment'
export default {
  name: 'search-order',
  components: {
    "order-list": OrderList
  },
  data () {
    return {
      defDateVal: moment().format("YYYY-MM-DD"),
      dateVal: moment().format("YYYY-MM-DD"),
      orderState: '1'
    }
  },
  methods: {
    openPicker: function () {
      this.$refs.picker.open()
    },
    choicePicker: function (val) {
      this.dateVal = val
    }
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

</style>
