<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errore = ref('')
const router = useRouter()

const signin = () => {
  // TODO: controllare che le credenziali non siano già state utilizzate
  if (username.value === 'admin' && password.value === '1234') {
    router.push('/home') 
  } else {
    errore.value = 'Username e password già utilizzati.'
  }
}

</script>

<template>
    <div class="signin-page">
        <div class="signin-card">

            <div class="logo">
                <img src="../assets/TrainHub - Logo.png" alt="TrainHub Logo" />
            </div>

            <form @submit.prevent="signin" class="signin-form">
                <div class="input-group">
                <label>Username</label>
                <input type="text" v-model="username" />
                </div>

                <div class="input-group">
                <label>Password</label>
                <input type="password" v-model="password" />
                </div>

                <div class="input-group">
                    <label for="personal-trainers-list">
                        Scegli il tuo personal trainer:
                    </label>

                    <div class="select-wrapper">
                        <select id="personal-trainers-list">
                        <option value="pt1">Personal Trainer 1</option>
                        <option value="pt2">Personal Trainer 2</option>
                        <option value="pt3">Personal Trainer 3</option>
                        </select>
                    </div>
                </div>

                <button type="submit" class="signin-btn">Registrati</button>
            </form>

            <p v-if="errore" class="errore">{{ errore }}</p>
        </div>
    </div>
</template>

<style>

.signin-page {
  height: 100vh;
  background: #1e1548; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Century Gothic', 'Century Gothic', Futura, sans-serif;
}


.signin-card {
  background: #d9d9d9;
  padding: 40px 50px;
  border-radius: 15px;
  width: 350px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}


.logo img {
  width: 250px;
  margin-bottom: 25px;
}


.signin-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.input-group label {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: #eee;
  font-size: 14px;
}

.input-group select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: #eee;
  font-size: 14px;
  appearance: none; 
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.input-group select {
  padding-right: 35px;
}


.input-group select:focus {
  background: #e4e4e4;
}

.input-group select:hover {
  background: #e8e8e8;
}

.signin-btn {
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #1e1548;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: "";
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 6px;
  height: 6px;
  border-right: 2px solid #555;
  border-bottom: 2px solid #555;
  pointer-events: none;
}

.signin-btn:hover {
  background: #2a1f66;
}

.errore {
  color: red;
  margin-top: 10px;
  font-size: 13px;
}
</style>