<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ROLES } from '../utils/utils.js'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const requestId = computed(() => route.params.id)
const isEditMode = computed(() => !!requestId.value)

const form = ref({
  title: '',
  clientId: '',
  goal: '',
  nutritionistId: '',
  status: 'In attesa',
  startDate: '',
  endDate: '',
  notes: ''
})

const clients = ref([])
const nutritionists = ref([])
const loading = ref(false)

const getAuthConfig = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

const fetchData = async () => {
  loading.value = true
  try {
    const config = getAuthConfig()
    
    const [clientsRes, nutriRes] = await Promise.all([
      axios.get('http://localhost:5000/api/users/my-clients', config),
      axios.get('http://localhost:5000/api/users/nutritionists', config)
    ])
    
    clients.value = (clientsRes.data?.data || []).map(c => ({ id: c.id, name: c.name, surname: c.surname }))
    nutritionists.value = nutriRes.data?.data || []

    if (isEditMode.value) {
      const res = await axios.get(`http://localhost:5000/api/nutrition-requests/${requestId.value}`, config)
      const data = res.data.data
      form.value = {
        title: data.title,
        clientId: data.clientId._id || data.clientId,
        goal: data.goal,
        nutritionistId: data.nutritionistId._id || data.nutritionistId,
        status: data.status,
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        notes: data.notes || ''
      }
    }
  } catch (error) {
    console.error('Errore caricamento dati:', error.response?.data?.message || error.message)
    alert('Errore nel caricamento della pagina')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const goBack = () => {
  router.push('/richieste-nutrizione')
}

const saveRequest = async () => {
  try {
    const config = getAuthConfig()
    const payload = { ...form.value }
    
    if (isEditMode.value) {
      await axios.put(`http://localhost:5000/api/nutrition-requests/${requestId.value}`, payload, config)
    } else {
      await axios.post('http://localhost:5000/api/nutrition-requests', payload, config)
    }
    
    alert(isEditMode.value ? 'Richiesta aggiornata' : 'Richiesta inviata')
    goBack()
  } catch (error) {
    console.error('Errore salvataggio:', error.response?.data?.message || error.message)
    alert('Errore durante il salvataggio: ' + (error.response?.data?.message || error.message))
  }
}

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Dettaglio richiesta nutrizionale'
    : 'Nuova richiesta nutrizionale'
)

const canEditForm = computed(() => {
  return userLogged.value.role === ROLES.PERSONAL_TRAINER
})

const canEditStatus = computed(() => {
  return userLogged.value.role === ROLES.NUTRIZIONISTA
})
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />
        
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <div v-if="loading" class="loader-container">
              <i class="fa fa-spinner fa-spin"></i> Caricamento...
            </div>
            
            <template v-else>
              <div class="header-text">
                  <h1>{{ pageTitle }}</h1>
                  <p>Visualizza e modifica i dettagli della richiesta nutrizionale.</p>
              </div>
              <div class="form-card">
                <div class="form-grid">
                  <div class="col col-left">

                    <div class="form-row">
                      <label>Titolo</label>
                      <input type="text" v-model="form.title" :disabled="!canEditForm" />
                    </div>

                    <div class="form-row">
                      <label>Cliente</label>
                      <select v-model="form.clientId" :disabled="isEditMode || !canEditForm">
                        <option value="" disabled>Seleziona cliente</option>
                        <option v-for="c in clients" :key="c.id" :value="c.id">
                          {{ c.name }} {{ c.surname }}
                        </option>
                      </select>
                    </div>

                    <div class="form-row">
                      <label>Obiettivo</label>
                      <select v-model="form.goal" :disabled="!canEditForm">
                        <option value="" disabled>Seleziona obiettivo</option>
                        <option value="Definizione">Definizione</option>
                        <option value="Mantenimento">Mantenimento</option>
                        <option value="Massa">Massa</option>
                      </select>
                    </div>

                    <div class="form-row">
                      <label>Nutrizionista</label>
                      <select v-model="form.nutritionistId" :disabled="!canEditForm">
                        <option value="" disabled>Seleziona nutrizionista</option>
                        <option v-for="n in nutritionists" :key="n._id" :value="n._id">
                          {{ n.name }} {{ n.surname }}
                        </option>
                      </select>
                    </div>

                    <div class="form-row" v-if="isEditMode">
                      <label>Stato</label>
                      <select v-model="form.status" :disabled="!canEditStatus">
                        <option value="In attesa">In attesa</option>
                        <option value="In elaborazione">In elaborazione</option>
                        <option value="Completata">Completata</option>
                        <option value="Rifiutata">Rifiutata</option>
                      </select>
                    </div>

                  </div>

                  <div class="col col-right">

                    <div class="form-row">
                      <label>Data inizio</label>
                      <input type="date" v-model="form.startDate" :disabled="!canEditForm" />
                    </div>

                    <div class="form-row">
                      <label>Data fine</label>
                      <input type="date" v-model="form.endDate" :disabled="!canEditForm" />
                    </div>

                    <div class="form-row grow">
                      <label>Note</label>
                      <textarea v-model="form.notes" :disabled="!canEditForm"></textarea>
                    </div>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn-primary btn-red" @click="goBack"><i class="fa fa-close"></i>Annulla</button>
                  <button class="btn-primary" @click="saveRequest"><i class="fa fa-check"></i>
                    {{ isEditMode ? 'Salva' : 'Invia' }}
                  </button>
                </div>
              </div>
            </template>
        </main>
     </div>
</template>

<style scoped>
.main-content{
  max-width: 95%;
  margin: 0 auto;
  margin-top: 60px;
}

@media (max-width: 900px) {
  .form-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 16px;
  }

  .form-row.grow textarea {
    min-height: 140px;
  }

  .col,
  .col-left,
  .col-right {
    width: 100%;
  }
}

.form-card {
 
  margin-top: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  margin: 20px auto 0; 
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}


.col {
  display: flex;
  flex-direction: column;
}

.col-right {
  display: flex;
  flex-direction: column;
}

.form-row.grow {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row.grow textarea {
  flex: 1;
  min-height: 220px;
}

.form-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ececf3;
}


.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  gap: 6px;
}

.form-row label {
  font-size: 0.9rem;
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
  background: #fff;
  transition: all 0.2s ease;
  outline: none;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #1e1548;
  box-shadow: 0 0 0 3px rgba(30,21,72,0.12);
}

.form-row textarea {
  min-height: 100px;
  resize: vertical;
}

.info-header {
  max-width:90%;
  margin: 20px auto 16px;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #1e1548;
}
</style>