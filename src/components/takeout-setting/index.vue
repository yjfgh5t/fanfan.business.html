<template>
  <div class="body" style="height: 100%">
    <mt-header fixed  title="外卖设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="height: 50px;"></div>

    <!--外卖设置-->
    <mt-cell title="开启外卖" class="mint-field" >
      <mt-switch v-model="model.takeout">{{model.takeout?'是':'否'}}</mt-switch>
    </mt-cell>
    <mt-field label="联系电话" placeholder="请输入商家联系电话" type="number" length="11" v-model="model.telephone"></mt-field>
    <mt-field label="店铺地址" type="textarea" placeholder="请设置店铺具体位置" disabled="disabled" @click.native.capture="setAddress" v-model="model.address">
      <solt clas> <i class="icon iconfont icon-iconfonti"></i></solt>
    </mt-field>
    <mt-field label="配送范围" placeholder="请输入配送范围" type="number" length="7" v-model="model.deliveryRange">
      <solt>公里</solt>
    </mt-field>
    <mt-field label="配送费" placeholder="请输入配送费" type="number" length="7" v-model="model.deliveryCost">
      <solt>元</solt>
    </mt-field>
    <mt-field label="起订价格" placeholder="请输入起订价格" type="number" length="7" v-model="model.minOrderPrice">
      <solt>元</solt>
    </mt-field>

    <!--配送人员设置-->
    <div class="cell-title">配送员设置</div>
    <div class="div-guige">
      <ul class="ul-table">
        <li>
          <ul class="ul-tr ul-th">
            <li>默认</li>
            <li>配送员</li>
            <li>联系电话</li>
            <li>操作</li>
          </ul>
        </li>
        <li v-for="item in deliveryArray">
          <ul class="ul-tr">
            <li v-bind:class="item.isDefault?'active':''" v-on:click="setDefaultDelivery(item.id)" > <i class="icon iconfont icon-gouxuan"></i> </li>
            <li v-text="item.name"></li>
            <li v-text="item.tel"></li>
            <li class="li-del"> <span v-on:click="deleteDelivery(item, $index)">删除</span> <span v-on:click="editDelivery(item)">修改</span></li>
          </ul>
        </li>
        <li class="li-bottom" v-on:click="editDelivery"> 点击添加配送员 </li>
      </ul>
    </div>
    <br />
    <div style="text-align: center; margin-bottom: 1rem;margin-top: 0.6rem;">
      <mt-button type="primary" plain="true" size="normal" style="font-size: 0.66rem;padding: 0rem 2rem;" v-on:click="save">保 存</mt-button>
    </div>
    <!--配送员员弹出层-->
    <layer title="添加配送员" :show="showDelivery" :complete="sureAddDelivery" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content">
        <mt-field label="姓名" placeholder="请输入配送员姓名" v-model="deliveryModel.name" length="16"></mt-field>
        <mt-field label="手机号" placeholder="请输入配送员手机号" v-model="deliveryModel.tel" length="11"></mt-field>
      </div>
    </layer>

    <!--地图选址-->
    <layer title="设置店铺地址" :show="mapModel.showMapLayer" :complete="sureSetAddress" tempStyle="width:16rem;margin-left:-8rem;">
      <div slot="content">
        <div id="div-map" style="width: 100%;height: 16rem"></div>
        <div class="div-selected-addr" v-text="mapModel.address"></div>
      </div>
    </layer>
  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast,MessageBox } from 'mint-ui'
import MtButton from '../../../node_modules/mint-ui/packages/button/src/button.vue'
import MtField from '../../../node_modules/mint-ui/packages/field/src/field.vue'
import layer from '@/tools/layer'
export default {
  components: {
    MtField,
    MtButton,
    layer
  },
  data () {
    return {
      model: {
        id: -1,
        takeout: false,
        deliveryRange: 5,
        deliveryCost: 0,
        telephone: '',
        lat: '',
        lng: '',
        minOrderPrice: 0,
        address: ''
      },
      deliveryArray: [],
      deliveryModel: {id: -1, isDefault: false, name: '', tel: ''},
      showDelivery: false,
      mapModel: {
        showMapLayer: false,
        address: '',
        lat: '',
        lng: ''
      }
    }
  },
  mounted () {
    this.loadItem()
    this.loadDelivery()
    this.initMapDocument()
  },
  methods: {
    // 保存
    save: function () {
      let errorText = this.validate()
      if (errorText !== '') {
        return Toast(errorText)
      }
      let _this = this
      // 提交
      Tools.ajax('json', 'shop/', {
        id: _this.model.id,
        takeout: _this.model.takeout,
        deliveryRange: _this.model.deliveryRange,
        deliveryCost: _this.model.deliveryCost,
        telephone: _this.model.telephone,
        lat: _this.model.lat,
        lng: _this.model.lng,
        minOrderPrice: _this.model.minOrderPrice,
        address: _this.model.address
      }, function (res) {
        if (res.code === 0) {
          _this.model.id = res.data
          Toast('保存成功')
        }
      })
    },
    // 加载数据
    loadItem: function () {
      let _this = this
      // 获取信息
      Tools.ajax('get', 'shop/' + _this.model.id, null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.model = {
            id: res.data.id,
            minOrderPrice: res.data.minOrderPrice,
            address: res.data.address,
            takeout: res.data.takeout,
            deliveryRange: res.data.deliveryRange,
            deliveryCost: res.data.deliveryCost,
            telephone: res.data.telephone,
            lat: res.data.lat,
            lng: res.data.lng
          }
        }
      })
    },
    // 加载配送员
    loadDelivery: function () {
      let _this = this
      // 获取信息
      Tools.ajax(Tools.method.get, 'delivery/list', null, function (res) {
        if (res.code === 0 && res.data !== null) {
          _this.deliveryArray = res.data.map(function (item) {
            return {
              id: item.id,
              name: item.name,
              tel: item.tel,
              isDefault: item.isDefault
            }
          })
        }
      })
    },
    // 验证
    validate: function () {
      if (this.model.telephone === '') {
        return '请输入商家联系电话'
      }
      if (isNaN(this.model.deliveryRange)) {
        return '请输入配送范围'
      }
      if (isNaN(this.model.deliveryCost)) {
        return '请输入配送费'
      }
      if (isNaN(this.model.minOrderPrice)) {
        return '起订价格输入有误'
      }
      if (this.deliveryArray.length === 0) {
        return '请添加一个配送员'
      }
      return ''
    },
    // 删除对象
    deleteDelivery: function (item, index) {
      if (item.isDefault) {
        return Toast('默认配送员不可删除')
      }
      let _this = this
      MessageBox.confirm('确认删除该配送员吗', '系统提示', {
        confirmButtonText: '确定'
      }).then(action => {
        if (action === 'confirm') {
          Tools.ajax(Tools.method.post, 'delivery/delete', { id: item.id }, function (res) {
            if (res.code === 0 && res.data) {
              _this.deliveryArray.splice(index, 1)
            } else {
              Toast('删除失败，请重试')
            }
          })
        }
      })
    },
    // 添加配送员
    editDelivery: function (model) {
      this.deliveryModel = model.id ? model : {id: -1, name: '', tel: '', isDefault: false}
      this.showDelivery = true
    },
    // 确认添加配送员
    sureAddDelivery: function (confirm) {
      if (confirm) {
        let _this = this
        let model = this.deliveryModel
        if (model.name === '') {
          return Toast('请输入配送员姓名')
        }
        if (model.tel === '' || isNaN(model.tel) || model.tel.length !== 11) {
          return Toast('请输入配送员电话')
        }
        // 设置一个为默认配送员
        if (_this.deliveryArray.length === 0) {
          model.isDefault = true
        }
        // 添加配送员
        Tools.ajax(Tools.method.json, 'delivery/save', model, function (res) {
          if (res.code === 0 && res.data) {
            _this.loadDelivery()
          } else {
            Toast('添加失败，请重试')
          }
        })
      }
      this.showDelivery = false
    },
    // 设置默认配送员
    setDefaultDelivery: function (id) {
      let _this = this
      // 添加配送员
      Tools.ajax(Tools.method.post, 'delivery/default', {id: id}, function (res) {
        if (res.code === 0 && res.data) {
          _this.loadDelivery()
        } else {
          Toast('添加失败，请重试')
        }
      })
    },
    // 初始加载文档
    initMapDocument: function () {
      if (document.getElementById('script-map') === null) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://webapi.amap.com/maps?v=1.4.11&key=c21e6eea975fae7d63fb6f43969ccee1&plugin=AMap.ToolBar'
        script.id = 'script-map'
        script.ansy = true
        document.head.appendChild(script)
      }
      window.setTimeout(function () {
        if (document.getElementById('script-map-ui') === null) {
          var scriptUI = document.createElement('script')
          scriptUI.type = 'text/javascript'
          scriptUI.src = 'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11'
          script.id = 'script-map-ui'
          document.head.appendChild(scriptUI)
        }
      }, 2000)
    },
    // 设置地址
    setAddress: function () {
      let _that = this
      // 创建地图
      this.mapModel.showMapLayer = true
      this.mapModel.lat = this.model.lat
      this.mapModel.lng = this.model.lng
      this.mapModel.address = this.model.address
      window.setTimeout(function () {
        window.AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
          let position = {lng: _that.mapModel.lng, lat: _that.mapModel.lat}
          var map = new window.AMap.Map('div-map', {
            resizeEnable: true,
            zoom: 12
          })
          // 拖拽marker
          var positionPicker = new PositionPicker({mode: 'dragMap', map: map})
          // 拖拽成功
          positionPicker.on('success', function (positionResult) {
            console.log(positionResult)
            _that.mapModel.lng = positionResult.position.lng
            _that.mapModel.lat = positionResult.position.lat
            _that.mapModel.address = positionResult.address
          })
          positionPicker.on('fail', function (positionResult) {
            console.log(positionResult)
          })
          // 获取当前位置
          window.AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new window.AMap.Geolocation({
              // 是否使用高精度定位，默认:true
              enableHighAccuracy: true,
              // 超过10秒后停止定位，默认：5s
              timeout: 10000,
              // 定位按钮的停靠位置
              buttonPosition: 'RB',
              // 显示定位圈
              showCircle: false,
              showMarker: false,
              // 定位成功后是否自动调整地图视野到定位点
              zoomToAccuracy: true
            })
            map.addControl(geolocation)
            geolocation.getCurrentPosition(function (status, result) {
              if (status === 'complete') {
                _that.mapModel.lng = result.position.lng
                _that.mapModel.lat = result.position.lat
                _that.mapModel.address = result.formattedAddress
              }
              positionPicker.start()
              map.setZoom(16)
              map.panBy(0, 1)
              map.addControl(new window.AMap.ToolBar({
                liteStyle: true
              }))
            })
          })
        })
      }, 300)
    },
    sureSetAddress: function (confirm) {
      this.mapModel.showMapLayer = false
      if (confirm) {
        this.model.lat = this.mapModel.lat
        this.model.lng = this.mapModel.lng
        this.model.address = this.mapModel.address
      }
    }
  }
}
</script>
<style>
  .mint-switch-core{
    width: 42px;
    height:25px;
  }
  .mint-switch-core::before{
    width: 40px;
    height:23px;
  }
  .mint-switch-core::after{
    width: 23px;
    height: 23px;
  }
  .mint-switch-input:checked + .mint-switch-core::after{
    transform: translateX(17px);
  }
  .icon-gouxuan{
    color: #cccccc;
  }
  .active .icon-gouxuan{
    color: #26a2ff;
  }
  .mint-field-core:disabled{
    background-color: white;
  }
</style>
<style type="text/css" scoped>

  .cell-select{
    background-color: white;
    margin-right: 1rem;
  }

  .cell-title{
    background: #eee;padding: 10px  10px 0px 10px;color:#aaa;
  }

  .img{
    width: 4rem;
    height: 4rem;
    display: block;
    float: left;
    border-radius: 0.4rem;
  }
  .span-add{
    border: 1px solid #26a2ff;
    font-size: 0.666rem;
    padding: 0.2rem;
    color: #26a2ff;
    border-radius: 0.2rem;
  }
  .span-add .icon{
    font-size: 0.666rem;
  }
  .add-img{
    position: absolute;
    right: 0.6rem;
  }

  .cell-title{
    background: #eee;padding: 10px  10px 0px 10px;color:#aaa;
  }
  /**配送员**/
  .ul-table{
    padding: 0 0.6rem;
    list-style: none;
  }

  .ul-table > li{
    border-bottom: 0.01rem solid #cccccc;
    line-height: 2.6rem;
    overflow:auto;
  }
  .ul-table > li:last-child{
    border-bottom: none;
  }

  .li-bottom{
    text-align: center;
    color: #cccccc;
  }

  ul-tr{
    width:100%;
    overflow: hidden;
    list-style: none;
  }
  .ul-tr.ul-th li{
    color: #5a5a5a;
  }
  .ul-tr li{
    float: left;
    width:30%;
    overflow: hidden;
    line-height: 2.6rem;
    color: #5a5a5a;
    text-align: center;
  }
  .ul-tr li:first-child{
    width:10%;
  }
  .ul-tr li.li-del{
    color: orangered;
  }
  .div-selected-addr{
    overflow: hidden;
    padding-top: 0.2rem;
    color: #5e5e5e;
  }
</style>
