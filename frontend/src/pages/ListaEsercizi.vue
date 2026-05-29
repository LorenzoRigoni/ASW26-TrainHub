<script setup>
import { ref, onMounted, watch } from 'vue'
import { showToast } from '../utils/toast.js'
import axios from 'axios'
import { ROLES } from '../utils/utils.js'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

const exercises = ref([])
const loading = ref(true)
const sidebarOpen = ref(true)
const selectedPattern = ref('')
const showModal = ref(false)

const isEditing = ref(false)
const currentExerciseId = ref(null)

const newExercise = ref({
  name: '',
  movementPattern: '',
  description: '',
  image: null
})

const patterns = [
  'Tirata orizzontale', 'Tirata verticale', 'Spinta orizzontale', 
  'Spinta verticale', 'Accosciata', 'Estensione anca', 
  'Complementare tirata', 'Complementare spinta'
]

const userLogged = {
  name: localStorage.getItem('user_name'),
  surname: localStorage.getItem('user_surname'),
  role: localStorage.getItem('user_role')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleFileChange = (e) => {
  newExercise.value.image = e.target.files[0]
}

const fetchData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const params = selectedPattern.value ? { movementPattern: selectedPattern.value } : {}
    const res = await axios.get('http://localhost:5000/api/exercises', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    exercises.value = res.data.data
  } catch (err) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  currentExerciseId.value = null
  newExercise.value = { 
    name: '', 
    movementPattern: '', 
    description: '', 
    image: null 
  }
  showModal.value = true
}

const openEditModal = (exercise) => {
  isEditing.value = true
  currentExerciseId.value = exercise._id
  newExercise.value = {
    name: exercise.name,
    movementPattern: exercise.movementPattern,
    description: exercise.description || '',
    image: null
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', newExercise.value.name)
    formData.append('movementPattern', newExercise.value.movementPattern)
    formData.append('description', newExercise.value.description)
    
    if (newExercise.value.image) {
      formData.append('image', newExercise.value.image)
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }

    if (isEditing.value) {
      await axios.put(`http://localhost:5000/api/exercises/${currentExerciseId.value}`, formData, { headers })
    } else {
      await axios.post('http://localhost:5000/api/exercises', formData, { headers })
    }

    showModal.value = false
    showToast("Esercizio salvato con successo!", "success")
    fetchData()
  } catch (err) {
    showToast("Errore nel salvataggio dei dati: " + error, "error")
  }
}

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5000/api/exercises/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showToast("Esercizio eliminato con successo!", "error")
    fetchData()
  } catch (err) {
    showToast("Errore nel salvataggio dei dati: " + error, "error")
  }
}

watch(selectedPattern, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-esercizi">
        <div class="header-container">
          <div class="header-text">
            <h1 class="title">Esercizi</h1>
            <p class="subtitle">Elenco degli esercizi utilizzabili nei programmi.</p>
          </div>
          
          <div class="actions">
            <select v-model="selectedPattern" class="filter-select">
              <option value="">Tutti i pattern</option>
              <option v-for="p in patterns" :key="p" :value="p">{{ p }}</option>
            </select>
            
            <button v-if="userLogged.role === 'trainer'" class="btn-add" @click="openCreateModal">
              <i class="fa fa-plus"></i> Nuovo Esercizio
            </button>
          </div>
        </div>

        <div v-if="loading" class="loader">Caricamento...</div>

        <MainList v-else>
          <MainListItem
            v-for="e in exercises"
            :key="e._id"
            :title="e.name"
            :status="e.movementPattern"
            :description="e.description || 'Nessuna descrizione presente.'"
            :image="e.image ? `http://localhost:5000${e.image}` : null"
          >
            <template #subtitle>
              <div class="exercise-row">

                <div class="exercise-content">
                  <div class="image-container">
                    <img
                      v-if="e.image"
                      :src="`http://localhost:5000${e.image}`"
                      class="exercise-img"
                      @error="(el) => el.target.src = 'https://placehold.co/60x60?text=Error'"
                    />
                    <div v-else class="icon-placeholder">
                      <i class="fa fa-dumbbell"></i>
                    </div>
                  </div>

                  <div class="exercise-info">
                    <div class="text-container">
                      {{ e.description || 'Nessuna descrizione disponibile per questo esercizio.' }}
                    </div>

                    <div v-if="userLogged.role === 'trainer'" class="exercise-actions" >
                      <button class="btn-action edit" @click.stop="openEditModal(e)" title="Modifica">
                        <i class="fa fa-edit"></i>
                      </button>

                      <button class="btn-action delete" @click.stop="handleDelete(e._id)" title="Elimina" >
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </MainListItem>
        </MainList>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Modifica Esercizio' : 'Aggiungi Nuovo Esercizio' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Nome Esercizio*</label>
            <input v-model="newExercise.name" required type="text" placeholder="Es: Panca Piana">
          </div>

          <div class="form-group">
            <label>Pattern di Movimento*</label>
            <select v-model="newExercise.movementPattern" required>
              <option value="" disabled>Seleziona pattern</option>
              <option v-for="p in patterns" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Descrizione</label>
            <textarea v-model="newExercise.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Immagine</label>
            <input type="file" @change="handleFileUpload" accept="image/*">
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-primary btn-red"><i class="fa fa-close" aria-hidden="true"></i>Annulla</button>
            <button type="submit" class="btn-primary"><i class="fa fa-check" aria-hidden="true"></i>Salva Esercizio</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

.exercise-row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 12px;
  width: 100%;
}

.exercise-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
}

.exercise-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eef0f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.text-container {
  font-size: 10pt;
  color: #4b5563;
  line-height: 1.5;
  text-transform: uppercase;
}

.exercise-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  font-family: 'Century Gothic', 'Century Gothic', Futura, sans-serif;
  margin-right: 5pt;
}

.btn-add {
  background-color: #1e1548;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-action {
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-action.edit {
  background-color: #eff6ff;
  color: #2563eb;
}

.btn-action.edit:hover {
  background-color: #dbeafe;
}

.btn-action.delete {
  background-color: #fef2f2;
  color: #dc2626;
}

.btn-action.delete:hover {
  background-color: #fee2e2;
}

.img-preview-mini {
  font-size: 0.8rem;
  color: #b9b610;
  margin-top: 0.3rem;
}

</style>