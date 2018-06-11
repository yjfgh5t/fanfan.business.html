<template>
  <div class="body">
    <mt-header title="新订单"></mt-header>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <ul class="ul-order">
        <li v-for="item in msgArray" class="li-item">
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
              <mt-button size="little" type="danger">取消订单</mt-button>
              <mt-button size="little" type="primary">打印</mt-button>
            </div>
          </div>

        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast, Loadmore } from 'mint-ui'
export default {
  name: 'new-order',
  data () {
    return {
      // 消息列表
      msgArray: [{orderNum: '001'}, {orderNum: '002'}, {orderNum: '003'}]
    }
  },
  methods: {
    itemClick: function (containerId) {
      this.active = containerId
    },
    loadTop: function () {
      let _this = this
      setTimeout(function () {
        _this.$refs.loadmore.onTopLoaded()
      }, 2000)
    },
    // 刷新消息
    refreshMsg: () => {
      Tools.ajax('post', 'info/msg', {}, (res) => {
        if (res.code == 0) {
          for (let item in res.data.length) {
            this.msgArray.push(item)
          }
        }
      })
    }
  },
  created () {
    if (this.msgArray.length == 0) {
      this.refreshMsg()
    }
  }
}
</script>

<style>
  .mint-tab-container-wrap{
    height: 100%;
  }

  .mint-loadmore-content{
    margin-bottom: 7rem;
  }

</style>

<style lang="css" scoped>
  .body, .mint-loadmore{
    height: 100%;
  }

  .mint-loadmore{
    overflow: scroll;
  }

  .ul-order{
    width:90%;
    margin-left:5%;
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
    padding: 1rem 0rem;
    width:100%;
    overflow: hidden;
    border-top: 0.05rem solid #99CCFF;
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
    font-size: 0.9rem;
    padding-bottom: 1rem;
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
</style>
