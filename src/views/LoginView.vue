<template>
  <div class="login-view">
    <div class="form-container">
      <h1 class="form-title">Bienvenue sur votre Todo-list App</h1>
      <h2 class="form-subtitle">Connectez-vous pour continuer</h2>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="votre@email.com" required />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" placeholder="********" required />
        </div>

        <!-- Error message -->
        <p v-if="authError" class="error-message">{{ authError }}</p>

        <!-- Submit -->
        <div class="form-group">
          <button type="submit" :disabled="authLoading" class="btn-submit">
            {{ authLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>

        <!-- Register link -->
        <p class="register-text">
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

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f6fa;
}

.form-container {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 12px 40px 30px 25px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.form-title {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.form-subtitle {
  font-size: 1em;
  color: #555;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

label {
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: 0.2s;
}
input:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #0057b4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) {
  background: #0056b3;
}
.btn-submit:disabled {
  background: #6494cf;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 12px;
}

.register-text {
  text-align: center;
  color: #666;
  font-size: 0.9em;
  margin-top: 20px;
}

.text-link {
  color: #005abb;
  text-decoration: none;
}
.text-link:hover {
  text-decoration: underline;
}
</style>
