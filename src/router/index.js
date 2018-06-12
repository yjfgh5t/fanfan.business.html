import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/default/default'
import Test from '@/components/test'
import OrderDetail from '@/components/order-detail'
Vue.use(Router)
Vue.use(require('vue-moment'))
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Default',
      component: Default
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/orderDetail/:orderId',
      name: 'OrderDetail',
      component: OrderDetail
    }
  ]
})
