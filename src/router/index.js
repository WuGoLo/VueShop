import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/home/users'
import Autho from '@/components/home/authority'
import Roles from '@/components/home/roles'

Vue.use(Router)

export default new Router({
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
          path: '/autho',
          component: Autho
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
})
