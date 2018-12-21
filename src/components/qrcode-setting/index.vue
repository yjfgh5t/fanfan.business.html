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

    <div class="div-content">
      <div class="div-item" v-for="item in codeArray">
        <span class="span-name" v-text="item.title" v-if="item.title !== ''"></span>
        <img v-on:click="editItems(item)" class="code-img" :src="item.src" v-bind:id="item.id" />
        <div class="div-btn">
          <mt-button size="small" v-on:click="printCode(item)">打印点单码</mt-button>
          <mt-button size="small" v-on:click="saveImage(item)" type="primary" >保存点单码</mt-button>
        </div>
      </div>
    </div>

    <!--打印内容-->
    <div class="div-print" v-show="print.show" id="div-print-body">
      <div class="print-title" v-text="print.title"></div>
      <div class="print-name" v-text="print.numTitle"></div>
      <img class="print-img" v-on:load="printImgLoad" crossOrigin="Anonymous" :src="print.src" />
    </div>

    <div class="no-items" v-if="codeArray.length===0">
      <p>请点击右上角按钮添加点单码</p>
    </div>

    <!--弹出层-->
    <layer title="设置点单码别名" :show="showLayer" :complete="save" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content">
        <mt-field placeholder="请输点单码名称" v-model="model.title" length="8"></mt-field>
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
      print: {
        show: false,
        title: '扫码点单',
        numTitle: 'A65',
        src: '' //http://192.168.4.47:8081/api/info/qrCodeImg?context=lsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoeflsiejwoef&width=78'
      }
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    editItems: function (item) {
      let _this = this
      _this.showLayer = true
      _this.model = item === null ? {title: '', id: ''} : {title: item.title, id: item.id}
    },
    save: function () {
      if (this.model.title === '') {
        Toast('请输入客桌名称')
        return null
      }
      let subModel = {id: this.model.id, desc: this.model.title}
      this.showLayer = false
      // 执行保存
      this.submit(this, subModel)
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
    // 保存图片
    saveImage: function (item) {
      let that = this
      html2canvas(document.getElementById(item.id), {useCORS: true}).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png')
        // 执行保存图片
        Tools.saveImg(imgData.split(',')[1], that.print.numTitle + '.png', function (print) {
          Toast('二维码图片已经保存至您的相册')
        })
      })
    },
    // 打印二维码
    printCode: function (item) {
      let that = this
      that.print.numTitle = item.title
      that.print.src = item.src
      that.print.show = true
    },
    // 图片加载完成
    printImgLoad: function () {
      let that = this
      html2canvas(document.getElementById('div-print-body'), {useCORS: true}).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png')
        that.print.show = false
        // 执行打印
        Tools.print(imgData.split(',')[1], 'img', function (save) {
          Toast('打印成功')
        })
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
    margin-top: 20%;
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
    width: 58mm;
    margin: 2mm;
    text-align: center;
  }
  .print-title{
    text-align: center;
  }
  .print-name{
    text-align: right;
    padding-right: 4mm;
  }
  .print-img{
    width: 100%;
  }
</style>
