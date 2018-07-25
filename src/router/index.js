import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/default'
import PrintSetting from '@/components/print-setting'
import CommoditySetting from '@/components/commodity-setting'
import CommodityTypeSetting from '@/components/commodity-type-setting'
import CommodityEdit from '@/components/commodity-edit'
import DeskSetting from '@/components/desk-setting'
import Login from '@/components/login'

Vue.use(Router)
Vue.use(require('vue-moment'))

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default',
      component: Default,
      meta: {
        keepAlive: true
      }

    },
    {
      path: '/printSetting',
      name: 'printSetting',
      component: PrintSetting
    },
    {
      path: '/commoditySetting',
      name: 'commoditySetting',
      component: CommoditySetting
    },
    {
      path: '/commodityTypeSetting',
      name: 'commodityTypeSetting',
      component: CommodityTypeSetting
    },
    {
      path: '/commodityEdit/:id',
      name: 'commodityEdit',
      component: CommodityEdit
    },
    {
      path: '/deskSetting',
      name: 'deskSetting',
      component: DeskSetting
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
