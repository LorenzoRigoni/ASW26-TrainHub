<script setup>
import { ref } from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { ROLES } from '../constants/roles.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
//Dati test
const programs = [
  {
    id: 1,
    title: 'Lorenzo Rigoni - Piano 1',
    category: 'Ipertrofia',
    duration: '6 settimane',
    date: '10 apr 2026',
    status: 'completato'
  },
  {
    id: 2,
    title: 'Lorenzo Rigoni - Piano 2',
    category: 'Ipertrofia',
    duration: '6 settimane',
    date: '10 apr 2026',
    status: 'in-corso'
  },
  {
    id: 3,
    title: 'Mario Rossi - Piano 1',
    category: 'Ipertrofia',
    duration: '6 settimane',
    date: '10 apr 2026',
    status: 'in-corso'
  },
  {
    id: 4,
    title: 'Gianna Bianchi - Piano 1',
    category: 'Ipertrofia',
    duration: '6 settimane',
    date: '10 apr 2026',
    status: 'in-corso'
  }
]

const userLogged = {
  name: 'Alessandra',
  surname: 'Versari',
  role: ROLES.PERSONAL_TRAINER
}


const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
//TODO sostituire con reidirizzamento a programma in base all'id
const goToDetail = () => {
  router.push('/programmi/dettaglio-programma')
}

</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role = "userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-programmi">
        <div class="header">
            <h1 class="programmi-title">Elenco programmi di allenamento</h1>
            <p class="programmi-sub"></p>
        </div>
    
        <MainList>
          <MainListItem
            v-for="p in programs"
            :key="p.id"
            icon="fa fa-user-circle"
            :title="p.title"
            :status="p.status"
            @click="goToDetail"
          >
            
            <!-- Info aggiuntive (valutare se ha senso inserirle nel componente riutilizzabile) -->
            <template #subtitle>
              {{ p.category }} • {{ p.duration }} • {{ p.date }}
            </template>

          </MainListItem>
          </MainList>
        </div>
      </main>

    <Footer />
  </div>
</template>

<style scoped>
.lista-programmi {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.programmi-title { 
  font-size: 1.75rem; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}

.programmi-sub   { 
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