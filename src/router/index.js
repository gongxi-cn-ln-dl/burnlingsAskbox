import Askbox from '../views/Askbox.vue'
import Login from '../views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { markRaw, ref, shallowRef } from 'vue'

const User = {
  template: '<div>User</div>',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ],
})

export default router