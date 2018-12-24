<template>
  <div class="body" style="height: 100%;">
    <mt-header title="点单码设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.back(-1)" >返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="editItems(null)">
        <i class="icon iconfont icon-tianjia"></i>
      </mt-button>
    </mt-header>
    <div class="no-items">
      <p>使用微信或支付宝扫以下二维码即可点单哦</p>
    </div>
    <div class="div-content">
      <div class="div-item" v-for="item in codeArray">
        <span class="span-name" v-text="item.title" v-if="item.title !== ''"></span>
        <img v-on:click="editItems(item)" class="code-img" :src="item.src" v-bind:id="item.id" />
        <div class="div-btn">
          <mt-button size="small" v-on:click="showTemplate(item, 1)">打印点单码</mt-button>
          <mt-button size="small" v-on:click="showTemplate(item, 2)" type="primary" >保存点单码</mt-button>
        </div>
      </div>
    </div>

    <div class="div-temp">
      <!--打印内容-->
      <div class="div-print" v-if="template.printShow" id="div-print-body">
        <div class="print-title" v-text="template.title"></div>
        <div class="print-name" v-text="template.numTitle"></div>
        <img class="print-img" v-on:load="imgLoad(1)" crossOrigin="Anonymous" :src="template.src" />
      </div>
      <!--保存的图片-->
      <div class="div-code-img" v-if="template.codeImgShow" id="div-code-img-body">
        <div class="number" v-text="template.numTitle"></div>
        <div class="title" v-text="template.shopName"></div>
        <div class="line" v-text="template.title"></div>
        <img class="img" v-on:load="imgLoad(2)" :src="template.src" crossOrigin="Anonymous"  />
        <div class="white-border"></div>
        <div class="desc">
          <b>温馨提示：</b>请耐心等待制作，美味佳肴马上上桌
        </div>
      </div>
      <!--空白遮罩层-->
      <div class="div-temp-empty" v-if="template.printShow || template.codeImgShow"></div>
    </div>

    <!--弹出层-->
    <layer title="设置点单码编号" :show="showLayer" :complete="save" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content">
        <mt-field placeholder="请输点单码编号（如：A1）" v-model="model.title" length="5"></mt-field>
      </div>
    </layer>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
import layer from '@/tools/layer'
import html2canvas from 'html2canvas'
export default {
  components: {
    layer
  },
  data () {
    return {
      codeArray: [
        // {id: '1', src: 'http://192.168.4.47:8081/api/info/qrCodeImg?context=lsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoef&width=78', title: '123'}
      ],
      // 0:未编辑 1:添加 2:修改
      showLayer: false,
      model: {title: '', id: '', src: ''},
      template: {
        printShow: false,
        codeImgShow: false,
        title: '扫码点单',
        numTitle: 'A65',
        shopName: '饭饭点餐',
        src: '' // http://192.168.1.10:8081/api/info/qrCodeImg?context=lsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoef&width=78'
      }
    }
  },
  mounted () {
    let that = this
    // 加载数据
    this.loadItems()
    // 获取店铺名称
    Tools.getKeyVal(Tools.globalKey.shopName, function (name) {
      that.template.shopName = name
    })
  },
  methods: {
    editItems: function (item) {
      let _this = this
      _this.showLayer = true
      _this.model = item === null ? {title: '', id: ''} : {title: item.title, id: item.id}
    },
    save: function (confirm) {
      if (confirm) {
        if (this.model.title === '') {
          Toast('请输入客桌名称')
          return null
        }
        let subModel = {id: this.model.id, desc: this.model.title}
        // 执行保存
        this.submit(this, subModel)
      }
      this.showLayer = false
    },
    // 提交保存
    submit: function (_this, model) {
      // 执行保存
      Tools.ajax('json', 'qrcode/save', model, function (res) {
        // 刷新数据
        if (res.code === 0) {
          Toast('保存成功')
          _this.loadItems()
        }
      })
    },
    // 加载列表
    loadItems: function () {
      let _this = this
      Tools.ajax('get', 'qrcode/list', null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let tempData = []
          res.data.forEach((item) => {
            tempData.push({
              title: item.desc || '',
              id: item.id,
              src: Tools.global.httpPath + 'info/qrCodeImg?width=287&context=' + encodeURIComponent(Tools.global.httpPath + 'info/qrcode?qrcode=' + item.id) + '&v=' + Math.random()
            })
          })
          _this.codeArray = tempData
        }
      })
    },
    // 显示模板
    showTemplate: function (item, type) {
      let that = this
      that.template.numTitle = item.title
      that.template.src = item.src
      if (type === 1) {
        that.template.printShow = true
      } else {
        that.template.codeImgShow = true
      }
      Tools.loading(true)
    },
    // 图片加载完成
    imgLoad: function (type) {
      let that = this
      let dom = document.getElementById(type === 1 ? 'div-print-body' : 'div-code-img-body')
      html2canvas(dom, {useCORS: true}).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png')
        Tools.loading(false)
        if (type === 1) {
          that.template.printShow = false
          // 执行打印
          Tools.print(imgData.split(',')[1], 'img', function (complate) {
            if (complate === 'true') {
              Toast('打印成功')
            }
          })
        } else {
          that.template.codeImgShow = false
          // 执行保存
          Tools.saveImg(imgData.split(',')[1], that.template.numTitle + '.png', function (save) {
            Toast('图片已保存至您的相册')
          })
        }
      })
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

  .lay-body{
    width: 16rem;
    position: fixed;
    z-index: 2;
    background: white;
    left:50%;
    margin-left: -8rem;
    top: 15%;
    padding-bottom: 1rem;
  }
  .lay-foot{
    height: 10%;
    text-align: right;
    padding-right: 1rem;
  }
  .no-items{
    margin-top: 0.4rem;
    text-align: center;
    color: #aaa;
  }
  .badge{
    font-size: 0.526rem;
  }
  .mint-cell-title .icon{
    position: relative;
    top: 0.2rem;
  }
  .icon-erweima{
    color: #26a2ff;
  }
  .div-content{
    margin: 1rem 2rem;
  }
  .div-item{
    border: 0.05rem solid #ccc;
    position: relative;
    margin-top: 1.6rem;
  }
  .span-name{
    position: absolute;
    top: -1.2rem;
    left: -0.05rem;
    display: inline-block;
    width: 6rem;
    height: 1.2rem;
    padding: 0rem 0rem 0rem 0.2rem;
    line-height: 1.2rem;
    background: #26a2ff;
    border-radius: 0 8rem 0rem 0rem;
    border: 0.05rem solid #ccc;
    border-bottom: 0;
    color: white;
  }
  .div-btn{
    margin-bottom: 0.4rem;
    text-align: center;
  }
  .code-img{
    width:100%;
  }
  .div-print{
    width: 360px;
    margin: 10px;
    text-align: center;
    padding-bottom: 50px;
  }
  .print-title{
    text-align: center;
    font-size: 36px;
  }
  .print-name{
    text-align: right;
    padding-right: 40px;
    font-size: 32px;
  }
  .print-img{
    width: 100%;
  }

  .div-code-img{
    width: 18rem;
    background-color: #3fa1fd;
    overflow: hidden;
    position: relative;
  }
  .div-code-img .title{
    width: 100%;
    text-align: center;
    color: white;
    margin-top: 1rem;
    font-size: 1.2rem;
  }
  .div-code-img .line{
    margin-top: 1rem;
    width: 80%;
    margin-left: 10%;
    color: #3fa1fd;
    background-color: white;
    border-radius: 0.4rem;
    text-align: center;
    height: 1.6rem;
    line-height: 1.8rem;
    font-size: .9rem;
  }

  .div-code-img .img{
    margin-top: 1rem;
    width: 80%;
    margin-left: 10%;
    position: relative;
    z-index: 2;
  }

  .div-code-img .white-border{
    background-color: #3fa1fd;
    height: 5rem;
    width: 110%;
    border-radius: 50%;
    position: absolute;
    bottom: 2.5rem;
    z-index: 1;
    left: -5%;
  }

  .div-code-img .desc{
    padding-top: 2.4rem;
    height: 1.6rem;
    width: 100%;
    background-color: white;
    text-align: center;
    font-size: 0.73rem;
  }
  .div-code-img .number{
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    background: white;
    color: #3fa1fd;
    padding: 0rem 0.4rem;
    border-radius: 0.4rem;
    font-size: 0.6rem;
    height: 0.9rem;
    line-height: 1.08rem;
    text-align: center;
  }
  .div-temp{
    position: relative;
  }
  .div-temp-empty {
    position: absolute;
    width: 24rem;
    height: 20rem;
    z-index: 5;
    background-color: white;
    top: 0;
    left: 0;
  }
</style>
