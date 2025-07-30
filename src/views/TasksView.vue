<template>
  <div class="task-view">
    <div class="tasks-container">
      <!-- Header -->
      <header class="tasks-header">
        <h1>
          Vos Tâches
          <span v-if="currentUser" class="username">{{ currentUser.username }}</span>
        </h1>
        <button @click="logout" class="logout-btn">⏻</button>
      </header>

      <!-- Create Task -->
      <section class="create-task">
        <h2>Créer une nouvelle tâche</h2>
        <form @submit.prevent="handleAddTask" class="task-form">
          <input
            type="text"
            v-model="newTaskTitle"
            placeholder="Titre de la nouvelle tâche..."
            required
          />
          <button type="submit" :disabled="tasksLoading">
            {{ tasksLoading ? 'Ajout...' : '✚' }}
          </button>
        </form>
      </section>

      <!-- Loading / Error -->
      <p v-if="tasksLoading" class="loading-text">Chargement des tâches...</p>
      <p v-if="tasksError" class="error-text">{{ tasksError }}</p>

      <!-- Task List -->
      <section class="tasks-list-section">
        <h2>Liste des tâches</h2>
        <ul v-if="allTasks.length > 0" class="task-list">
          <li v-for="task in allTasks" :key="task.id" class="task-item">
            <span :class="{ completed: task.completed }">{{ task.title }}</span>
            <div class="task-actions">
              <button
                @click="handleToggleTaskCompletion(task)"
                :class="{ completed: task.completed }"
              >
                {{ task.completed ? 'À faire' : 'Terminer' }}
              </button>
              <button @click="handleDeleteTask(task.id)" class="delete-btn">Supprimer</button>
            </div>
          </li>
        </ul>
        <p v-else class="empty-text">Aucune tâche pour le moment. Ajoutez-en une !</p>
      </section>
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
  if (success) newTaskTitle.value = ''
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

<style scoped>
.task-view {
  display: flex;
  justify-content: center;
  padding: 30px;
  min-height: 100vh;
  background: #f5f6fa;
}

.tasks-container {
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Header */
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.tasks-header h1 {
  font-size: 1.8em;
}
.username {
  color: #007bff;
  margin-left: 10px;
  font-weight: 500;
}
.logout-btn {
  background: #dc3545;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.logout-btn:hover {
  background: #c82333;
}

/* Create Task */
.create-task h2 {
  font-size: 1.4em;
  margin-bottom: 15px;
}
.task-form {
  display: flex;
  gap: 10px;
}
.task-form input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.task-form button {
  padding: 10px 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.task-form button:disabled {
  background: #7ab6ff;
  cursor: not-allowed;
}
.task-form button:hover:not(:disabled) {
  background: #0056b3;
}

/* Messages */
.loading-text,
.error-text,
.empty-text {
  margin-top: 15px;
  text-align: center;
}
.error-text {
  color: red;
}

/* Task List */
.tasks-list-section h2 {
  font-size: 1.4em;
  margin: 30px 0 15px;
}
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background: #f8f8f8;
  border-radius: 6px;
}
.task-item span.completed {
  text-decoration: line-through;
  color: #777;
}
.task-actions button {
  margin-left: 8px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.task-actions button.completed {
  background: #ffc107;
  color: #222;
}
.task-actions .delete-btn {
  background: #dc3545;
  color: white;
}
.task-actions .delete-btn:hover {
  background: #c82333;
}
</style>
