<template>
  <div class="flex-center" style="min-height: 100vh; padding: 30px">
    <div class="tasks-layout">
      <header class="header">
        <h1 class="header-title">
          Vos Tâches
          <span v-if="currentUser" class="username-highlight">{{ currentUser.username }}</span>
        </h1>
        <button
          @click="logout"
          class="btn btn-danger"
          style="width: auto; padding: 9px 12px; margin-left: 20px"
        >
          ⏻
        </button>
      </header>

      <h2 class="form-title" style="font-size: 1.8em; margin-bottom: 20px">
        Créer une nouvelle tâche
      </h2>
      <form @submit.prevent="handleAddTask" class="task-form">
        <input
          type="text"
          v-model="newTaskTitle"
          placeholder="Titre de la nouvelle tâche..."
          class="task-input"
          required
        />
        <button
          type="submit"
          :disabled="tasksLoading"
          class="btn btn-primary"
          :class="{ 'btn-disabled': tasksLoading }"
          style="width: auto; padding: 9px 12px; margin-left: 20px"
        >
          ✚
        </button>
      </form>

      <p v-if="tasksLoading" class="info-message">Chargement des tâches...</p>
      <p v-if="tasksError" class="error-message">{{ tasksError }}</p>

      <h2 class="form-title" style="font-size: 1.8em; margin-top: 40px; margin-bottom: 20px">
        Liste des tâches
      </h2>
      <ul v-if="allTasks.length > 0" class="task-list">
        <li v-for="task in allTasks" :key="task.id" class="task-item">
          <span :class="{ completed: task.completed }" class="task-title">{{ task.title }}</span>
          <div class="task-actions">
            <button
              @click="handleToggleTaskCompletion(task)"
              class="task-button toggle-complete"
              :class="{ completed: task.completed }"
            >
              {{ task.completed ? 'À faire' : 'Terminer' }}
            </button>
            <button @click="handleDeleteTask(task.id)" class="task-button delete">Supprimer</button>
          </div>
        </li>
      </ul>
      <p v-else class="info-message">Aucune tâche pour le moment. Ajoutez-en une !</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const newTaskTitle = ref('')

const currentUser = computed(() => store.getters['login/currentUser'])

const allTasks = computed(() => store.getters['tasks/allTasks'])
const tasksLoading = computed(() => store.getters['tasks/tasksLoading'])
const tasksError = computed(() => store.getters['tasks/tasksError'])

async function handleAddTask() {
  if (!newTaskTitle.value.trim()) return
  const success = await store.dispatch('tasks/addTask', newTaskTitle.value)
  if (success) {
    newTaskTitle.value = ''
  }
}

function handleToggleTaskCompletion(task) {
  store.dispatch('tasks/toggleTaskCompletion', task)
}

function handleDeleteTask(taskId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    store.dispatch('tasks/deleteTask', taskId)
  }
}

function logout() {
  store.dispatch('login/logout')
}

onMounted(() => {
  if (store.getters['login/isAuthenticated']) {
    store.dispatch('tasks/fetchTasks')
  }
})
</script>
