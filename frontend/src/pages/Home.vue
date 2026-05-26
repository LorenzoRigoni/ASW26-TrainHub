<script setup>
import { onMounted, ref } from 'vue'
import { ROLES } from '../utils/utils.js'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import DashboardHome from '../components/DashboardHome.vue'
import AIChat from '../components/AIChat.vue'
import axios from 'axios'

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})
const customersList = ref([])
const stats = ref({ activeClientsCount: 0, totalPrograms: 0, activeNutritionalPlans: 0, pendingPrograms: 0 })
const programsList = ref([])
const recentNotifications = ref([])
const activeProgram = ref(null)
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const notifRes = await axios.get('http://localhost:5000/api/notifications/unread', config)
      if (notifRes.data && notifRes.data.data) {
        recentNotifications.value = notifRes.data.data.slice(0, 3)
      }

      if (!recentNotifications.value) recentNotifications.value = []
    } catch (notifErr) {
      console.warn("Impossibile caricare le notifiche", notifErr.message)
    }

    if (userLogged.value.role === ROLES.PERSONAL_TRAINER) {
      const [clientsRes, statsRes, programsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/my-clients', config),
        axios.get('http://localhost:5000/api/users/trainer-stats', config),
        axios.get('http://localhost:5000/api/users/programs-list', config)
      ])

      customersList.value = clientsRes.data?.data || []
      stats.value = statsRes.data?.data || { activeClientsCount: 0, totalPrograms: 0, activeNutritionalPlans: 0, pendingPrograms: 0 }
      programsList.value = programsRes.data?.data || []
    } else if (userLogged.value.role === ROLES.CLIENTE) {
      const [programsRes, activeRes] = await Promise.all([
        axios.get('http://localhost:5000/api/training-programs/my-programs', config),
        axios.get('http://localhost:5000/api/training-programs/active', config).catch(() => ({ data: { data: null } }))
      ])

      programsList.value = (programsRes.data?.data || []).map(p => ({
        id: p._id,
        title: `Scheda del ${new Date(p.createdAt).toLocaleDateString()}`,
        category: p.splits.length > 0 ? p.splits[0].name : 'Allenamento',
        status: p.programStatus === 'active' ? 'Attiva' : 'Archiviata'
      }))

      activeProgram.value = activeRes.data.data

      //TODO: piano nutrizionale
    } else if (userLogged.value.role === ROLES.NUTRIZIONISTA) {
      //TODO: logica caricamento dati nutrizionista
    }
  } catch(error){
    console.error("Errore nel caricamento dati:", error.response?.data?.message || error.message);
  }
}

onMounted(fetchData)
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role = "userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <DashboardHome
        :user="userLogged"
        :stats="stats"
        :clienti="customersList || []"
        :schede="programsList || []" 
        :schede-cliente="programsList || []"
        :notifiche="recentNotifications || []"
        :ultimo-allenamento="{ data: '2025-05-01' }"
      />
      <AIChat />
    </main>
  </div>
</template>

<style>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  font-family: 'Century Gothic', 'Century Gothic', Futura, sans-serif;
}
.main-content{
  background-color: #f4f6f9;
}
</style>

<style scoped>
#app {
  min-height: 100vh;
}

.main-content {
  margin-top: 60px;      
  margin-left: 0;
  padding-bottom: 50px;   
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
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
</style>