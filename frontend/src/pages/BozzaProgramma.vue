<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRouter, useRoute } from 'vue-router'

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
      console.error("Struttura dati del programma non valida:", resProgram.data)
    }

    const resEx = await axios.get('http://localhost:5000/api/exercises', config)
    exercisesDb.value = resEx.data.data
  } catch (error) {
    console.error("Errore caricamento dati:", error)
    alert("Errore nel recupero della bozza")
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
    router.push('/programmi')
  } catch (error) {
    console.error("Errore salvataggio:", error)
  }
}

const publishProgram = async () => {
  if (!confirm("Vuoi pubblicare il programma? L'atleta riceverà una notifica e non potrai più modificare la struttura.")) return
  
  try {
    await axios.patch(`http://localhost:5000/api/training-programs/publish/${program.value._id}`, {}, config)
    router.push('/programmi')
  } catch (error) {
    console.error("Errore pubblicazione:", error)
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
        <div class="header">
          <div class="input-group" style="flex: 1; min-width: 300px;">
            <label for="program-title-input">Titolo del Programma</label>
            <h2 class="title">
              {{ program.title || 'Nessun titolo inserito' }}
            </h2>
          </div>
          <p class="subtitle">Stai modificando la bozza per l'atleta. Ricorda di salvare prima di uscire.</p>
        </div>

        <div v-for="split in program.splits" :key="split._id" class="split">
          <div class="split-header" style="display: flex; gap: 1.5rem; align-items: flex-end; flex-wrap: wrap;">
            <div class="input-group" style="flex: 1; max-width: 250px;">
              <label>Nome Split</label>
              <input 
                v-model="split.name" 
                placeholder="Es. Split A / Upper" 
                style="font-size: 14pt; font-weight: bold; height: 40px; background: #fff; border-radius: 10px;"
              />
            </div>

            <button @click="addExercise(split)" class="secondary-button" style="height: 40px; margin-bottom: 0;">
              <i class="fa fa-plus"></i> Aggiungi esercizio
            </button>
          </div>

          <div v-for="(row, index) in split.rows" :key="index" class="exercise-row" style="margin-bottom: 15px;">
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
          <button @click="router.push('/programmi')" class="btn-primary red-button">
            <i class="fa fa-close"></i>Annulla</button>
          <button @click="saveDraft" class="btn-primary green-button">
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
.main-content {
  margin-top: 60px;
  margin-left: 10pt;
  padding: 20px;
  padding-bottom: 50px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f9;
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}


.header {
  display:flow-root;
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

.split{
  background-color: white;
  margin-bottom: 20pt;
  border-radius: 10pt;
  padding: 10pt;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 7pt;
  font-size: 12pt;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30,21,72,0.25);
  transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
  margin-right: 10pt;
}

.btn-primary:hover ,.secondary-button:hover {
  background-color: #7a768d;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30,21,72,0.35);
}

/************************************** */
.green-button{
  background-color: rgb(33, 143, 33);
}

.red-button{
  background-color: #dc2626;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.secondary-button{
  align-items: center;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 7pt;
  font-size: 9pt;
  font-weight:bold;
  margin: 5pt; 
  margin-right: 0;
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

/* ---------- EXERCISE CARD ---------- */

.exercise-card {

  padding: 10px;
  margin-top: 7px;

}


.exercise-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
}


.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

/* modern inputs */

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


.delete-button {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 14px;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.delete-button i {
  font-size: 16px;
}

.delete-button:hover {
  background: #fee2e2;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.15);
}

.delete-button:active {
  transform: scale(0.96);
}

/* responsive */
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