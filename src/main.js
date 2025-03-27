// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './utils/drag.js';
import 'element-ui/lib/theme-chalk/index.css'
// 引入icon
import './assets/icon/iconfont.css'
//引入axios并挂载
import axios from "axios"
Vue.prototype.$axios = axios 
//axios.defaults.baseURL = ''        //关键代码
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
