<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'

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
    showToast("Errore nel caricamento dei dati: " + error, "error")
  }
}

const fetchNutritionists = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/nutritionists')
    nutritionists.value = response.data.data || []
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
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
    showToast("Errore nel caricamento dei dati: " + error, "error")
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
      <div class="page-header">
        <div class="header-text">
          <h1>Richieste piani alimentari</h1>
          <p>Richiedi al team nutrition piani alimentari per i tuoi clienti</p>
        </div>
        <button class="btn-primary" @click="router.push('/richieste-nutrizione/nuova-richiesta')" v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
          <i class="fa fa-plus"></i>
          Crea richiesta
        </button>
      </div>

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