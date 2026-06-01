<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_URL } from '../utils/config.js'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { useSidebarStore } from '../stores/sidebar.js'

import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import BackButton from '../components/GoBackButton.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebar = useSidebarStore()

const isClient = computed(() => auth.user.role === 'client')
const isTrainer = computed(() => auth.user.role === 'trainer')

const loading = ref(false)
const todayDate = computed(() =>
  new Date().toLocaleDateString('it-IT')
)

const programId = route.params.programId
const splitId = route.params.splitId
const athleteId = route.params.athleteId || ''

const exerciseLogs = ref({})
const currentWeekInput = ref({})
const splitExercises = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const programRes = await axios.get(`${API_URL}/api/training-programs/${programId}`, auth.apiConfig)
    const currentSplit = programRes.data.data.splits.find(s => s._id === splitId)

    if (currentSplit && currentSplit.rows) {
      splitExercises.value = currentSplit.rows

      currentSplit.rows.forEach(row => {
        const exId = row.exercise._id || row.exercise
        if (!exerciseLogs.value[exId]) exerciseLogs.value[exId] = []
        if (!currentWeekInput.value[exId]) {
          currentWeekInput.value[exId] = { load: '', reps: '', notes: '' }
        }
      })
    }

    const urlParamAthlete = isTrainer.value ? `/${athleteId}` : ''
    const logsRes = await axios.get(`${API_URL}/api/exercise-logs/${programId}/${splitId}${urlParamAthlete}`, auth.apiConfig)

    Object.keys(exerciseLogs.value).forEach(key => exerciseLogs.value[key] = [])

    logsRes.data.data.forEach(log => {
      if (exerciseLogs.value[log.exerciseId]) {
        exerciseLogs.value[log.exerciseId].push({
          date: new Date(log.date).toISOString().split('T')[0],
          load: log.load,
          reps: log.reps,
          notes: log.notes
        })
      }
    })
  } catch (err) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(err), "error")
  } finally {
    loading.value = false
  }
}

const saveAllProgress = async () => {
  try {
    const savePromises = Object.keys(currentWeekInput.value).map(async (exId) => {
      const input = currentWeekInput.value[exId]
      if (input.load !== '' || input.reps !== '') {
        return axios.post(`${API_URL}/api/exercise-logs/${programId}/${splitId}`, {
          exerciseId: exId,
          load: Number(input.load),
          reps: Number(input.reps),
          notes: input.notes
        }, auth.apiConfig)
      }
    })

    await Promise.all(savePromises)
    
    Object.keys(currentWeekInput.value).forEach(key => {
      currentWeekInput.value[key] = { load: '', reps: '', notes: '' }
    })

    showToast("Progressi salvati correttamente!", "success")
    await fetchData()
  } catch (err) {
    showToast("Errore nel salvataggio dei progressi: " + getErrorMessage(err), "error")
  }
}

onMounted(() => {
  fetchData()
})

const currentSession = ref({})


</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="sidebar.toggle" />
    <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
    <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
      <div v-if="loading" class="loader-container">
        <i class="fa fa-spinner fa-spin"></i> Caricamento dati...
      </div>

      <div class="split-page">
        <div class="page-header">
            <div class="header-container">
                 <BackButton />
                <div class="header-text">
                    <h1>{{ currentSplitName || 'Dettaglio Allenamento' }}</h1>
                    <p class="split-subtitle">  Storico allenamenti e compilazione sessione </p>
                </div>
            </div>
        </div>

        <!-- Lista di esercizi dello split selezioanto -->
        <section v-for="row in splitExercises" :key="row.exercise._id || row.exercise" class="exercise-card">

        <div class="exercise-title">
            <div>
                <h2>{{ row.exercise.name }}</h2>
                <p class="exercise-info">
                    {{ row.sets }} set × {{ row.reps }} rep · {{ row.rest }}'' recupero
                </p>
            </div>

            <div class="last-session">
            Ultima sessione:
                <strong>
                    {{ exerciseLogs[row.exercise._id || row.exercise]?.[exerciseLogs[row.exercise._id || row.exercise].length - 1]?.date || 'Nessuna' }}
                </strong>
            </div>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Kg</th>
                <th>Reps</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, i) in exerciseLogs[row.exercise._id || row.exercise]" :key="i">
                <td>{{ new Date(log.date).toLocaleDateString('it-IT') }}</td>
                <td>{{ log.load }} kg</td>
                <td>{{ log.reps }}</td>
              </tr>
            </tbody>
          </table>

          <div v-if="isClient" class="current-session">
            <span>{{ todayDate }}</span>
            <input type="number" placeholder="Kg"
              v-model="currentWeekInput[row.exercise._id || row.exercise].load"
              :disabled="isTrainer"
            />
            <input type="number" placeholder="Reps"
              v-model="currentWeekInput[row.exercise._id || row.exercise].reps"
              :disabled="isTrainer"
            />
          </div>
        </div>
        </section>

        <div v-if="isClient" class="save-container">
           <button class="btn-primary save-btn btn-green" @click="saveAllProgress">
                <i class="fa fa-save"></i>
                <span> Salva</span>
            </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.loader-container {
  text-align: center;
  padding: 48px 16px;
  color: #1e1548;
}

.split-page {
  width: 100%;
}

.split-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: .92rem;
}

.exercise-card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 18px;
  box-shadow: 0 3px 12px rgba(0,0,0,.05);
}

.exercise-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.exercise-title h2 {
  font-size: 1.1rem;
  color: #1e1548;
}

.exercise-info {
  margin-top: 4px;
  color: #6b7280;
  font-size: .92rem;
}

.last-session {
  display: inline-flex;
  align-items: center;
  gap:4px;
  width: fit-content;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: .85rem;
  color: #475569;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background: #eef2ff;
}

th, td {
  padding: 14px 18px;
  text-align: left;
  border-top: 1px solid #edf2f7;
  font-size: 0.95rem;
}

th {
  font-weight: 700;
  color: #1e1548;
}

.current-session {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 10px 18px;
  background: #fff8db;
  border-top: 1px solid #f3e5ab;
}


.current-session {
  background: #fff8db;
  border: 1px solid #f3e5ab;
}

.current-session span {
  font-weight: 700;
  color: #8a6d00;
}

.current-session input {
  width: 100%;
  min-height: 48px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 8px;
  font-size: .95rem;
  outline: none;
  transition: .2s ease;
}

.current-sessioninput:focus {
  border-color: #1e1548;
  box-shadow: 0 0 0 4px rgba(30,21,72,.08);
}

.current-session input:disabled {
  background: #f3f4f6;
}

.save-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid #e5e7eb;
  padding: 14px 16px;
  z-index: 999;
}

.save-btn {
  width: 100%;
  justify-content: center;
}

.split-page {
  padding-bottom: 100px;
}


@media (min-width: 768px) {

  .split-page {
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: 0;
  }

  .exercise-card {
    padding: 24px;
    border-radius: 22px;
  }

  .exercise-title {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .table-wrapper {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    padding: 14px 18px;
    font-weight: 700;
    background: #eef2ff;
    color: #1e1548;
  }

  .current-session {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 16px;
    align-items: center;
    border-radius: 0;
    padding: 16px 18px;
    border-top: 1px solid #edf2f7;
  }

  .current-session span::before {
    content: none !important;
  }

  .save-container {
    position: static;
    padding: 0;
    margin-top: 28px;
    border: none;
    background: transparent;
    backdrop-filter: none;
    display: flex;
    justify-content: flex-end;
  }

  .save-btn {
    width: 20%;
    font-size: 12pt;
  }
 
}
</style>