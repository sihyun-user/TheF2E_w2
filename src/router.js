import { createRouter, createWebHistory } from 'vue-router'

import Bikeways from './pages/Bikeways.vue'
import Bikes from './pages/Bikes.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/bikes' },
    { path: '/bikeways', component: Bikeways },
    { path: '/bikes', component: Bikes },
    { path: '/:notFound(.*)', redirect: '/bikes' }
  ]
})

export default router