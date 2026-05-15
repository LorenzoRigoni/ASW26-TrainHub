<script setup>
import { ref, onMounted } from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { fetchUserInfo } from '../utils/utils.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

//TODO: aggiungere la possibiltà di assegnare un colore al badge attivo/inattivo/perso. 
//Dati test
const exercises = [
  {
    id: 1,
    name: 'Row machine',
    description: 'POLSI RIVOLTI VERSO IL BASSO, GOMITI ALTI, PENSA AD APRIRE AL MASSIMO IL TORACE E STRINGERE BENE LE SCAPOLE.',
    img: 'img.png',
    movement_pattern: 'Tirata orizzontale'
   
  },
  {
    id: 2,
    name: 'Stacco rumeno',
    description: 'ZONA LOMBARE SEMPRE DRITTA. PIEGA LEGGEMENTE LE GINOCCHIA E PENSA A PORTARE IL BACINO VERSO DIETRO E VERSO L\'ALTO. MANTIENI IL PESO SUI TALLONI, MENTRE RISALI PENSA  A PREMERE A TERRA COI TALLONI E CONTRARRE I GLUTEI. MANTIENI LE SPALLE PREMUTE IN BASSO.',
    img: 'img.png',
    movement_pattern: 'Estensione anca'
   
  },
  {
    id: 3,
    name: 'Chin up',
    description: 'INIZIA IL MOVIMENTO PORTANDO LE SPALLE LONTANO DALLE ORECCHIE, MANTENENDO IL GOMITO SOTTO L\'IMPUGNATURA TIRA E APRI AL MASSIMO IL TORACE. PRENDI CON CALMA LA FASE INIZIALE IN CUI ABBASSI LE SPALLE, TI INCINI INDIETRO E INIZI AD APRIRTI. PUNTA A BUTTARE IL MENTO OLTRE LA SPALLA. ',
    img: 'img.png',
    movement_pattern: 'Tirata verticale'
   
  },
  {
    id: 4,
    name: 'Curl alternato con manubri',
    description: 'IL GOMITO NON ARRETRA MAI, ANZI AVANZA LEGGERMENTE A FINE MOVIMENTO.',
    img: 'img.png',
    movement_pattern: 'Complementare tirata'
   
  }
]

const userLogged = ref({
  name: '',
  surname: '',
  role: ''
})

onMounted(async () => {
  const userData = await fetchUserInfo()
  if (userData) {
    userLogged.value = userData
  }
})

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-esercizi">
        <div class="header">
            <h1 class="title">Esercizi</h1>
            <p class="subtitle">Gli esercizi in elenco saranno utilizzabili durante la creazione dei programmi di allenamento. </p>
        </div>
    
        <MainList>
          <MainListItem
            v-for="e in exercises"
            :key="e.id"
            icon="fa fa-user-circle"
            :title="e.name"
            :status="e.movement_pattern"
          >
           <!-- Info aggiuntive (valutare se ha senso inserirle nel componente riutilizzabile) -->
            <template #subtitle>
              {{ e.description }}
            </template>
          </MainListItem>
        
          </MainList>
        </div>
      </main>

    <Footer />
  </div>
</template>

<style scoped>
.lista-esercizi {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.subtitle   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.header {
  display: flex;
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