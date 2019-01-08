import axios from 'axios'

const httpHelper = {}

httpHelper.install = function (Vue) {
  // 配置基准url
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    if(config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers.Authorization = AUTH_TOKEN;
      // console.log(config);
    }
  return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  // Vue添加实例方法
  Vue.prototype.$http = axios
}

export default httpHelper
