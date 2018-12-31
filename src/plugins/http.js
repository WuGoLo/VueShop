import axios from 'axios'

const httpHelper = {}

httpHelper.install = function (Vue) {
  // 配置基准url
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
  // Vue添加实例方法
  Vue.prototype.$http = axios
}

export default httpHelper