<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { API_URL } from '../utils/config.js'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { useSidebarStore } from '../stores/sidebar.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import AppModal from '../components/Modal.vue'

const auth = useAuthStore()
const sidebar = useSidebarStore()

const nutritionPlans = ref([])
const clients = ref([])
const showModal = ref(false)
const today = new Date().toISOString().split('T')[0]
const selectedFile = ref(null)

const planForm = ref({
  title: '',
  athleteId: '',
  notes: '',
  pdfUrl: '',
  startDate: today,
  endDate: today
})

const openModal = (plan) => {
  planForm.value = {
    title: plan.title,
    athleteId: plan.athleteId?._id || plan.athleteId,
    notes: plan.notes || '',
    pdfUrl: plan.pdfUrl,
    startDate: plan.startDate?.split('T')[0] || today,
    endDate: plan.endDate?.split('T')[0] || today
  }
  showModal.value = true
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

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
    const url = auth.user.role === 'nutritionist' 
      ? `${API_URL}/api/nutrition-plans/nutritionist/plans` 
      : `${API_URL}/api/nutrition-plans/my-plans`
    
    const response = await axios.get(url, auth.apiConfig)
    nutritionPlans.value = response.data.data
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

const loadClients = async () => {
  if (auth.user.role !== 'nutritionist') return
  try {
    const response = await axios.get(`${API_URL}/api/users/my-clients`, auth.apiConfig)
    clients.value = response.data.data
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

onMounted(async () => {
  await Promise.all([loadPlans(), loadClients()])
})

const savePlan = async () => {
  if (!selectedFile.value) {
    showToast("Selezionare un piano", "error")
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('athleteId', form.value.athleteId);
    formData.append('startDate', form.value.startDate);
    formData.append('endDate', form.value.endDate);
    formData.append('notes', form.value.notes);
    formData.append('pdfUrl', selectedFile.value); 

    const response = await axios.post(
      `${API_URL}/api/nutrition-plans`, 
      formData, 
      {
        headers: { 
          ...auth.apiConfig.headers,
          'Content-Type': 'multipart/form-data' 
        }
      }
    );

    showModal.value = false;
    planForm.value = { title: '', athleteId: '', notes: '', pdfUrl: '', startDate: today, endDate: today };
    selectedFile.value = null;
    
    showToast("Piano alimentare salvato con successo!", "success")
    await loadPlans();
  } catch (error) {
    showToast("Errore nel salvataggio dei dati: " + getErrorMessage(error), "error")
  }
}

const downloadPdf = (plan) => {
  const fileUrl = `${API_URL}${plan.pdfUrl}`
  window.open(fileUrl, '_blank')
}

const handleItemClick = (plan) => {
  if (auth.user.role === ROLES.NUTRIZIONISTA) {
    openModal(plan)
  } else {
    downloadPdf(plan)
  }
}
</script>
<template>
  <div id="app">
    <Navbar @toggle-sidebar="sidebar.toggle" />
    <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
    <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
      <div class="page-header">
        <div class="header-text">
          <h1>Piani alimentari</h1>
        </div>
      </div>

      <MainList>
        <ListItem 
          v-for="plan in nutritionPlans" 
          :key="plan._id" 
          :title="plan.title"
          :subtitle="auth.user.role === 'nutritionist' 
            ? `${plan.athleteId?.name} ${plan.athleteId?.surname} - Periodo dal ${formatDate(plan.startDate)} al ${formatDate(plan.endDate)}` 
            : `Dott. ${plan.nutritionistId?.name} ${plan.nutritionistId?.surname} - Periodo dal ${formatDate(plan.startDate)} al ${formatDate(plan.endDate)}`"
          :status="calculateStatus(plan.startDate, plan.endDate).text"
          @click="handleItemClick(plan)"
          style="cursor: pointer;"
        >
        </ListItem>
      </MainList>

      <div v-if="nutritionPlans.length === 0" class="empty-state">
          <i class="fa fa-folder-open-o"></i>
          <p>Nessun piano trovato.</p>
      </div>

      <AppModal v-model="showModal" title="Piano alimentare">
        <div class="form-row">
          <label for="plan-title">Titolo</label>
          <input id="plan-title" type="text" v-model="planForm.title" />
        </div>

        <div class="form-row">
          <label for="plan-startDate">Data inizio</label>
          <input id="plan-startDate" type="date" v-model="planForm.startDate" />
        </div>

        <div class="form-row">
          <label for="plan-endDate">Data fine</label>
          <input id="plan-endDate" type="date" v-model="planForm.endDate" />
        </div>

        <div class="form-row">
          <label for="plan-notes">Note</label>
          <textarea id="plan-notes" v-model="planForm.notes"></textarea>
        </div>

        <template #actions>
          <button class="btn-primary btn-red" @click="showModal = false">
            <i class="fa fa-close"></i> Chiudi
          </button>
          <button class="btn-primary" @click="downloadPdf(planForm)">
            <i class="fa fa-download"></i> Scarica PDF
          </button>
        </template>
      </AppModal>
    </main>
  </div>
</template>

<style scoped>
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
  max-width: 100%;
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
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.form-row label {
  width: auto;
  font-weight: 600;
  color: #333;
}

.form-row input,
.form-row select,
.form-row textarea {
  width: 100%;
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

@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
    align-items: center;
    gap: 18px;
  }

  .form-row label {
    width: 120px;
  }

  .modal {
    max-width: 520px;
    padding: 28px;
  }
}

</style>