<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

//Spostare qqesto blocco a livello globale così di default per mobile il menù sarà chiuso, per il desktop sarà aperto
const sidebarOpen = ref(false)

const router = useRouter()
const route = useRoute()

const auth = useAuthStore()

const handleResize = () => {
  sidebarOpen.value = window.innerWidth >= 769
}

const isClient = computed(() => auth.user.role === 'client')
const isTrainer = computed(() => auth.user.role === 'trainer')

const loading = ref(false)
const todayDate = computed(() =>
  new Date().toLocaleDateString('it-IT')
)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const programId = route.params.programId
const splitId = route.params.splitId
const athleteId = route.params.athleteId || ''

const exerciseLogs = ref({})
const currentWeekInput = ref({})
const splitExercises = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const programRes = await axios.get(`http://localhost:5000/api/training-programs/${programId}`, auth.apiConfig)
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
    const logsRes = await axios.get(`http://localhost:5000/api/exercise-logs/${programId}/${splitId}${urlParamAthlete}`, auth.apiConfig)

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
    showToast("Errore nel caricamento dei dati: " + error, "error")
  } finally {
    loading.value = false
  }
}

const saveAllProgress = async () => {
  try {
    const savePromises = Object.keys(currentWeekInput.value).map(async (exId) => {
      const input = currentWeekInput.value[exId]
      if (input.load !== '' || input.reps !== '') {
        return axios.post(`http://localhost:5000/api/exercise-logs/${programId}/${splitId}`, {
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
    showToast("Errore nel salvataggio dei progressi: " + error, "error")
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  fetchData()
})

const currentSession = ref({})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role="auth.user.role"  @close="sidebarOpen = false"/>

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }" >
      <div v-if="loading" class="loader-container">
        <i class="fa fa-spinner fa-spin"></i> Caricamento dati...
      </div>

      <div class="split-page">
        <div class="page-header">
            <div class="header-left">
                <button class="back-btn" @click="goBack">
                    <i class="fa fa-arrow-left"></i>
                </button>
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
            <div class="table-header">
              <span>Data</span>
              <span>Kg</span>
              <span>Reps</span>
            </div>

            <div v-for="(log, i) in exerciseLogs[row.exercise._id || row.exercise]" :key="i" class="table-row" >
            <span>{{new Date(log.date).toLocaleDateString('it-IT') }}</span>
            <span>{{ log.load }} kg</span>
            <span>{{ log.reps }}</span>
            </div>

            
            <div  v-if="isClient" :key="'today-' + i"  class="table-row current-session" >
              <span>{{ todayDate }}</span>
              <input 
                type="number" 
                placeholder="Kg" 
                v-model="currentWeekInput[row.exercise._id || row.exercise].load"
                :disabled="isTrainer"
              />
              <input 
                type="number" 
                placeholder="Reps"
                v-model="currentWeekInput[row.exercise._id || row.exercise].reps"
                :disabled="isTrainer" 
              />
            </div>
        </div>
        </section>

        <div v-if="isClient" class="save-container">
           <button class="btn-primary save-btn" @click="saveAllProgress">
                <i class="fa fa-save"></i>
                <span> Salva</span>
            </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.split-page {
  max-width: 90%;
  margin: 0 auto;
}

.exercise-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.exercise-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}


.exercise-info {
  margin-top: 8px;
  color: #777;
  font-size: 0.95rem;
}

.last-session {
  font-size: 0.9rem;
  color: #666;
}


.table-wrapper {
  overflow-x: auto;
  border:1px solid #d1c5c5;
  border-radius: 7pt;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  align-items: center;
  gap: 16px;
}

.table-header {
  font-weight: bold;
  color: #0f0a2e;
  padding: 10px;
  border-bottom: 2px solid #eee;
  background-color: #bfcaee;
  border-top-left-radius: 7pt;
  border-top-right-radius: 7pt;
}

.table-row {
  padding: 14px 16px;
}

.table-row:last-child {
  border-bottom: none;
}

.current-session {
  background: #fff7d6;
  border-radius: 14px;
  margin-top: 8px;
}

.current-session span {
  font-weight: 700;
  color: #8a6d00;
}

.table-row input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  font-size: 0.95rem;
  background: white;
  outline: none;
  transition: 0.2s;
}

.table-row input:focus {
  border-color: #1e1548;
}

.table-row input:disabled {
  background: #f3f3f3;
  cursor: not-allowed;
}

.save-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.save-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .exercise-title {
    flex-direction: column;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 1fr;
    font-size: 0.9rem;
  }

  .table-row input {
    padding: 10px;
  }

  .save-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    background: white;
    padding: 14px 16px;
    border-top: 1px solid #eee;

    display: flex;
    justify-content: center;
    z-index: 999;
  }

  .save-btn {
    width: 100%;
    justify-content: center;
  }

  .split-page {
    padding-bottom: 90px; 
  }
}

.back-btn {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  margin-right: 12px;
  transition: 0.2s;
}

.back-btn:hover {
  transform: translateX(-2px);
  background: #f7f7f7;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loader-container {
  text-align: center; 
  padding: 2rem;
}
</style>