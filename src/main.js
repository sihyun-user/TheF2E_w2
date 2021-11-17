import { createApp } from 'vue'

import './assets/scss/main.scss'
import store from './store/index.js'
import router from './router.js'

import BaseSpinner from './compontets/ui/BaseSpinner.vue'

import App from './App.vue'

const app = createApp(App)

app.use(store)
app.use(router)

app.component('base-spinner', BaseSpinner)

app.mount('#app')
