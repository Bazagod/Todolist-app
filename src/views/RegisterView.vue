<template>
  <div class="flex-center" style="min-height: 100vh">
    <div class="form-container">
      <h1 class="form-title">Inscription</h1>
      <h2 class="form-subtitle">Créez votre compte sur Todo-list App</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username" class="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-input"
            placeholder="Votre nom"
            required
          />
        </div>
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
            class="btn btn-secondary"
            :class="{ 'btn-disabled': authLoading }"
          >
            {{ authLoading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 20px">
          Déjà un compte ?
          <router-link to="/login" class="text-link">Connectez-vous</router-link>
        </p>
      </form>
    </div>
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
</script>
<style></style>
