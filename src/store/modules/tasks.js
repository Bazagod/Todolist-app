//import axios from 'axios'
// IMPORTEZ LE MOCK API ET LA LOGIQUE DE LOGIN POUR OBTENIR L'ID UTILISATEUR
import {
  mockFetchTasks,
  mockAddTask,
  mockToggleTaskCompletion,
  mockDeleteTask,
} from '@/api/mockApi'
import store from '@/store' // Importe le store global pour accéder au module login
const state = {
  tasks: [],
  loading: false,
  error: null,
}

const getters = {
  allTasks: (state) => state.tasks,
  tasksLoading: (state) => state.loading,
  tasksError: (state) => state.error,
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, message) {
    state.error = message
  },
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  ADD_TASK(state, task) {
    state.tasks.push(task)
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.tasks.findIndex((task) => task.id === updatedTask.id)
    if (index !== -1) {
      state.tasks.splice(index, 1, updatedTask)
    }
  },
  REMOVE_TASK(state, taskId) {
    state.tasks = state.tasks.filter((task) => task.id !== taskId)
  },
}

const actions = {
  async fetchTasks({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //const response = await axios.get('/tasks')
      // Pour le mock, on simule l'ID utilisateur 1.
      // Dans un vrai scénario, vous récupéreriez l'ID de l'utilisateur connecté depuis le store 'login'.
      const userId = store.getters['login/currentUser']?.id || 1 // Utilise l'ID réel si dispo, sinon 1 pour le mock
      const response = await mockFetchTasks(userId)
      commit('SET_TASKS', response.data)
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || 'Erreur lors du chargement des tâches.')
      console.error(err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addTask({ commit }, title) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //const response = await axios.post('/tasks', { title })
      const userId = store.getters['login/currentUser']?.id || 1
      const response = await mockAddTask(title, userId)
      commit('ADD_TASK', response.data)
      return true
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || "Erreur lors de l'ajout de la tâche.")
      console.error(err)
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async toggleTaskCompletion({ commit }, task) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //const updatedTask = { ...task, completed: !task.completed }
      //const response = await axios.put(`/tasks/${task.id}`, updatedTask)
      const userId = store.getters['login/currentUser']?.id || 1
      const response = await mockToggleTaskCompletion(task.id, !task.completed, userId)
      commit('UPDATE_TASK', response.data)
    } catch (err) {
      commit(
        'SET_ERROR',
        err.response?.data?.message || 'Erreur lors de la mise à jour de la tâche.',
      )
      console.error(err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteTask({ commit }, taskId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      //await axios.delete(`/tasks/${taskId}`)
      const userId = store.getters['login/currentUser']?.id || 1
      await mockDeleteTask(taskId, userId)
      commit('REMOVE_TASK', taskId)
    } catch (err) {
      commit(
        'SET_ERROR',
        err.response?.data?.message || 'Erreur lors de la suppression de la tâche.',
      )
      console.error(err)
    } finally {
      commit('SET_LOADING', false)
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
