<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from '../utils/toast.js'

import axios from 'axios'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'


const route = useRoute()
const router = useRouter()

const program = ref(null)
const exercisesDb = ref([])
const loading = ref(true)
const sidebarOpen = ref(true)
const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const fetchData = async () => {
  try {
    const programId = route.params.id
    const resProgram = await axios.get(`http://localhost:5000/api/training-programs/${programId}`, config)
    const rawProgram = resProgram.data.data

    if (rawProgram && rawProgram.splits) {
      rawProgram.splits.forEach(split => {
        if (!split.rows) split.rows = []
        split.rows.forEach(row => {
          if (row.exercise && typeof row.exercise === 'object') {
            row.exercise = row.exercise._id
          }
        })
      })
      
      program.value = rawProgram
    } else {
      showToast("Struttura dei dati del programma non valida", "error")
    }

    const resEx = await axios.get('http://localhost:5000/api/exercises', config)
    exercisesDb.value = resEx.data.data
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const addExercise = (split) => {
  split.rows.push({
    rowId: split.rows.length + 1,
    exercise: "",
    movementPattern: "Generale",
    sets: 0,
    reps: 0,
    rest: 0,
    technique: "",
    notes: ""
  })
}

const removeExercise = (split, index) => {
  split.rows.splice(index, 1)
}

const saveDraft = async () => {
  try {
    const programId = route.params.id
    
    const payload = {
      title: program.value.title,
      splits: program.value.splits,
      notes: program.value.notes
    }

    await axios.put(`http://localhost:5000/api/training-programs/draft/${programId}`, payload, config)
    showToast("Draft salveto con successo!", "success")
    router.push('/programmi')
  } catch (error) {
    showToast("Errore nel salvataggio del draft: " + error, "error")
  }
}

const publishProgram = async () => {
  try {
    await axios.patch(`http://localhost:5000/api/training-programs/publish/${program.value._id}`, {}, config)
    showToast("Programma caricato con successo!", "success")
    router.push('/programmi')
  } catch (error) {
    showToast("Errore nella pubblicazione: " + error, "error")
  }
}

const toggleSidebar = () => { 
  sidebarOpen.value = !sidebarOpen.value 
}

</script>
<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div v-if="loading" class="loader">Caricamento in corso...</div>

      <template v-else-if="program">
        <div class="header-text">
            <h1 class="title">
              {{ program.title || 'Nessun titolo inserito' }}
            </h1>
          <p class="subtitle">Stai modificando la bozza per l'atleta. Ricorda di salvare prima di uscire.</p>
        </div>

        <div v-for="split in program.splits" :key="split._id" class="split">
          <div class="split-header">
            <div class="input-group" style="flex: 1; max-width: 250px;">
              <label>Nome Split</label>
              <input 
                v-model="split.name" 
                placeholder="Es. Split A / Upper" 
                style="font-size: 14pt; font-weight: bold; height: 40px; background: #fff; border-radius: 10px;"
              />
            </div>

            <button @click="addExercise(split)" class="secondary-button" >
              <i class="fa fa-plus"></i> Aggiungi esercizio
            </button>
          </div>

          <div v-for="(row, index) in split.rows" :key="index" class="exercise-row">
            <div class="input-group exercise-select">
              <label>Esercizio</label>
              <select v-model="row.exercise">
                <option value="" disabled>Scegli...</option>
                <option v-for="ex in exercisesDb" :key="ex._id" :value="ex._id">
                  {{ ex.name }} ({{ ex.movementPattern }})
                </option>
              </select>
            </div>

            <div class="input-group technique-field">
              <label>Tecnica</label>
              <input v-model="row.technique" placeholder="es. Drop set" />
            </div>

            <div class="input-group small-input">
              <label>Serie</label>
              <input type="number" v-model.number="row.sets" />
            </div>

            <div class="input-group small-input">
              <label>Rep</label>
              <input type="number" v-model.number="row.reps" />
            </div>

            <div class="input-group small-input">
              <label>Rest (s)</label>
              <input type="number" v-model.number="row.rest" />
            </div>

            <button @click="removeExercise(split, index)" class="delete-button">
              <i class="fa fa-trash-o"></i>
            </button>
          </div>
        </div>

        <div class="actions">
          <button @click="router.push('/programmi')" class="btn-primary btn-red">
            <i class="fa fa-close"></i>Annulla</button>
          <button @click="saveDraft" class="btn-primary btn-green">
            <i class="fa fa-save"></i> Salva e Chiudi
          </button>
          <button @click="publishProgram" class="btn-primary" style="margin-right: 0;">
            <i class="fa fa-paper-plane"></i> Consegna Programma
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.split{
  background-color: white;
  margin-bottom: 20pt;
  border-radius: 10pt;
  padding: 10pt;
}

.split-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}

.split-header h2 {
  margin: 0;
  font-size: 18pt;
  font-weight: bold;
}

.exercise-card {
  padding: 10px;
  margin-top: 7px;
}

.exercise-row {
  display: flex;
  align-items:center;
  gap: 12px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10pt;
}

.input-group label {
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

.exercise-select {
  flex: 2;
  min-width: 220px;
}

.technique-field {
  flex: 1.5;
  min-width: 180px;
}

.small-input {
  width: 90px;
}

.input-group input,
.input-group select {
  height: 46px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 0 14px;
  background: #f9fafb;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #1e1548;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(30, 21, 72, 0.08);
}

.input-group select {
  appearance: none;
  cursor: pointer;
}

@media (max-width: 1000px) {
  .exercise-row {
    flex-wrap: wrap;
    align-items: stretch;
  }

  .exercise-select,
  .technique-field,
  .small-input {
    width: 100%;
  }

  .delete-button {
    width: 100%;
  }
}
</style>