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
        {{ titleText }}
        <mt-spinner style="display:inline-block;" v-if="isSearch" type="triple-bounce" color="#ffffff"></mt-spinner></h1>
      </header>
      <mt-radio
        align="right"
        v-model="radioModel"
        :options="radioOptions">
      </mt-radio>
      <div class="foot-bluetooth">
          <mt-button size="small" type="danger" v-on:click="cancelBlueTooth">取消</mt-button> &nbsp;
          <mt-button size="small" type="primary" v-on:click="addBlueTooth">确定</mt-button>
      </div>
    </div>

    <div v-on:click="searchBlueTooth">
    <mt-cell title="添加蓝牙打印机" is-link >
      <span style="color: green" v-show="connectBlue.name!=''">[{{connectBlue.stateText}}]{{connectBlue.name}}</span>
      <i slot="icon" class="icon iconfont icon-print" />
    </mt-cell>
    </div><div>
    <mt-cell :to="{path:'/',query: {active: 'container-msg', refreshOrder:true }}"  title="外卖管家打印机" is-link v-show="false">
      <i slot="icon" class="icon iconfont icon-order" />
    </mt-cell>
    </div>
    <div>
    <mt-cell title="自动打印">
      <span><mt-switch v-model="autoPrint" @change="enableAutoPrint"></mt-switch></span>
      <i slot="icon" class="icon iconfont icon-print" />
    </mt-cell>
    </div>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import Client from '@/commons/tools/clientexcute'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      radioOptions: [],
      radioModel: null,
      isSearch: true,
      optionState: 0,
      titleText: '蓝牙列表',
      showBlueTooths: false,
      autoPrint: true,
      // 链接的蓝牙
      connectBlue: {name: '', address: '', stateText: '未连接'}
    }
  },
  methods: {
    // 搜索蓝牙
    searchBlueTooth: function () {
      let _this = this
      // 显示蓝牙列表
      _this.showBlueTooths = true
      _this.setBlueToothState(1)
      // 开始搜索
      Tools.blueTooth('start', function (res) {})
    },
    // 添加蓝牙
    addBlueTooth: function () {
      let _this = this
      if (_this.radioModel === null) {
        return Toast('请选择蓝牙打印机')
      }
      if (_this.optionState === 2) {
        Toast(this.titleText + '请稍后')
      } else {
        _this.setBlueToothState(2)
        Tools.blueConnect(_this.radioModel.address)
      }
    },
    // 取消
    cancelBlueTooth: function () {
      this.showBlueTooths = false
      // 停止搜索
      Tools.blueTooth('stop', function () {})
      // 清空搜索的值
      this.radioOptions = []
      this.isSearch = false
    },
    // 设置蓝牙状态
    setBlueToothState (state) {
      this.optionState = state
      switch (this.optionState) {
        case 0:
          this.titleText = '蓝牙列表'
          this.isSearch = false
          break
        // 搜索蓝牙
        case 1:
          this.isSearch = true
          this.titleText = '正在搜索蓝牙'
          break
        // 链接蓝牙中
        case 2:
          this.titleText = '正在连接蓝牙'
          this.isSearch = true
          break
        // 蓝牙链接失败
        case 3:
          this.titleText = '蓝牙连接失败'
          this.isSearch = false
          break
      }
    },
    // 设置链接的蓝牙
    initBlueTooth () {
      let _this = this
      // 注册蓝牙通知事件
      Tools.localNotify(Tools.globalKey.blueNotifyKey, function (res) {
        switch (res.data.event) {
          // 停止搜索
          case 'stop': _this.setBlueToothState(0); break
          // 搜索到设备
          case 'device':
            let blueToothModel = {
              address: res.data.model.address,
              name: (res.data.model.name === null ? '未知设备' : res.data.model.name),
              label: ''
            }
            blueToothModel.label = blueToothModel.name + '[' + blueToothModel.address + ']'
            _this.radioOptions.push(blueToothModel)
            // 设置选中的Model
            if (_this.connectBlue.address !== '' && _this.connectBlue.address === blueToothModel.address) {
              _this.radioModel = blueToothModel
            }
            break
          // 链接成功
          case 'connected':
            _this.connectBlue.stateText = '已连接'
            let spData = _this.radioModel.name + ';' + _this.radioModel.address
            Tools.setKeyVal(Tools.globalKey.blueToothConnect, spData, function () {
              _this.initBlueTooth()
            })
            _this.cancelBlueTooth()
            break
          // 设备断开链接
          case 'disConnected': _this.connectBlue.stateText = '未连接'; _this.setBlueToothState(3); break
          case 'onOpen':
            // 链接蓝牙
            Client.blueToothConnect()
            break
        }
      })

      // 获取已经链接的蓝牙
      Tools.getKeyVal(Tools.globalKey.blueToothConnect, function (data) {
        if (data.indexOf(';') > 0) {
          let blueStr = data.split(';')
          _this.connectBlue.name = blueStr[0]
          _this.connectBlue.address = blueStr[1]
        }
      })

      // 是否自动打印
      Tools.getKeyVal(Tools.globalKey.autoPrint, function (data) {
        _this.autoPrint = (data === 'true')
      })

      // 检查蓝牙状态
      Tools.blueTooth('state', function (res) {})

      // 1.5s后检查是否链接
      window.setTimeout(function () {
        // 尝试重新链接
        if (_this.connectBlue.name !== '' && _this.connectBlue.stateText === '未连接') {
          // 执行链接蓝牙
          Tools.blueConnect(_this.connectBlue.address)
        }
      }, 1500)
    },
    // 是否自动打印
    enableAutoPrint () {
      let autoPrint = this.autoPrint
      Tools.setKeyVal(Tools.globalKey.autoPrint, autoPrint, function (data) {
        let message = autoPrint ? '已开启自动打印' : '已关闭自动打印'
        Toast(message)
      })
    }
  },
  mounted () {
    this.initBlueTooth()
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
