import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import './assets/css/global.css'
import * as filters from './assets/filters'

//admin
import '@/plugins/element'
import '@/plugins/avue'
import vuetify from '@/plugins/vuetify'
Vue.config.productionTip = false

// Vue.prototype.$http = axios.create({
//   baseURL:"http://96.45.160.168:5000",

// });
// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = 'http://localhost:5000';

//配置图片上传avue $httpajax
Vue.prototype.$httpajax = axios
Vue.prototype.$http = axios

//注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')











// axios.defaults.baseURL = 'http://96.45.160.168:5000'
// axios.interceptors.request.use(config => {
//   // console.log(config)
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })


