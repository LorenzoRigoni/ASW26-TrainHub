<script setup>
import { onMounted, ref } from 'vue'
import { ROLES } from '../constants/roles.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import DashboardHome from '../components/DashboardHome.vue'
import axios from 'axios'

//Al momento per vedere come cambiano le varie home, cambiamo ruolo: ''. I valori possibili sono personalTrainer, cliente, nutrizionista.
const userLogged = ref({ name: '', surname: '', role: '' })
const customersList = ref([])
const programsList = ref([])
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const userRes = await axios.get('http://localhost:5000/api/auth/userinfo', config)
    userLogged.value = userRes.data.data;

    if (userLogged.value.role === ROLES.PERSONAL_TRAINER) {
      const res = await axios.get('http://localhost:5000/api/training-programs/trainer/programs', config);
      programsList.value = res.data.data;
      stats.value.schedeCreate = res.data.count;
    } else {
      const res = await axios.get('http://localhost:5000/api/training-programs/my-programs', config);
      programsList.value = res.data.data;
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
        :stats="{ clientiAttivi: 2, schedeCreate: 1, richiesteNutriz: 0, inAttesa: 0 }"
        :clienti="customersList"
        :schede="programsList"
      />
    </main>

    <Footer />
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