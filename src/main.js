import { createApp } from 'vue'

import './assets/scss/main.scss'
import store from './store/index.js'
import router from './router.js'

import App from './App.vue'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
