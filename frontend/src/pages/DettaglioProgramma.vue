<script setup>
import { ref, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import WorkoutProgram from '../components/WorkoutProgram.vue'

const route = useRoute()
const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})
const sidebarOpen = ref(true)
const program = ref(null)
const loading = ref(true)

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const programId = route.params.id

    const programRes = await axios.get(`http://localhost:5000/api/training-programs/${programId}`, config)
    const rawProgram = programRes.data.data

    console.log("Dati grezzi dal server:", rawProgram)

    program.value = {
      ...rawProgram,
      title: rawProgram.title || `Piano di ${rawProgram.athleteId?.name || 'Atleta'}`,
      splits: rawProgram.splits.map(s => ({
        ...s,
        exercises: (s.rows || []).map(row => ({
          ...row,
          name: row.exercise?.name || 'Esercizio rimosso',
          image: row.exercise?.image || null,
          muscleTag: row.exercise?.muscleTag || '',
          sets: row.sets || 0,
          reps: row.reps || 0,
          rest: row.rest || 0,
          technique: row.technique || '',
          notes: row.notes || ''
        }))
      }))
    }
    
    console.log("Dati mappati per il frontend:", program.value)
  } catch (error) {
    console.error("Errore nel caricamento del dettaglio:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
    <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />
        
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <div v-if="loading" class="loader-container">
                <i class="fa fa-spinner fa-spin"></i> Caricamento programma...
            </div>

            <template v-else-if="program">
                <div class="header-dettaglio">
                    <h1 class="program-title">{{ program.title }}</h1>
                    <span class="badge-status" :class="program.programStatus">
                        {{ program.programStatus }}
                    </span>
                </div>
                
                <WorkoutProgram :program="program" />
            </template>

            <div v-else class="error-state">
                <p>Impossibile trovare il programma richiesto.</p>
            </div>
        </main>
        
        <Footer />
    </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.program-title { 
  font-size: 1.75rem; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
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