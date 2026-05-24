<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

//Spostare qqesto blocco a livello globale così di default per mobile il menù sarà chiuso, per il desktop sarà aperto
const sidebarOpen = ref(false)

const handleResize = () => {
  sidebarOpen.value = window.innerWidth >= 769
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

const isClient = computed(() => userLogged.value.role === 'client')
const isTrainer = computed(() => userLogged.value.role === 'trainer')

/**************** */

const loading = ref(false)
const todayDate = computed(() =>
  new Date().toLocaleDateString('it-IT')
)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({ 
  name: 'Alessandra', 
  surname: 'Versari', 
  role: 'trainer' 
})

const router = useRouter()
const exerciseLogs = ref({
  bench_press: [
    {
      date: '2026-05-15',
      weight: 75,
      reps: 10
    },
    {
      date: '2026-05-15',
      weight: 75,
      reps: 9
    },
    {
      date: '2026-05-15',
      weight: 75,
      reps: 9
    }
  ],

  squat: [
    {
      date: '2026-05-18',
      weight: 120,
      reps: 5
    }
  ]
})

const splitExercises = ref([
  {
    id: 'bench_press',
    name: 'Panca Piana',
    sets: 3,
    reps: 10,
    rest: 90,
    logs: exerciseLogs.value.bench_press
  },
  {
    id: 'squat',
    name: 'Squat',
    sets: 4,
    reps: 5,
    rest: 120,
    logs: exerciseLogs.value.squat
  }
])

const getTodayRows = (exercise) => {
  return Array.from({ length: exercise.sets }, () => ({
    weight: '',
    reps: ''
  }))
}

const currentSession = ref({})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role"  @close="sidebarOpen = false"/>

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }" >
      <div class="split-page">
        <div class="split-header">
            <div class="header-left">
                <button class="back-btn" @click="goBack">
                    <i class="fa fa-arrow-left"></i>
                </button>
                <div>
                    <h1>SPLIT A - PUSH</h1>
                    <p class="split-subtitle">  Storico allenamenti e compilazione sessione </p>
                </div>
            </div>
        </div>

        <!-- Lista di esercizi dello split selezioanto -->
        <section v-for="exercise in splitExercises" :key="exercise.id" class="exercise-card">

        <div class="exercise-title">
            <div>
                <h2>{{ exercise.name }}</h2>
                <p class="exercise-info">
                    {{ exercise.sets }} set × {{ exercise.reps }} rep · {{ exercise.rest }}'' recupero
                </p>
            </div>

            <div class="last-session">
            Ultima sessione:
                <strong>
                    {{ exercise.logs?.[0]?.date }}
                </strong>
            </div>
        </div>

        <div class="table-wrapper">
            <div class="table-header">
            <span>Data</span>
            <span>Kg</span>
            <span>Reps</span>
            </div>

            <div v-for="(log, i) in exercise.logs" :key="i" class="table-row" >
            <span>
                {{new Date(log.date).toLocaleDateString('it-IT') }}
            </span>
            <span>{{ log.weight }} kg</span>
            <span>{{ log.reps }}</span>
            </div>

            
            <div  v-if="isClient" v-for="(set, i) in getTodayRows(exercise)" :key="'today-' + i"  class="table-row current-session" >
            <span>{{ todayDate }}</span>
            <input type="number"  placeholder="Kg"  :disabled="isTrainer"/>
            <input type="number" placeholder="Reps":disabled="isTrainer" />
            </div>
        </div>
        </section>

        <div v-if="isClient" class="save-container">
           <button class="save-btn">
                <i class="fa fa-save"></i>
                <span> Salva</span>
            </button>
        </div>
      </div>
    </main>
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
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 16px;
  }
}

.split-page {
  max-width: 1100px;
  margin: 0 auto;
}

.split-header {
  margin-bottom: 2rem;
}

.split-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1e1548;
}

.split-subtitle {
  color: #666;
  margin-top: 8px;
}

/* CARD */
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

.exercise-title h2 {
  margin: 0;
  color: #1e1548;
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

/* TABLE */
.table-wrapper {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  align-items: center;
  gap: 16px;
}

.table-header {
  font-weight: 700;
  color: #555;
  padding: 0 16px 12px;
  border-bottom: 2px solid #eee;
}

.table-row {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f1f1;
}

.table-row:last-child {
  border-bottom: none;
}

/* TODAY SESSION */
.current-session {
  background: #fff7d6;
  border-radius: 14px;
  margin-top: 8px;
}

.current-session span {
  font-weight: 700;
  color: #8a6d00;
}

/* INPUT */
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

/* SAVE BUTTON */
.save-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.save-btn {
  background: #1e1548;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 34px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.save-btn:hover {
  transform: translateY(-2px);
}

/* MOBILE */
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

</style>