<script setup>
import { ref, onMounted, watch } from 'vue'
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
  } catch (error) {
    console.error("Errore:", error)
  } finally {
    loading.value = false
  }
}

// If the filter change, reload
watch(selectedPattern, fetchData)

onMounted(fetchData)

const handleFileUpload = (event) => {
  newExercise.value.image = event.target.files[0]
}

const saveExercise = async () => {
  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', newExercise.value.name)
    formData.append('movementPattern', newExercise.value.movementPattern)
    formData.append('description', newExercise.value.description)
    if (newExercise.value.image) {
      formData.append('image', newExercise.value.image)
    }

    await axios.post('http://localhost:5000/api/exercises', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      }
    })

    showModal.value = false
    newExercise.value = { name: '', movementPattern: '', description: '', image: null }
    fetchData()
  } catch (error) {
    alert("Errore durante il salvataggio: " + (error.response?.data?.message || error.message))
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
      <div class="lista-esercizi">
        <div class="header-container">
          <div class="header-text">
            <h1 class="title">Esercizi</h1>
            <p class="subtitle">Database degli esercizi utilizzabili nei programmi.</p>
          </div>
          
          <div class="actions">
            <select v-model="selectedPattern" class="filter-select">
              <option value="">Tutti i pattern</option>
              <option v-for="p in patterns" :key="p" :value="p">{{ p }}</option>
            </select>
            
            <button v-if="userLogged.role === 'trainer'" @click="showModal = true" class="btn-add">
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
          >
            <template #subtitle>
              <div class="exercise-row">
                <div class="image-container">
                  <img 
                    v-if="e.image" 
                    :src="`http://localhost:5000${e.image}`" 
                    class="exercise-img"
                    @error="(el) => el.target.src = 'https://placehold.co/60)x60?text=Error'"
                  />
                  <div v-else class="icon-placeholder">
                    <i class="fa fa-dumbbell"></i>
                  </div>
                </div>

                <div class="text-container">
                  {{ e.description || 'Nessuna descrizione disponibile per questo esercizio.' }}
                </div>
              </div>
            </template>
          </MainListItem>
        </MainList>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Crea Nuovo Esercizio</h2>
        <form @submit.prevent="saveExercise">
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
            <button type="button" @click="showModal = false" class="btn-cancel">Annulla</button>
            <button type="submit" class="btn-save">Salva Esercizio</button>
          </div>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.lista-esercizi {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.subtitle   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.header {
  display: flex;
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

.main-content {
  margin-top: 60px;      
  margin-left: 0;
  padding-bottom: 50px;   
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

.exercise-row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 12px;
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
  flex: 1;
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
  text-transform: uppercase;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
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

.btn-cancel { background: #eee; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; }
.btn-save { background: #1e1548; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; }

.img-preview-mini {
  font-size: 0.8rem;
  color: #10b981;
  margin-top: 0.3rem;
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

/*Sidebar in mobile*/
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>