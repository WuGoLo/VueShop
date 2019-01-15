import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/views/login'
import Home from '@/components/views/home'
import Users from '@/components/views/user/users'
// 权限管理导入
import Autho from '@/components/views/rights/authority'
import Roles from '@/components/views/rights/roles'
// 商品管理导入
import GoodsList from '@/components/views/goods/goodslist'
import Params from '@/components/views/goods/goodsparams'
import categories from '@/components/views/goods/categories'
import Goodsadd from '@/components/views/goods/goodsadd'

import Order from '@/components/views/order/order'
import Reports from '@/components/views/reports/reports'
import {Message} from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    { name: 'login',
      path: '/login',
      component: login },
    { name: 'Home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'authority',
          path: '/rights',
          component: Autho
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods',
          path: '/goods',
          component: GoodsList
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: categories
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          name: 'orders',
          path: '/orders',
          component: Order
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to);
  // 判断是否是从登陆页面来
  if(to.name === 'login') {
    next();
  } else {
    // 不是从登陆页面来，判断有无token
    if(!localStorage.getItem('token')) {
      router.push({
        name: 'login'
      })
      Message.warning('请先登录！');
    } else {
      next();
    }
  }
})
export default router
