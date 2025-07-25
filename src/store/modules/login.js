//import axios from 'axios'
import { mockLogin, mockRegister, mockFetchCurrentUser } from '@/api/mockApi'
import router from '@/router'

const state = {
  user: null,
  token: localStorage.getItem('userToken') || null,
  loading: false,
  error: null,
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
  loading: (state) => state.loading,
  error: (state) => state.error,
  token: (state) => state.token,
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, message) {
    state.error = message
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('userToken', token)
    } else {
      localStorage.removeItem('userToken')
    }
  },
  SET_USER(state, user) {
    state.user = user
  },
  CLEAR_LOGIN_STATE(state) {
    // Mutation pour réinitialiser l'état de connexion
    state.user = null
    state.token = null
    localStorage.removeItem('userToken')
  },
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //const response = await axios.post('/login', credentials)
      // UTILISEZ mockLogin() AU LIEU DE axios.post('/login', ...)
      const response = await mockLogin(credentials.email, credentials.password)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER', response.data.user)
      return true
    } catch (err) {
      commit(
        'SET_ERROR',
        err.response?.data?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.',
      )
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //await axios.post('/register', userData)
      // UTILISEZ mockRegister() AU LIEU DE axios.post('/register', ...)
      await mockRegister(userData.username, userData.email, userData.password)
      commit('SET_ERROR', null)
      return true
    } catch (err) {
      commit(
        'SET_ERROR',
        err.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.",
      )
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    commit('CLEAR_LOGIN_STATE')
    // Si le backend a une route /logout pour invalider le token côté serveur, vous pouvez l'appeler ici:
    // axios.post('/logout').catch(error => console.error('Logout API error:', error));
    router.push('/login')
  },

  async fetchCurrentUser({ commit, state }) {
    if (!state.token) {
      commit('SET_USER', null)
      return
    }
    try {
      //const response = await axios.get('/user')
      // UTILISEZ mockFetchCurrentUser() AU LIEU DE axios.get('/user')
      const response = await mockFetchCurrentUser(state.token)
      commit('SET_USER', response.data.user)
    } catch (err) {
      commit('CLEAR_LOGIN_STATE')
      console.error("Impossible de récupérer l'utilisateur actuel:", err)
      router.push('/login')
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
