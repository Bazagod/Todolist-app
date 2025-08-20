<template>
  <div class="task-view">
    <header class="header">
      <div class="user-info">
        <div class="avatar">{{ currentUser?.name[0].toUpperCase() }}</div>
        <div>
          <h1>
            Bonjour, <span>{{ currentUser?.name }}</span> 👋
          </h1>
          <p>{{ completedCount }} / {{ allTasks.length }} tâches complétées</p>
        </div>
      </div>
      <div class="header-actions">
        <button @click="logout" class="btn-logout">⏻</button>
      </div>
    </header>

    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="add-task">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="Nouvelle tâche..."
        @keyup.enter="handleAddTask"
      />
      <button @click="handleAddTask" :disabled="tasksLoading" class="btn-add">+</button>
    </div>

    <div class="filters">
      <button
        v-for="f in ['all', 'active', 'completed']"
        :key="f"
        :class="{ active: filter === f }"
        @click="filter = f"
      >
        {{ f === 'all' ? 'Toutes' : f === 'active' ? 'À faire' : 'Terminées' }}
      </button>
    </div>

    <transition-group name="fade" tag="ul" class="task-list">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.status === 'completed' }"
      >
        <div class="task-content">
          <input
            type="checkbox"
            :checked="task.status === 'completed'"
            @change="handleToggleTaskCompletion(task)"
          />
          <span>{{ task.title }}</span>
        </div>

        <button
          class="btn-delete"
          @click.stop="handleDeleteTask(task.id)"
          title="Supprimer la tâche"
        >
          🗑
        </button>
      </li>
    </transition-group>

    <p v-if="tasksLoading" class="info-message">Chargement...</p>
    <p v-else-if="!filteredTasks.length" class="info-message">
      Aucune tâche ici. Ajoutez-en une ! 😉
    </p>
    <p v-if="tasksError" class="error-message">{{ tasksError }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const newTaskTitle = ref('')
const filter = ref('all')

const currentUser = computed(() => store.getters['login/currentUser'])
const allTasks = computed(() => store.getters['tasks/allTasks'])
const tasksLoading = computed(() => store.getters['tasks/tasksLoading'])
const tasksError = computed(() => store.getters['tasks/tasksError'])

const filteredTasks = computed(() => {
  if (!Array.isArray(allTasks.value)) return []
  if (filter.value === 'active') {
    return allTasks.value.filter((t) => t.status === 'pending')
  } else if (filter.value === 'completed') {
    return allTasks.value.filter((t) => t.status === 'completed')
  }
  return allTasks.value
})

const completedCount = computed(() => {
  if (!Array.isArray(allTasks.value)) return 0
  return allTasks.value.filter((t) => t.status === 'completed').length
})

const progressPercent = computed(() =>
  allTasks.value.length ? (completedCount.value / allTasks.value.length) * 100 : 0,
)

async function handleAddTask() {
  if (!newTaskTitle.value.trim()) return
  const ok = await store.dispatch('tasks/addTask', newTaskTitle.value)
  if (ok) newTaskTitle.value = ''
}

function handleToggleTaskCompletion(task) {
  store.dispatch('tasks/toggleTaskCompletion', task)
}

function handleDeleteTask(id) {
  console.log('Suppression demandée pour id=', id)
  if (confirm('Supprimer cette tâche ?')) {
    store.dispatch('tasks/deleteTask', id)
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
  max-width: 100%;
  margin: auto;
  padding: 30px;
  font-family: 'Poppins', sans-serif;
  background: #f7f9fc;
  min-height: 100vh;
  transition: 0.3s;
}
.task-view.dark {
  background: #1e1e1e;
  color: #f5f5f5;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.user-info h1 {
  font-size: 1.6em;
  font-weight: 600;
}
.user-info span {
  color: #007bff;
}
.user-info p {
  font-size: 0.9em;
  color: #888;
}
.avatar {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.btn-logout {
  background: #ff4d4d;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.progress-bar {
  width: 100%;
  height: 10px;
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
.progress {
  height: 100%;
  background: #007bff;
  transition: 0.3s;
}
.add-task {
  display: flex;
  margin-bottom: 20px;
}
.add-task input {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 1em;
}
.btn-add {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 0 20px;
  font-size: 1.8em;
  margin-left: 10px;
  border-radius: 10px;
  cursor: pointer;
}
.filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}
.filters button {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f1f1f1;
  cursor: pointer;
}
.filters .active {
  background: #007bff;
  color: #fff;
}
.task-list {
  list-style: none;
  padding: 0;
}
.task-card {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}
.task-card.completed {
  opacity: 0.6;
  text-decoration: line-through;
}
.task-card:hover {
  transform: scale(1.02);
}
.task-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-delete {
  background: none;
  border: none;
  font-size: 18px;
  color: #ff4444;
  cursor: pointer;
  margin-left: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.4s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.info-message {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
.error-message {
  text-align: center;
  color: #ff4d4d;
  margin-top: 20px;
}
</style>
