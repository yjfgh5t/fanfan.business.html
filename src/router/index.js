import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/default'
import ShopSetting from '@/components/shop-setting'
import PrintSetting from '@/components/print-setting'
import CommoditySetting from '@/components/commodity-setting'
import CommodityTypeSetting from '@/components/commodity-type-setting'
import CommodityEdit from '@/components/commodity-edit'
import DeskSetting from '@/components/desk-setting'
import UserSetting from '@/components/user-setting'
import Login from '@/components/login'
import Register from '@/components/register'
import Authorization from '@/components/authorization'
import PaySetting from '@/components/pay-setting'

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
      path: '/shopSetting',
      name: 'shopSetting',
      component: ShopSetting
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
      path: '/userSetting',
      name: 'userSetting',
      component: UserSetting
    },
    {
      path: '/paySetting',
      name: 'paySetting',
      component: PaySetting
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register/:type',
      name: 'register',
      component: Register
    },
    {
      path: '/authorization',
      name: 'authorization',
      component: Authorization
    }
  ]
})
