<script setup>
import { ref, onMounted } from 'vue'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { useRoute, useRouter} from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { useSidebarStore } from '../stores/sidebar.js'
import { API_URL } from '../utils/config.js'

import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import SplitListItem from '../components/SplitListItem.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebar = useSidebarStore()
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
        <Navbar @toggle-sidebar="sidebar.toggle" />
        <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
        <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
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
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 16px;
  font-size: 0.95rem;
  color: #555;
}

.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 48px 16px;
  color: #b00020;
  font-weight: 500;
}

.program-title {
  font-size: 1.7rem;
  line-height: 1.2;
  color: #1e1548;
  margin-bottom: 10px;
}

.program-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 12px;
}

.program {
  background: white;
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}

.program:active {
  transform: scale(0.99);
}

.split-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e1548;
  margin-bottom: 14px;
}

.exercise-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
}

.badge-status {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
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


@media (min-width: 768px) {

  .program-title {
    font-size: 2rem;
  }

  .program-container {
    gap: 24px;
  }

  .program {
    padding: 24px;
    border-radius: 22px;
  }

  .split-title {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }

  .program:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
}
</style>