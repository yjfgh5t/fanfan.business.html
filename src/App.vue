<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" ref="dom"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"  ref="dom"></router-view>
  </div>
</template>

<script>
import Tools from '@/commons/tools/index'
import Client from '@/commons/tools/clientexcute'
import { Toast,Indicator } from 'mint-ui'
export default {
  name: 'App',
  mounted () {
    window.onresize = () => {
      return (() => {
        var width = document.documentElement.clientWidth
        document.getElementsByTagName('html')[0].style["font-size"] = (width / 640 * 32) + 'px'
      })()
    }
    window.onresize()
    // 5s后自动链接蓝牙
    try {
      window.setTimeout(function () {
        // 监听蓝牙事件
        Tools.localNotify(Tools.globalKey.blueNotifyKey, function (res) {
          switch (res.data.event) {
            case 'onOpen':
              // 链接蓝牙
              Client.blueToothConnect()
              break
          }
        })
        // 链接蓝牙
        Client.blueToothConnect(true)
      }, 5000)
    } catch (ex) {}
  },
  created () {
    // 检查登录
    Tools.checkLogin()
    // 设置API地址
    Tools.getKeyVal(Tools.globalKey.httpPath, function (data) {
      Tools.global.httpPath = data
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
/** 清除内外边距 **/
html,body,div, h1, h2, h3, h4, h5, h6, hr, p, blockquote,dl, dt, dd, ul, ol, li,pre,form, fieldset, legend, button, input, textarea,th, td{
  margin: 0;
  padding: 0;
  font-size: 0.625rem;
}

html, body{ margin:0; height:100%; }

/** 加载条 **/
.mint-indicator-wrapper{
  background:none !important;
}
.mint-spinner-double-bounce-bounce1{
  background-color: rgb(7, 6, 243) !important;
}
.mint-spinner-double-bounce-bounce2{
  background-color: rgb(6, 50, 247) !important;
}

.mint-button--small{
  display: inline-block;
  font-size: 0.5625rem;
  padding: 0 0.4rem;
  height: 1.4rem;
}
.mint-header{
  height: 50px;
}
.mint-header i.icon{
  font-size: 18px;
  padding: 0.2rem;
}
</style>
