<template>
  <div :class="['auth-view', darkMode ? 'dark' : '']">
    <div class="auth-card">
      <h1>Créer un compte 📝</h1>
      <p class="subtitle">Rejoignez-nous et gérez vos tâches facilement</p>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" v-model="username" placeholder="Votre nom" required />
        </div>
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
          {{ authLoading ? 'Inscription...' : "S'inscrire" }}
        </button>
        <p class="bottom-text">
          Déjà un compte ?
          <router-link to="/login">Connectez-vous</router-link>
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

const username = ref('')
const email = ref('')
const password = ref('')
const store = useStore()
const router = useRouter()
const darkMode = ref(false)

const authLoading = computed(() => store.getters['login/loading'])
const authError = computed(() => store.getters['login/error'])

async function handleRegister() {
  const success = await store.dispatch('login/register', {
    username: username.value,
    email: email.value,
    password: password.value,
  })
  if (success) {
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
    router.push('/login')
  }
}
function toggleDarkMode() {
  darkMode.value = !darkMode.value
}
</script>

<style scoped>
/* Même styles que LoginView.vue (réutiliser pour cohérence) */
</style>
