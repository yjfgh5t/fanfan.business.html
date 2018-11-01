<template>
  <div class="body" style="height: 100%;position: absolute;" v-if="show">
    <!--弹出层 -->
    <div class="shard" v-if="show"></div>
    <div class="temp-layer" :style="tempStyle"  v-if="show">
      <header class="mint-header" style="height: 1.8rem;"><h1 class="mint-header-title">
        {{ title }} <slot name="right"></slot></h1>
      </header>
      <div class="temp-content">
        <slot name="content"></slot>
      </div>
      <div class="foot-layer">
          <mt-button size="small" type="danger" v-on:click="cancel" v-text="cancelText">取消</mt-button> &nbsp;
          <mt-button size="small" type="primary" v-on:click="confirm" v-text="confirmText">确定</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    cancel: function () {
      if (this.complete !== undefined) {
        this.complete(false)
      }
    },
    confirm: function () {
      if (this.complete !== undefined) {
        this.complete(true)
      }
    }
  },
  props: {
    cancelText: {default: '取消'},
    confirmText: {default: '确定'},
    title: {default: '标题'},
    show: {default: true},
    tempStyle: {default: ''},
    complete: {default: undefined}
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

  .temp-layer{
    width: 20rem;
    position: fixed;
    z-index: 2;
    background: white;
    left:50%;
    margin-left: -10rem;
    top: 15%;
  }
  .temp-content{
    padding:0.6rem 0.4rem;
  }
  .foot-layer{
    height: 1.8rem;
    text-align: right;
    padding-right: 1rem;
  }
</style>
