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
        <mt-button size="little" type="danger" v-on:click="cancel()">取消</mt-button> &nbsp;
        <mt-button size="little" type="primary" v-on:click="save()">确定</mt-button>
      </div>
    </div>

    <div v-for="item in commodityTypes"  class="type-item">
      <mt-cell :title="item.name">
        <span  style="margin-right:0.4rem;" v-on:click="deleteItems(item.id)" ><mt-badge size="small" type="error"><span class="badge">删除</span></mt-badge></span>
        <span  style="margin-right:0.4rem;" v-on:click="editItems(item.id)" ><mt-badge size="small"><span class="badge">编辑</span></mt-badge></span>
      </mt-cell>
    </div>

    <div class="no-items" v-if="commodityTypes.length===0">
      <p>还未添加商品分类</p>
    </div>

  </div>
</template>

<script>
import Tools from '../../commons/tools/index'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      commodityTypes: [{name: '分类1', id: 1, orderNum: 1}, {name: '分类2', id: 2, orderNum: 2}, {name: '分类3', id: 3, orderNum: 5}, {name: '分类4', id: 4, orderNum: 4}, {name: '分类5', id: 4, orderNum: 4}],
      // 0:未编辑 1:添加 2:修改
      isEdit: 0,
      modelType: {name: '', orderNum: 0, id: -1}
    }
  },
  methods: {
    deleteItems: function () {
      Toast("删除")
    },
    editItems: function (index) {
      let _this = this
      if (index === -1) {
        _this.isEdit = 1
        _this.modelType = {name: '', orderNum: 0, id: -1}
      } else {
        _this.isEdit = 2
        _this.modelType =  _this.commodityTypes[index]
      }
    },
    cancel: function () {
      this.isEdit = 0
    },
    save: function () {

      if (this.modelType.name === '') {
        Toast('请输入类别名称')
        return null
      }

      if (this.modelType.name.length > 20) {
        Toast('类别名称长度需小于20字符')
        return null
      }
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
