import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/views/HelloWorld'
import forgetPassword from '@/views/forgetPassword'
import index from '@/views/index'
// 商品管理
import search from '@/views/booksearch/search'
// 商品管理
import manage from '@/views/bookmanage/manage'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {allowBack: false}
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: forgetPassword,
      meta: {allowBack: false}
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      allowBack:false,
      children:[{
        path: '/booksearch/search',
        name: 'search',
        component: search,
        meta: {
          requireAuth: true,
          allowBack:false
      }
      },{
        path: '/bookmanage/manage',
        name: 'manage',
        component: manage,
        meta: {
          requireAuth: true,
          allowBack:false
      }
    }
    ]
    },

  ]
})
