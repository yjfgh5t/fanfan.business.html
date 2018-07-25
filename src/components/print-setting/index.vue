<template>
  <div class="body" style="height: 100%">
    <mt-header title="打印设置">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>

    <!--搜索蓝牙弹出层 -->
    <div class="shard" v-if="showBlueTooths"></div>
    <div class="temp-bluetooth"  v-if="showBlueTooths">
      <header class="mint-header" style="height: 10%"><h1 class="mint-header-title">
        {{ isSearch ? '正在搜索蓝牙':'蓝牙列表'}}
        <mt-spinner style="display:inline-block;" v-if="isSearch" type="triple-bounce" color="#ffffff"></mt-spinner></h1></header>
      <mt-radio
        align="right"
        v-model="redioVal"
        :options="redioOptions">
      </mt-radio>
      <div class="foot-bluetooth">
          <mt-button size="small" type="danger" v-on:click="cancelBlueToth">取消</mt-button> &nbsp;
          <mt-button size="small" type="primary" v-on:click="addBlueTooth">确定</mt-button>
      </div>
    </div>

    <div v-on:click="searchBlueTooth">
    <mt-cell title="添加蓝牙打印机" is-link >
      <i slot="icon" class="icon iconfont icon-print" />
    </mt-cell>
    </div>
    <div>
    <mt-cell :to="{path:'/',query: {active: 'container-msg', refreshOrder:true }}"  title="外卖管家打印机" is-link>
      <i slot="icon" class="icon iconfont icon-order" />
    </mt-cell>
    </div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      blueTooths: [],
      redioOptions: [],
      redioVal: null,
      isSearch: true,
      showBlueTooths: false
    }
  },
  methods: {
    // 搜索蓝牙
    searchBlueTooth: function () {
      let _this = this
      // 显示蓝牙列表
      _this.showBlueTooths = true

      // 开始搜索
      Tools.blueTooth(true, function (res) {
        if (res.data.event) {
          _this.isSearch = (res.data.event === 'start')
        } else {
          let blueToothModel = {address: res.data.address, name: (res.data.name ? res.data.name : '未知设备')}
          _this.blueTooths.push(blueToothModel)
          _this.redioOptions.push({ label: blueToothModel.name + '[' + blueToothModel.address + ']', value: _this.blueTooths.length - 1 })
        }
      })
    },
    // 添加蓝牙
    addBlueTooth: function () {
      if (this.redioVal === null) {
        return Toast('请选择蓝牙打印机')
      }
      let blueToothModel = this.blueTooths[this.redioVal]
    },
    // 取消
    cancelBlueToth: function () {
      this.showBlueTooths = false
      // 停止搜索
      if (this.isSearch) {
        // 停止搜索
        Tools.blueTooth(false, function () {})
      }
      // 清空搜索的值
      this.blueTooths = []
      this.redioOptions = []
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

  .temp-bluetooth{
    width: 20rem;
    height: 70%;
    position: fixed;
    z-index: 2;
    background: white;
    left:50%;
    margin-left: -10rem;
    top: 15%;
  }

  .mint-radiolist{
    height: 80%;
    overflow: scroll;
  }

  .foot-bluetooth{
    height: 10%;
    text-align: right;
    padding-right: 1rem;
  }

</style>
