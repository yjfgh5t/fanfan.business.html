<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import Tools from '@/commons/tools/index'
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
  },
  created () {
    let _this = this
    Tools.getKeyVal(Tools.globalKey.userInfo, function (data) {
      if (data == "") {
        _this.$router.push({name: 'login'})
      } else {
        // 绑定信鸽推送
        Tools.bindUser(data.userId, function (bind) {})
      }
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
</style>
