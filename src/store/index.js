import { createStore } from 'vuex'
import login from './modules/login'
import tasks from './modules/tasks'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},

  modules: {
    login,
    tasks,
  },
})
