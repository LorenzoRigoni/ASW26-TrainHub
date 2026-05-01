<script setup>
import { ref } from 'vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import DashboardHome from '../components/DashboardHome.vue'

// Stato sidebar
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Dati temporanei di test
const listaClienti = ref([
  { id: 1, nome: 'Lorenzo', cognome: 'Rigoni', email: 'rigoni.lorenzo.21@gmail.com', stato: 'Attivo' },
  { id: 2, nome: 'Alessandro', cognome: 'Fabbri', email: 'alessandro.fabbri.unibo@gmail.com', stato: 'Attivo' }
])

const listaSchede = ref([
  { id: 1, titolo: 'Lorenzo Rigoni - Piano 1', categoria: 'Ipertrofia', stato: 'Assegnata' }
])
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <DashboardHome
        :user="{ nome: 'Alessandra', cognome: 'Versari', ruolo: 'Personal Trainer' }"
        :stats="{ clientiAttivi: 2, schedeCreate: 1, richiesteNutriz: 0, inAttesa: 0 }"
        :clienti="listaClienti"
        :schede="listaSchede"
      />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  font-family: 'Century Gothic', 'Century Gothic', Futura, sans-serif;
}

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