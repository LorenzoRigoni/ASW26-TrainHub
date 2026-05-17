<script setup>
import { ref, computed } from 'vue'
import { ROLES } from '../utils/utils.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import { useRouter } from 'vue-router'


const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const router = useRouter()

const program = ref({
  id: 1,
  title: 'Ipertrofia Upper/Lower',
  splits: [
    {
      id: 1,
      name: 'Upper A',
      exercises: []
    },
    {
      id: 2,
      name: 'Lower A',
      exercises: []
    }
  ]
})

//TODO dati di test, sostituire
const userLogged = ref({
  name: 'Alessandra',
  surname: 'Versari',
  role: 'trainer'
})

const addExercise = (split) => {
  split.exercises.push({
    id: Date.now(),
    name: '',
    technique: '',
    sets: 3,
    reps: 10,
    rest: 60
  })
}

</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen"  :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="header">
          <h1 class="title">Bozza programma</h1>
          <p class="subtitle">
            Aggiungi e rimuovi esercizi su ciascuna split. Per rendere il programma visibile al cliente, una volta terminata la compilazione clicca su "Consegna Programma".
          </p>
      </div>
      <div v-for="split in program.splits" :key="split.id" class="split">
        <div class="split-header">
          <h2>{{ split.name }}</h2>
          <button @click="addExercise(split)" class="secondary-button"> + Aggiungi esercizio</button>
        </div>
        <div
          v-for="exercise in split.exercises"
          :key="exercise.id"
          class="exercise-card"
        >
          <div class="exercise-row">

            <!-- select esercizio -->
            <div class="input-group exercise-select">
              <label>Esercizio</label>

              <select v-model="exercise.name">
                <option disabled value="">
                  Seleziona esercizio
                </option>

                <option>Panca Piana</option>
                <option>Lat Machine</option>
                <option>Squat</option>
                <option>Military Press</option>
              </select>
            </div>

            <!-- tecnica -->
            <div class="input-group technique-field">
              <label>Tecnica</label>
              <input
                v-model="exercise.technique"
                placeholder="Drop set"
              />
            </div>

            <!-- serie -->
            <div class="input-group small-input">
              <label>Serie</label>
              <input
                type="number"
                v-model="exercise.sets"
              />
            </div>

            <!-- reps -->
            <div class="input-group small-input">
              <label>Rep</label>
              <input
                type="number"
                v-model="exercise.reps"
              />
            </div>

            <!-- recupero -->
            <div class="input-group small-input">
              <label>Rec</label>
              <input
                type="number"
                v-model="exercise.rest"
              />
            </div>

            <button class="delete-button">
              <i class="fa fa-trash-o"></i>
            </button>

          </div>
        </div>
      </div>
      <div class="actions">
        <button  class="btn-primary"> Consegna Programma </button>

        <button  class="btn-primary red-button" @click="router.push('/bozze')">Annulla</button>

        <button class="btn-primary green-button">Salva e Chiudi</button>
      </div>
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