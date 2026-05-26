<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { ROLES, getAvatarColor, getInitials } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import profileImage from '../assets/profileImage.png'

const router = useRouter()
const customers = ref([])

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fetchClients = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('http://localhost:5000/api/users/my-clients', config)
    customers.value = response.data.data || []
    customers.value.forEach((c) => {
      if (c.profilePicture) {
        c.profilePicture = `http://localhost:5000${c.profilePicture}`
      } else {
        c.profilePicture = profileImage
      }
    })
  } catch (error) {
    console.error('Errore caricamento clienti:', error.response?.data?.message || error.message)
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
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role = "userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-clienti">
        <div class="header">
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
.lista-clienti {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.programmi-sub   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.header {
  display:inline-block;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.title { 
  font-size: 1.75rem; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}

.subtitle   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.main-content {
  margin-top: 60px;      
  margin-left: 0;
  padding-bottom: 50px;   
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

.user-icon {
  height: 30px;
  width: auto;
  border-radius: 50%;
  object-fit: cover;
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

/*Sidebar in mobile*/
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}

/*Spostare in css riutilizabile */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  margin-right: 10pt;
}
</style>