<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const nutritionPlans = ref([])
const clients = ref([])
const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  title: '',
  athleteId: '',
  description: '',
  dailyCalories: '',
  proteins: '',
  carbs: '',
  fats: '',
  notes: '',
  startDate: today,
  endDate: today
})

const getAuthConfig = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

const loadPlans = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/nutrition-plans/nutritionist/plans', getAuthConfig())
    nutritionPlans.value = response.data.data || []
  } catch (error) {
    console.error('Errore caricamento piani:', error.response?.data?.message || error.message)
  }
}

const loadClients = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/my-clients', getAuthConfig())
    clients.value = response.data.data || []
  } catch (error) {
    console.error('Errore caricamento clienti:', error.response?.data?.message || error.message)
  }
}

onMounted(async () => {
  await Promise.all([loadPlans(), loadClients()])
})

const openModal = () => {
  form.value = {
    title: '',
    athleteId: '',
    description: '',
    dailyCalories: '',
    proteins: '',
    carbs: '',
    fats: '',
    notes: '',
    startDate: today,
    endDate: today
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const savePlan = async () => {
  try {
    if (!form.value.athleteId) {
      alert('Seleziona un cliente per il piano')
      return
    }

    const payload = {
      athleteId: form.value.athleteId,
      title: form.value.title,
      description: form.value.description,
      dailyCalories: form.value.dailyCalories ? Number(form.value.dailyCalories) : null,
      macros: {
        proteins: form.value.proteins ? Number(form.value.proteins) : null,
        carbs: form.value.carbs ? Number(form.value.carbs) : null,
        fats: form.value.fats ? Number(form.value.fats) : null
      },
      notes: form.value.notes,
      startDate: form.value.startDate,
      endDate: form.value.endDate
    }

    const response = await axios.post('http://localhost:5000/api/nutrition-plans', payload, getAuthConfig())
    nutritionPlans.value.unshift(response.data.data)
    closeModal()
  } catch (error) {
    console.error('Errore salvataggio piano:', error.response?.data?.message || error.message)
  }
}

const formatStatus = (status) => {
  if (status === 'active') return 'Attivo'
  if (status === 'draft') return 'Bozza'
  if (status === 'archived') return 'Archiviato'
  return status
}

const openPdf = (plan) => {
  alert('Dettaglio piano non ancora implementato')
}
</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu
      :isOpen="sidebarOpen"
      :role="userLogged.role"
      @close="sidebarOpen = false"
    />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1>Piani alimentari</h1>
          <p>Gestisci e assegna i programmi alimentari ai clienti</p>
        </div>
        <button class="btn-primary" @click="openModal">
          <i class="fa fa-plus"></i>
          Carica piano alimentare
        </button>
      </div>

      <!-- LISTA -->
      <MainList>
        <ListItem
          v-for="plan in nutritionPlans"
          :key="plan._id"
          :title="plan.title"
          :status="formatStatus(plan.planStatus)"
          icon="fa fa-utensils"
          @click="openPdf(plan)"
        >

          <template #subtitle>
            {{ plan.athleteId?.name }} {{ plan.athleteId?.surname }} ·
            {{ new Date(plan.startDate).toISOString().split('T')[0] }} -
            {{ new Date(plan.endDate).toISOString().split('T')[0] }}
          </template>
        </ListItem>
      </MainList>
    </main>

    <Footer />

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Carica piano alimentare</h2>
        </div>

        <!-- TITOLO -->
        <div class="form-row">
          <label>Titolo</label>
          <input type="text" placeholder="Nome piano" v-model="form.title"/>
        </div>

        <!-- CLIENTE -->
        <div class="form-row">
          <label>Cliente</label>
          <select v-model="form.athleteId">
            <option value="">Seleziona cliente</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }} {{ client.surname }}
            </option>
          </select>
        </div>

        <!-- DESCRIPTION -->
        <div class="form-row full-width">
          <label>Descrizione</label>
          <textarea v-model="form.description" placeholder="Descrivi gli obiettivi e le indicazioni"></textarea>
        </div>

        <!-- CALORIE E MACRO -->
        <div class="form-row">
          <label>Calorie giornaliere</label>
          <input type="number" min="0" v-model.number="form.dailyCalories" />
        </div>

        <div class="form-row">
          <label>Proteine (g)</label>
          <input type="number" min="0" v-model.number="form.proteins" />
        </div>

        <div class="form-row">
          <label>Carboidrati (g)</label>
          <input type="number" min="0" v-model.number="form.carbs" />
        </div>

        <div class="form-row">
          <label>Grassi (g)</label>
          <input type="number" min="0" v-model.number="form.fats" />
        </div>

        <!-- DATE -->
        <div class="form-row">
          <label>Data inizio</label>
          <input type="date" v-model="form.startDate"/>
        </div>

        <div class="form-row">
          <label>Data fine</label>
          <input type="date" v-model="form.endDate" />
        </div>

        <div class="form-row full-width">
          <label>Note</label>
          <textarea v-model="form.notes" placeholder="Note aggiuntive per il cliente"></textarea>
        </div>

        <!-- ACTIONS -->
        <div class="modal-actions">
          <button class="btn-danger" @click="closeModal">Annulla</button>
          <button class="btn-primary" @click="savePlan">Crea piano</button>
        </div>
      </div>
    </div>
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
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.page-header h1 {
  margin: 0;
  color: #1e1548;
}

.page-header p {
  margin-top: 6px;
  color: #666;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1e1548;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn-primary:hover {
  background: #2f2275;
}

.btn-danger {
  background: #d62828;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 600;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 16px;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.modal-header h2 {
  margin: 0;
  color: #1e1548;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.form-row label {
  width: 120px;
  font-weight: 600;
  color: #333;
}

.form-row input,
.form-row select,
.form-row textarea {
  flex: 1;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  background: white;
}

.form-row textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  outline: none;
  border-color: #5b47c5;
  box-shadow: 0 0 0 4px rgba(91,71,197,0.12);
}

.full-width {
  flex-direction: column;
  align-items: stretch;
}

.full-width label {
  width: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header button {
    width: 100%;
    max-width: none;
  }

  .modal {
    width: calc(100% - 24px);
    max-width: 100%;
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .form-row label {
    width: auto;
  }

  .modal-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }
}

</style>