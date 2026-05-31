<script setup>
import { ref, onMounted } from 'vue'
import { ROLES, getAvatarColor, getInitials, getErrorMessage } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { API_URL } from '../utils/config.js'
import { useSidebarStore } from '../stores/sidebar.js'

import axios from 'axios'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import profileImage from '../assets/profileImage.png'

const router = useRouter()
const auth = useAuthStore()
const customers = ref([])
const sidebar = useSidebarStore()

const fetchClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users/my-clients`, auth.apiConfig)
    customers.value = response.data.data || []
    customers.value.forEach((c) => {
      if (c.profilePicture) {
        c.profilePicture = `${API_URL}${c.profilePicture}`
      } else {
        c.profilePicture = profileImage
      }
    })
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

onMounted(async () => {
  fetchClients()
})

const goToDetail = (id) => {
  router.push(`/clienti/dettaglio-cliente/${id}`)
}

</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="sidebar.toggle" />
    <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
    <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
      <div class="lista-clienti">
        <div class="header-text">
            <h1 class="title">Elenco clienti</h1>
            <p class="subtitle">Attivo (Si è allenato nell'ultimo mese), Inattivo (> 30 gg dall'ultimo allenamento), Perso (> 6 mesi dall'ultimo allenamento)</p>
        </div>
    
        <MainList>
          <MainListItem
            v-for="c in customers"
            :key="c.id"
            :icon="null"
            :title="c.name + ' ' +  c.surname"
            :status="c.status"
             @click="goToDetail(c.id)"
          >
            <template #left>
             <div class="avatar">
                <img :src="c.profilePicture" alt="User profile" class="user-icon" />
              </div>
            </template>

            <template #subtitle>
              {{ c.email}} • {{ c.birthdate }}
            </template>
          </MainListItem>
        
          </MainList>
        </div>
      </main>
  </div>
</template>

<style scoped>
.programmi-sub   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.user-icon {
  height: 50px;
  width: auto;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10pt;
}

</style>