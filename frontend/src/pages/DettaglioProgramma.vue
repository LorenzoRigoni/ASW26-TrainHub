<script setup>
import { ref, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import SplitListItem from '../components/SplitListItem.vue'

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
                
                <div class="program-container">
                  <div v-for="(split, i) in program.splits" :key="split._id || i" class="program">
                    <h2 class="split-title">{{ split.name }} - {{ split.day }}</h2>
                    
                    <ul class="exercise-list">
                      <SplitListItem
                        v-for="(ex, j) in split.exercises"
                        :key="j"
                        v-bind="ex"
                      />
                    </ul>
                  </div>
                </div>
            </template>

            <div v-else class="error-state">
                <p>Impossibile trovare il programma richiesto.</p>
            </div>
        </main>
        
        <Footer />
    </div>
</template>

<style scoped>
.main-content {
  margin-top: 60px;
  padding: 24px;
  padding-bottom: 60px;

  min-height: calc(100vh - 60px);
  background: #f4f6f9;

  transition: margin-left 0.3s ease;
  overflow-x: hidden;
}

/* sidebar desktop */
@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

/* mobile safety */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 16px;
  }
}


.header-dettaglio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

h1 {
  font-size: 24pt; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}

.badge-status {
  padding: 6px 12px;
  border-radius: 999px;

  font-size: 0.85rem;
  font-weight: 600;

  text-transform: capitalize;
  white-space: nowrap;
}

.badge-status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-status.draft {
  background: #fff3e0;
  color: #ef6c00;
}

.badge-status.completed {
  background: #e3f2fd;
  color: #1565c0;
}

.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
  padding: 40px;

  font-size: 1rem;
  color: #555;
}

.error-state {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px;
  color: #b00020;
  font-weight: 500;
}


.program {
  background-color: #ffffff;
  padding: 20pt;
  border-radius: 20pt;
}

.program-container {
  padding: 1rem 0; 
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.split-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.exercise-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>