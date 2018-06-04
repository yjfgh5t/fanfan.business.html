import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/Default'
import Test from '@/components/Test'
import OrderDetail from '@/components/OrderDetail'
Vue.use(Router)
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
