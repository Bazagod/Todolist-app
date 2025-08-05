<template>
  <div :class="['auth-view', darkMode ? 'dark' : '']">
    <div class="auth-card">
      <h1>Bienvenue 👋</h1>
      <p class="subtitle">Connectez-vous pour accéder à vos tâches</p>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="votre@email.com" required />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" placeholder="********" required />
        </div>
        <p v-if="authError" class="error-message">{{ authError }}</p>
        <button type="submit" :disabled="authLoading" class="btn-primary">
          {{ authLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <p class="bottom-text">
          Pas encore de compte ?
          <router-link to="/register">Inscrivez-vous</router-link>
        </p>
      </form>
    </div>
    <button @click="toggleDarkMode" class="btn-mode">
      {{ darkMode ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const email = ref('')
const password = ref('')
const store = useStore()
const router = useRouter()
const darkMode = ref(true)

const authLoading = computed(() => store.getters['login/loading'])
const authError = computed(() => store.getters['login/error'])

async function handleLogin() {
  const success = await store.dispatch('login/login', {
    email: email.value,
    password: password.value,
  })
  if (success) router.push('/tasks')
}
function toggleDarkMode() {
  darkMode.value = !darkMode.value
}
</script>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f9fc;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s ease;
}
.auth-view.dark {
  background: #1e1e1e;
  color: #f5f5f5;
}
.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: background 0.3s ease;
}
.auth-view.dark .auth-card {
  background: #2b2b2b;
}
h1 {
  font-size: 1.8em;
  margin-bottom: 10px;
}
.subtitle {
  color: #666;
  margin-bottom: 25px;
}
.auth-view.dark .subtitle {
  color: #aaa;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  text-align: left;
}
.form-group label {
  font-size: 0.9em;
  color: #555;
}
.auth-view.dark .form-group label {
  color: #ccc;
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1em;
  outline: none;
}
.auth-view.dark input {
  background: #3a3a3a;
  border: 1px solid #555;
  color: white;
}
.btn-primary {
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-primary:hover {
  background: #0056b3;
}
.error-message {
  color: #ff4d4d;
  font-size: 0.9em;
}
.bottom-text {
  margin-top: 15px;
  font-size: 0.9em;
  color: #666;
}
.auth-view.dark .bottom-text {
  color: #bbb;
}
.bottom-text a {
  color: #007bff;
  text-decoration: none;
}
.btn-mode {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
</style>
