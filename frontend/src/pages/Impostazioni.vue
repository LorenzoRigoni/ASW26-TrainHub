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

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const router = useRouter()
const emit = defineEmits(['apri-richiesta'])

const previewImage = ref(profileImage)

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role'),
  username: localStorage.getItem('user_username')
})

</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen"  :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="header">
        <div class="info-header">
           <h1>Impostazioni</h1>
          <p>Gestisci il tuo account</p>
        </div>
        <button class="btn-primary" @click="emit('apri-richiesta', null)">
          <i class="fa fa-pencil-square-o"></i> Salva modifiche
        </button>
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

                <img :src="previewImage" class="avatar" />

                <button class="secondary-btn">
                  Cambia foto
                </button>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                />
              </div>

              <!-- FORM -->
              <div class="profile-form">

                <div class="form-group">
                  <label>Nome</label>
                  <input type="text" v-model="userLogged.name" />
                </div>

                <div class="form-group">
                  <label>Cognome</label>
                  <input type="text" v-model="userLogged.surname" />
                </div>

                <div class="form-group">
                  <label>Username</label>
                  <input type="email" v-model="userLogged.username" />
                </div>

                <div class="form-group">
                  <label>Ruolo</label>
                  <input type="text" v-model="userLogged.role" />
                </div>
              </div>
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
                <input type="password" />
              </div>

              <div class="form-group">
                <label>Conferma password</label>
                <input type="password" />
              </div>

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