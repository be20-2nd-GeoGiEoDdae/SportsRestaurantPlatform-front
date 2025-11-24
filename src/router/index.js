import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignupAdditional from '@/views/auth/SignupAdditional.vue'
import SignupComplete from '@/views/auth/SignupComplete.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup/additional',
      name: 'SignupAdditional',
      component: SignupAdditional
    },
    {
      path: '/signup/complete',
      name: 'SignupComplete',
      component: SignupComplete
    }
  ],
})

export default router
