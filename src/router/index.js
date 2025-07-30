import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TasksView from '@/views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeRedirect',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: TasksView,
      meta: { requiresAuth: false },
    },

    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters['login/isAuthenticated']
  const currentUser = store.getters['login/currentUser']

  if (!currentUser && isAuthenticated) {
    await store.dispatch('login/fetchCurrentUser')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next('/tasks')
  } else {
    next()
  }
})

export default router
