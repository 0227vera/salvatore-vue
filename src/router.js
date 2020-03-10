import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/three',
      name: 'three',
      component: () => import('@/views/threeJS')
    },
    {
      path: '/annotation',
      name: 'Annotation',
      component: () => import('@/views/Annotation')
    },
    {
      path: '/props',
      name: 'props',
      component: () => import('@/views/props/father')
    },
    {
      path: '/slot',
      name: 'slot',
      component: () => import('@/views/slot')
    }
  ]
})
