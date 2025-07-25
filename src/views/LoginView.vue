<template>
  <div class="flex-center" style="min-height: 100vh">
    <div class="form-container">
      <h1 class="form-title">Bienvenue sur votre Todo-list App</h1>
      <h2 class="form-subtitle">Connectez-vous pour continuer</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            placeholder="votre@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            placeholder="********"
            required
          />
        </div>
        <p v-if="authError" class="error-message">{{ authError }}</p>
        <div class="form-group">
          <button
            type="submit"
            :disabled="authLoading"
            class="btn btn-primary"
            :class="{ 'btn-disabled': authLoading }"
          >
            {{ authLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 20px">
          Pas encore de compte ?
          <router-link to="/register" class="text-link">Inscrivez-vous</router-link>
        </p>
      </form>
    </div>
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

const authLoading = computed(() => store.getters['login/loading'])
const authError = computed(() => store.getters['login/error'])

async function handleLogin() {
  const success = await store.dispatch('login/login', {
    email: email.value,
    password: password.value,
  })
  if (success) {
    router.push('/tasks')
  }
}
</script>
