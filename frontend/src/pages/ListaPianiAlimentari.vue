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
  notes: '',
  startDate: today,
  endDate: today
})

const selectedFile = ref(null)

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT')
}

const calculateStatus = (startDate, endDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  if (today >= start && today <= end) {
    return { text: 'Attivo', class: 'status-active' }
  } else {
    return { text: 'Inattivo', class: 'status-inactive' }
  }
}

const loadPlans = async () => {
  try {
    const url = userLogged.value.role === 'nutritionist' 
      ? 'http://localhost:5000/api/nutrition-plans/nutritionist/plans' 
      : 'http://localhost:5000/api/nutrition-plans/my-plans'
    
    const response = await axios.get(url, config)
    nutritionPlans.value = response.data.data
  } catch (error) {
    console.error("Errore nel caricamento dei piani alimentari:", error)
  }
}

const loadClients = async () => {
  if (userLogged.value.role !== 'nutritionist') return
  try {
    const response = await axios.get('http://localhost:5000/api/users/my-clients', config)
    clients.value = response.data.data
  } catch (error) {
    console.error("Errore nel caricamento degli atleti:", error)
  }
}

onMounted(async () => {
  await Promise.all([loadPlans(), loadClients()])
})

const savePlan = async () => {
  if (!selectedFile.value) {
    //TODO: messaggio di errore visibile
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('athleteId', form.value.athleteId);
    formData.append('startDate', form.value.startDate);
    formData.append('endDate', form.value.endDate);
    formData.append('notes', form.value.notes);
    formData.append('pdfFile', selectedFile.value); 

    const response = await axios.post(
      'http://localhost:5000/api/nutrition-plans', 
      formData, 
      {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        }
      }
    );

    showModal.value = false;
    form.value = { title: '', athleteId: '', notes: '', pdfFile: '', startDate: today, endDate: today };
    selectedFile.value = null;
    
    await loadPlans();
    //TODO: alert("Piano alimentare salvato con successo!");
  } catch (error) {
    console.error(error.response?.data?.message || "Errore nel salvataggio del piano")
  }
}

const downloadPdf = (plan) => {
  const fileUrl = `http://localhost:5000${plan.pdfUrl}`
  window.open(fileUrl, '_blank')
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
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
        </div>
        <button class="btn-primary" @click="openModal" v-if="userLogged.role === 'nutritionist'">
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
          :subtitle="userLogged.role === 'nutritionist' 
            ? `${plan.athleteId?.name} ${plan.athleteId?.surname} - Periodo dal ${formatDate(plan.startDate)} al ${formatDate(plan.endDate)}` 
            : `Dott. ${plan.nutritionistId?.name} ${plan.nutritionistId?.surname} - Periodo dal ${formatDate(plan.startDate)} al ${formatDate(plan.endDate)}`"
          :status="calculateStatus(plan.startDate, plan.endDate).text"
          @click="downloadPdf(plan)"
          style="cursor: pointer;"
        >
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

        <div class="form-row full-width">
          <label for="pdf-file">Allega PDF del Piano</label>
          <input 
            type="file" 
            id="pdfFile" 
            accept="application/pdf" 
            @change="handleFileChange" 
            required
          />
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

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plan-title {
  margin: 0;
  font-size: 1.1rem;
  color: #1e1548;
}

.plan-title span {
  font-weight: 500;
  color: #5b47c5;
}

.plan-dates {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.plan-notes {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
}

/* Stili per i Badge di Stato */
.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-active {
  background-color: #e6f7ed;
  color: #1f9254;
  border: 1px solid #a3e2bd;
}

.status-inactive {
  background-color: #f5f5f7;
  color: #6c757d;
  border: 1px solid #dee2e6;
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