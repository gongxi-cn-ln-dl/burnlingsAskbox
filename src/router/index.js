import Askbox from '../views/Askbox.vue'
import Login from '../views/Login.vue'
import Setting from '../views/Settings.vue'

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { markRaw, ref, shallowRef } from 'vue'
import { getUserNameByUserId } from '../api/getdata'
const User = {
  template: '<div>不知道放点啥了 总之就先空着吧</div>',
}

const router = createRouter({
  history: createWebHistory(),
  // mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: User
    },
    {
      path: '/Askbox/:id',
      name: 'Askbox',
      component: Askbox,
      props: route => ({ key: route.params.id })
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/settings',
      name: 'settings',
      component: Setting
    }
  ],
})
export default router