<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
  font-size: 0.9rem;
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

.mint-button--little{
  display: inline-block;
  font-size: 0.6rem;
  padding: 0 0.6rem;
  height: 1.8rem;
}
</style>
