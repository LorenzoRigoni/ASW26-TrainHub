<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getErrorMessage } from '../utils/utils.js'
import axios from 'axios'
import { API_URL } from '../utils/config.js'

const username = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  try {
    error.value = ''

    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username: username.value,
      password: password.value
    })

    if (response.data.success) {
      auth.setSession(response.data.data, response.data.token)
      router.push('/home')
    }
  } catch (err) {
    error.value = getErrorMessage(err)
  }
}

</script>

<template>
    <div class="login-page">
        <div class="login-card">

            <div class="logo">
                <img src="../assets/TrainHub - Logo.png" alt="TrainHub Logo" />
            </div>

            <form @submit.prevent="login" class="login-form">
                <div class="input-group">
                <label>Username</label>
                <input type="text" v-model="username" />
                </div>

                <div class="input-group">
                <label>Password</label>
                <input type="password" v-model="password" />
                </div>

                <button type="submit" class="login-btn">Login</button>
            </form>

            <div class="divider"></div>

            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background: #1e1548; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background: #d9d9d9;
  padding: 40px 50px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.logo img {
  width: 250px;
  margin-bottom: 25px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}


.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-group label {
  font-size: 14px;
  color: #333;
}


.input-group input {
  width: 60%;
  padding: 8px 12px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: #eee;
}


.login-btn {
  margin-top: 15px;
  padding: 8px;
  border: none;
  border-radius: 20px;
  background: #1e1548;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  background: #1e1548;
}


.divider {
  margin: 20px 0;
  height: 1px;
  background: #aaa;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 13px;
}

@media (min-width: 768px) {
  .login-card {
  width: 40%;
  }
}
</style>