import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

const store = createStore({
  plugins: [createPersistedState()],
  state() {
    return {}
  },
  mutations: {},
  actions: {},
  getters: {}
})

export default store