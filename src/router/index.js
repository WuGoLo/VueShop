import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/home/users'

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
          path: '/authority',
          component: Autho
        }
      ]
    }
  ]
})
