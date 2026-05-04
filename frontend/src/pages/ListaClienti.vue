<script setup>
import { ref } from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { ROLES } from '../constants/roles.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

//TODO: aggiungere la possibiltà di assegnare un colore al badge attivo/inattivo/perso. 
//Dati test
const customers = [
  {
    id: 1,
    name: 'Lorenzo',
    surname: 'Rigoni',
    email: 'lorengo.rigoni@gmail.com',
    status: 'attivo',
    birthdate: 'mm/gg/aaaa'
  },
  {
    id: 2,
    name: 'Riccardo',
    surname: 'Moretti',
    email: 'riccardo.moretti@gmail.com',
    status: 'attivo',
    birthdate: 'mm/gg/aaaa'
  },
  {
    id: 3,
    name: 'Alessandro',
    surname: 'Fabbri',
    email: 'alessandro.fabbri@gmail.com',
    status: 'inattivo',
    birthdate: 'mm/gg/aaaa'
  },
  {
    id: 4,
    name: 'Vittoria',
    surname: 'Bianchi',
    email: 'vittoria.bianchi@gmail.com',
    status: 'perso',
    birthdate: 'mm/gg/aaaa'
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
            icon="fa fa-user-circle"
            :title="c.name + ' ' +  c.surname"
            :status="c.status"
          >
           <!-- Info aggiuntive (valutare se ha senso inserirle nel componente riutilizzabile) -->
            <template #subtitle>
              {{ c.email}} • {{ c.birthdate }}
            </template>
          </MainListItem>
        
          </MainList>
        </div>
      </main>

    <Footer />
  </div>
</template>

<style scoped>
.lista-clienti {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
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