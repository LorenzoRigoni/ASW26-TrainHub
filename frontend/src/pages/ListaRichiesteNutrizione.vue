<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const clients = ref([])
const nutritionists = ref([])
const isEditMode = ref(false)
const selectedRequestId = ref(null)

const fetchClients = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('http://localhost:5000/api/users/my-clients', config)
    clients.value = response.data.data || []
  } catch (error) {
    console.error('Errore caricamento clienti:', error)
  }
}

const fetchNutritionists = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/nutritionists')
    nutritionists.value = response.data.data || []
  } catch (error) {
    console.error('Errore caricamento nutrizionisti:', error)
  }
}

onMounted(async () => {
  if (userLogged.value.role === ROLES.PERSONAL_TRAINER) {
    fetchClients()
  }
  fetchNutritionists()
  loadRequests()
})

/* LISTA RICHIESTE */
const nutritionRequests = ref([])

const loadRequests = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('http://localhost:5000/api/nutrition-requests', config)
    nutritionRequests.value = response.data.data || []
  } catch (error) {
    console.error('Errore caricamento richieste:', error.response?.data?.message || error.message)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}

</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen"  :role="userLogged.role"  @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1>Richieste piani alimentari</h1>
          <p>Richiedi al team nutrition piani alimentari per i tuoi clienti</p>
        </div>
        <button class="btn-primary" @click="router.push('/richieste-nutrizione/nuova-richiesta')" v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
          <i class="fa fa-plus"></i>
          Crea richiesta
        </button>
      </div>

      <!-- LISTA-->
      <MainList>
        <ListItem
          v-for="request in nutritionRequests"
          :key="request._id"
          :title="request.title"
          :status="request.status"
          icon="fa fa-file-pdf-o"
          @click="router.push(`/richieste-nutrizione/dettaglio-richiesta/${request._id}`)"
        >

          <template #subtitle>
            <div class="plan-subtitle">
                <div class="info-row">
                    <i class="fa fa-user-circle-o"></i>
                    <span>Cliente: {{ request.clientId?.name }} {{ request.clientId?.surname }}</span>
                </div>

                <div class="info-row"  v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
                    <i class="fa fa-user-circle-o"></i>
                    <span> Nutrizionista: {{ request.nutritionistId?.name }} {{ request.nutritionistId?.surname }}</span>
                </div>

                <div class="info-row" v-if="userLogged.role === ROLES.NUTRIZIONISTA">
                    <i class="fa fa-user-circle-o"></i>
                    <span> Trainer: {{ request.trainerId?.name }} {{ request.trainerId?.surname }}</span>
                </div>

                <div class="info-row">
                    <i class="fa fa-calendar-check-o"></i>
                    <span> Periodo validità: {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}</span>
                </div>
            </div>
          </template>
        </ListItem>
      </MainList>
      
      <div v-if="nutritionRequests.length === 0" class="empty-state" style="text-align: center; margin-top: 50px; color: #666;">
           <i class="fa fa-folder-open-o" style="font-size: 48px; margin-bottom: 10px;"></i>
           <p>Nessuna richiesta trovata.</p>
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
.form-row select {
  flex: 1;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
}

.form-row input:focus,
.form-row select:focus {
  outline: none;
  border-color: #5b47c5;
  box-shadow: 0 0 0 4px rgba(91,71,197,0.12);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.plan-subtitle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.info-row {
  display:inline-flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 9pt;
  line-height: 1.3;
}


</style>