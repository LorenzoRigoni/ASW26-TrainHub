<script setup>
import { ref, onMounted } from 'vue'
import { getErrorMessage } from '../utils/utils.js'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { API_URL } from '../utils/config.js'
import { useSidebarStore } from '../stores/sidebar.js'

import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import BackButton from '../components/GoBackButton.vue'


const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const sidebar = useSidebarStore()

const program = ref(null)
const exercisesDb = ref([])
const loading = ref(true)

const fetchData = async () => {
  try {
    const programId = route.params.id
    const resProgram = await axios.get(`${API_URL}/api/training-programs/${programId}`, auth.apiConfig)
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

    const resEx = await axios.get(`${API_URL}/api/exercises`, auth.apiConfig)
    exercisesDb.value = resEx.data.data
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
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

    await axios.put(`${API_URL}/api/training-programs/draft/${programId}`, payload, auth.apiConfig)
    showToast("Draft salvato con successo!", "success")
    router.push('/bozze')
  } catch (error) {
    showToast("Errore nel salvataggio del draft: " + getErrorMessage(error), "error")
  }
}

const publishProgram = async () => {
  try {
    await axios.patch(`${API_URL}/api/training-programs/publish/${program.value._id}`, {}, auth.apiConfig)
    showToast("Programma pubblicato con successo!", "success")
    router.push('/programmi')
  } catch (error) {
    showToast("Errore nella pubblicazione: " + getErrorMessage(error), "error")
  }
}

</script>
<template>
  <div id="app">
    <Navbar @toggle-sidebar="sidebar.toggle" />
    <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
    <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
      <div v-if="loading" class="loader">Caricamento in corso...</div>

      <template v-else-if="program">
        <div class="header-container">
          <BackButton />
          <div class="header-text">
            <h1 class="title"> {{ program.title || 'Nessun titolo inserito' }}</h1>
            <p class="subtitle">Stai modificando la bozza per l'atleta. Ricorda di salvare prima di uscire.</p>
          </div>
        </div>

        <div v-for="split in program.splits" :key="split._id" class="split">
          <div class="split-header">
            <div class="input-group" style="flex: 1; max-width: 250px;">
              <label :for="`split-${split._id}`">Nome Split</label>
              <input 
                :id="`split-${split._id}`"
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
              <label :for="`exercise-${split._id}-${index}`">Esercizio</label>
              <select :id="`exercise-${split._id}-${index}`" v-model="row.exercise">
                <option value="" disabled>Scegli...</option>
                <option v-for="ex in exercisesDb" :key="ex._id" :value="ex._id">
                  {{ ex.name }} ({{ ex.movementPattern }})
                </option>
              </select>
            </div>

            <div class="input-group technique-field">
              <label :for="`technique-${split._id}-${index}`">Tecnica</label>
              <input :id="`technique-${split._id}-${index}`" v-model="row.technique" placeholder="es. Drop set" />
            </div>

            <div class="input-group small-input">
              <label :for="`serie-${split._id}-${index}`">Serie</label>
              <input :id="`serie-${split._id}-${index}`" type="number" v-model.number="row.sets" />
            </div>

            <div class="input-group small-input">
              <label :for="`rep-${split._id}-${index}`">Rep</label>
              <input :id="`rep-${split._id}-${index}`" type="number" v-model.number="row.reps" />
            </div>

            <div class="input-group small-input">
              <label :for="`rest-${split._id}-${index}`">Rest (s)</label>
              <input :id="`rest-${split._id}-${index}`" type="number" v-model.number="row.rest" />
            </div>

            <button @click="removeExercise(split, index)" class="delete-button" aria-label="Elimina esercizio">
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
.split {
  background: white;
  margin-bottom: 20px;
  border-radius: 16px;
  padding: 16px;
}

.split-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  margin-bottom: 20px;
}

.split-header .secondary-button {
  width: 100%;
  justify-content: center;
}

.exercise-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 14px;
  background: #f9fafb;
  border-radius: 14px;
  margin-bottom: 12px;
}


.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

.exercise-select,
.technique-field,
.small-input {
  width: 100%;
}

.input-group input,
.input-group select {
  width: 100%;
  height: 48px;
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
  background: white;
  box-shadow: 0 0 0 4px rgba(30, 21, 72, 0.08);
}

.input-group select {
  appearance: none;
  cursor: pointer;
}

.delete-button {
  width: 20%;
  height: 46px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions button {
  width: 100%;
  justify-content: center;
}


@media (min-width: 768px) {

  .split-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .split-header .secondary-button {
    width: auto;
  }

  .exercise-row {
    display: grid;
    grid-template-columns:
      2fr
      1.4fr
      80px
      80px
      80px
      52px;
    align-items: end;
    gap: 12px;
    background: transparent;
    padding: 0;
  }

  .delete-button {
    width: 46px;
  }

  .actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .actions button {
    width: auto;
  }
}

</style>