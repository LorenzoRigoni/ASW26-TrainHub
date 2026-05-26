<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import axios from 'axios'

import profileImage from '../assets/profileImage.png'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import ActionCard from '../components/ActionCard.vue'

const sidebarOpen = ref(true)
const loading = ref(false)
const fileInput = ref(null)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const router = useRouter()
const emit = defineEmits(['apri-richiesta'])

const previewImage = ref(profileImage)
const selectedFile = ref(null)

const userFields = ref({
  name: '',
  surname: '',
  username: '',
  email: '',
  role: ''
})

const passwordFields = ref({
  newPassword: '',
  confirmPassword: ''
})
const passLoading = ref(false)

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const fetchUserData = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/auth/userinfo', config)
    const user = res.data.data

    userFields.value = {
      name: user.name || '',
      surname: user.surname || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || ''
    }

    if (user.profilePicture) {
      previewImage.value = `http://localhost:5000${user.profilePicture}`
    }
  } catch (error) {
    console.error("Errore durante il caricamento dei dati utente:", error)
  }
}

const triggerFileSelect = () => {
  fileInput.value.click()
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveSettings = async () => {
  loading.value = true
  try {
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('avatar', selectedFile.value)

      const imgRes = await axios.post('http://localhost:5000/api/users/upload-avatar', formData, {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      localStorage.setItem('user_profile_picture', imgRes.data.profilePicture)
      selectedFile.value = null
    }

    const payload = {
      name: userFields.value.name,
      surname: userFields.value.surname,
      email: userFields.value.email
    }

    const textRes = await axios.put('http://localhost:5000/api/users/update', payload, config)
    const updatedUser = textRes.data.data

    localStorage.setItem('user_name', updatedUser.name)
    localStorage.setItem('user_surname', updatedUser.surname)
    localStorage.setItem('user_username', updatedUser.username)
    localStorage.setItem('user_email', updatedUser.email)
    localStorage.setItem('user_image', updatedUser.profileImage)
    console.log('Dati Salvati')
  } catch (error) {
    console.error("Errore durante il salvataggio dei dati:", error)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (!passwordFields.value.newPassword) {
    alert("Compila tutti i campi della password.")
    return
  }
  if (passwordFields.value.newPassword !== passwordFields.value.confirmPassword) {
    alert("La nuova password e la conferma non coincidono!")
    return
  }

  passLoading.value = true
  try {
    const payload = {
      newPassword: passwordFields.value.newPassword
    }
    
    const res = await axios.put('http://localhost:5000/api/auth/update-password', payload, config)
    
    localStorage.setItem('token', res.data.data.token)

    passwordFields.value = {
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error("Errore durante il cambio password:", error)
  } finally {
    passLoading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen"  :role="userFields.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="header">
        <div class="info-header">
           <h1>Impostazioni</h1>
          <p>Gestisci il tuo account</p>
        </div>
      </div>

      <div class= "cards">
        <!-- Sezione info personali-->
        <ActionCard
          icon="fa fa-user"
          :clickable="false"
          iconColor="#2563eb"
          iconBg="rgba(37,99,235,0.12)"
        >
          <template #default>
              <div class="settings-header">
                <h2>Informazioni Personali</h2>
                <p>Gestisci i dati del tuo account</p>
              </div>

              <div class="profile-layout">

              <!-- FOTO -->
              <div class="profile-photo-section">

                <img :src="previewImage" class="avatar" style="cursor: pointer;" @click="triggerFileSelect" />

                  <button class="secondary-btn" @click="triggerFileSelect">
                    Cambia foto
                  </button>

                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    hidden
                    @change="onFileSelected"
                  />
              </div>

              <!-- FORM -->
              <div class="profile-form">

                <div class="form-group">
                  <label>Nome</label>
                  <input type="text" v-model="userFields.name" />
                </div>

                <div class="form-group">
                  <label>Cognome</label>
                  <input type="text" v-model="userFields.surname" />
                </div>

                <div class="form-group">
                  <label>Username</label>
                  <input type="email" v-model="userFields.username" />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="userFields.email" />
                </div>

                <div class="form-group">
                  <label>Ruolo</label>
                  <input type="text" v-model="userFields.role" disabled />
                </div>
              </div>
            </div>   
            <div class="form-actions">
              <button class="btn-primary" @click="saveSettings">
                <i class="fa fa-pencil-square-o"></i> Salva modifiche
              </button>
            </div>         
          </template>
        </ActionCard>

        <!-- Sezione configurazione security -->
        <ActionCard
          icon="fa fa-lock"
          :clickable="false"
          iconColor="#dc2626"
          iconBg="rgba(220,38,38,0.12)"
        >
          <template #default>

            <div class="settings-header">
              <h2>Security</h2>
              <p>Aggiorna la password</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Nuova password</label>
                <input type="password" v-model="passwordFields.newPassword" />
              </div>

              <div class="form-group">
                <label>Conferma password</label>
                <input type="password" v-model="passwordFields.confirmPassword" />
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="changePassword" :disabled="passLoading">
                <i v-if="passLoading" class="fa fa-spinner fa-spin"></i>
                {{ passLoading ? ' Aggiornamento...' : 'Aggiorna Password' }}
              </button>
            </div>
          </template>
        </ActionCard>
      </div>
    </main>
  </div>
</template>

<style scoped>

.main-content {
  margin-top: 60px;
  margin-left: 10pt;
  padding: 20px;
  padding-bottom: 50px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f9;
}


@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30,21,72,0.25);
  transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-primary:hover {
  background-color: #2d2070;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30,21,72,0.35);
}

h1 {
  font-size: 24pt; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}


.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 15px;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 5px 0 5px;
}

.settings-header p{
  margin-bottom: 10pt;
  font-size: 10pt;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom:  15pt;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
}

.form-group input {
  height: 48px;
  border-radius: 12px;
  border: 1px solid #dbe1ea;
  padding: 10pt;
  font-size: 0.95rem;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #6d5dfc;
  box-shadow: 0 0 0 4px rgba(109,93,252,0.12);
}

.settings-section-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.settings-section-header h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #111827;
  font-weight: 700;
}

.settings-section-header p {
  margin-top: 0.3rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.profile-layout {
  display: flex;
  align-items: flex-start;
  margin-top: 2rem;
}

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
}

.avatar {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow:
    0 8px 24px rgba(0,0,0,0.12),
    0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
}

.secondary-btn {
  background: #eef2ff;
  color: #292086;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.secondary-btn:hover {
  background: #dfe5ff;
}

.profile-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem; 
  width: 100%;
}


@media (max-width: 768px) {

  .profile-layout {
    flex-direction: column;
    align-items: center;
  }

  .profile-form {
    width: 100%;
    display: flow-root;
  }

  .avatar {
    width: 140px;
    height: 140px;
  }
}
</style>