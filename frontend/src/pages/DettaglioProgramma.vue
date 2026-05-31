<script setup>
import { ref, onMounted } from 'vue'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { useRoute, useRouter} from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { API_URL } from '../utils/config.js'
import axios from 'axios'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import SplitListItem from '../components/SplitListItem.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = ref(true)
const program = ref(null)
const loading = ref(true)

const fetchData = async () => {
  try {
    const programId = route.params.id

    const programRes = await axios.get(`${API_URL}/api/training-programs/${programId}`, auth.apiConfig)
    const rawProgram = programRes.data.data

    program.value = {
      ...rawProgram,
      title: rawProgram.title || `Piano di ${rawProgram.athleteId?.name || 'Atleta'}`,
      splits: rawProgram.splits.map(s => ({
        ...s,
        exercises: (s.rows || []).map(row => ({
          ...row,
          name: row.exercise?.name || 'Esercizio rimosso',
          image: row.exercise?.image || null,
          movementPattern: row.exercise?.movementPattern || '',
          sets: row.sets || 0,
          reps: row.reps || 0,
          rest: row.rest || 0,
          technique: row.technique || '',
          notes: row.notes || ''
        }))
      }))
    }
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const goToSplit = (split, program) => {
  const splitIdentificator = split._id || split.splitId
  if (auth.user.role === 'trainer') {
    router.push(`/programmi/dettaglio-programma/${program._id}/dettaglio-split/${split._id}/${program.athleteId._id}`)
  } else {
    router.push(`/programmi/dettaglio-programma/${program._id}/dettaglio-split/${split._id}`)
  }
}
</script>

<template>
    <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role="auth.user.role" @close="sidebarOpen = false" />
        
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <div v-if="loading" class="loader-container">
                <i class="fa fa-spinner fa-spin"></i> Caricamento programma...
            </div>

            <template v-else-if="program">
                <div class="header-text">
                    <h1 class="program-title">{{ program.title }}</h1>
                </div>
                
                <div class="program-container">
                  <div v-for="(split, i) in program.splits" :key="split._id || i" class="program">
                    <h2 class="split-title">{{ split.name }}</h2>
                    
                    <ul class="exercise-list">
                      <SplitListItem
                        v-for="(ex, j) in split.exercises"
                        :key="j"
                        v-bind="ex"
                        @click="goToSplit(split, program)"
                      />
                    </ul>
                  </div>
                </div>
            </template>

            <div v-else class="error-state">
                <p>Impossibile trovare il programma richiesto.</p>
            </div>
        </main>
    </div>
</template>

<style scoped>

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
  cursor: pointer;
  transition: 0.2s ease;
}

.program:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.program-container {
  padding: 1rem 0; 
  display: flex;
  flex-direction: column;
  gap: 2rem;
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