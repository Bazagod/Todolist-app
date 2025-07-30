import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.0.107:8000/api'

axios.interceptors.request.use(
  (config) => {
    const token = store.getters['login/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (router.currentRoute.value.name !== 'Login') {
        store.dispatch('login/logout')
        alert('Votre session a expiré ou est invalide. Veuillez vous reconnecter.')
        router.push('/login')
      }
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
