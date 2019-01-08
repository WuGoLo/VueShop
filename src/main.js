// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from '@/plugins/http'
import breadCrumb from '@/plugins/breadcrumb'
import ElementUi from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
// 关于import导入各种包的问题
Vue.use(ElementUi)
Vue.use(http)
// 是否显示提示
Vue.config.productionTip = false

Vue.component('my-bread', breadCrumb)

Vue.filter('fmtData', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
