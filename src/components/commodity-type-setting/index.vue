<template>
  <div class="body" style="height: 100%;">
    <mt-header title="商品分类设置">
      <router-link to="" slot="left">
        <mt-button icon="back" v-on:click="$router.go(-1)" >返回</mt-button>
      </router-link>
      <mt-button  slot="right" v-on:click="editItems(-1)">
        <i class="icon iconfont icon-tianjia"></i>
      </mt-button>
    </mt-header>

    <!--添加修改弹出层 -->
    <div class="shard" v-if="isEdit>0"></div>
    <div class="lay-body"  v-if="isEdit>0">
      <header class="mint-header"><h1 class="mint-header-title">{{ isEdit ==1 ? '添加分类':'修改分类'}}</h1></header>
      <mt-field label="分类名称" placeholder="请输入分类名称" v-model="modelType.name"></mt-field>
      <mt-field label="排序号" placeholder="请输入排序号" type="number" v-model="modelType.orderNum"></mt-field>
      <div class="lay-foot">
        <mt-button size="small" type="danger" v-on:click="cancel()">取消</mt-button> &nbsp;
        <mt-button size="small" type="primary" v-on:click="save()">确定</mt-button>
      </div>
    </div>

    <div v-for="(item,index) in commodityTypes"  class="type-item">
      <mt-cell :title="item.name">
        <span  style="margin-right:0.4rem;" v-on:click="deleteItems(item.id)" ><mt-badge size="small" type="error"><span class="badge">删除</span></mt-badge></span>
        <span  style="margin-right:0.4rem;" v-on:click="editItems(index)" ><mt-badge size="small"><span class="badge">编辑</span></mt-badge></span>
      </mt-cell>
    </div>

    <div class="no-items" v-if="commodityTypes.length===0">
      <p>还未添加商品分类</p>
    </div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast,MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      commodityTypes: [],
      // 0:未编辑 1:添加 2:修改
      isEdit: 0,
      modelType: {name: '', orderNum: 0, id: -1}
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    deleteItems: function (id) {
      let _this = this
      MessageBox.confirm('确认删除该商品分类吗?').then(action => {
        Tools.ajax("post", "commodityCategory/delete/"+id, null, function (res) {
          if(res.code==0){
            Toast("删除成功！")
            _this.loadItems()
          }
        })
      })
    },
    editItems: function (index) {
      let _this = this
      if (index === -1) {
        _this.isEdit = 1
        _this.modelType = {name: '', orderNum: 0, id: -1}
      } else {
        _this.isEdit = 2
        let selected = _this.commodityTypes[index]
        _this.modelType = {name: selected.name, orderNum: selected.orderNum, id: selected.id}
      }
    },
    cancel: function () {
      this.isEdit = 0
    },
    save: function () {
      let _this = this

      if (_this.modelType.name === '') {
        Toast('请输入类别名称')
        return null
      }

      if (_this.modelType.name.length > 20) {
        Toast('类别名称长度需小于20字符')
        return null
      }

      let subModel = {id: _this.modelType.id, name: _this.modelType.name, order: _this.modelType.orderNum}

      // 执行保存
      Tools.ajax("json","commodityCategory/", subModel, function (res) {
        // 刷新数据
        if (res.code === 0) {
          _this.cancel()
          _this.loadItems()
        }
      })
    },
    // 加载列表
    loadItems: function () {
      let _this = this
      Tools.ajax("get", "commodityCategory/", null, function (res) {
        if (res.code === 0 && res.data.length > 0) {
          let _commodityData = []
          res.data.forEach((item) => {
            _commodityData.push({name: item.name, id: item.id, orderNum: item.order})
          })
          _this.commodityTypes = _commodityData
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
    margin-top: 20%;
    text-align: center;
    color: #aaa;
  }
  .badge{
    font-size: 0.526rem;
  }
</style>
