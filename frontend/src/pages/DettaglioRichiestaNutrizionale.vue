<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { useSidebarStore } from '../stores/sidebar.js'
import { API_URL } from '../utils/config.js'
import { ROLES, getErrorMessage } from '../utils/utils.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import axios from 'axios'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebar = useSidebarStore()
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

const fetchData = async () => {
  loading.value = true
  try {
    const [clientsRes, nutriRes] = await Promise.all([
      axios.get(`${API_URL}/api/users/my-clients`, auth.apiConfig),
      axios.get(`${API_URL}/api/users/nutritionists`, auth.apiConfig)
    ])
    
    clients.value = (clientsRes.data?.data || []).map(c => ({ id: c.id, name: c.name, surname: c.surname }))
    nutritionists.value = nutriRes.data?.data || []

    if (isEditMode.value) {
      const res = await axios.get(`${API_URL}/api/nutrition-requests/${requestId.value}`, auth.apiConfig)
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
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const goBack = () => {
  router.push('/richieste-nutrizione')
}

const saveRequest = async () => {
  try {
    const payload = { ...form.value }
    
    if (isEditMode.value) {
      await axios.put(`${API_URL}/api/nutrition-requests/${requestId.value}`, payload, auth.apiConfig)
    } else {
      await axios.post(`${API_URL}/api/nutrition-requests`, payload, auth.apiConfig)
    }
    
    showToast(isEditMode.value ? 'Richiesta aggiornata correttamente!' : 'Richiesta inviata correttamente!', "success")
    goBack()
  } catch (error) {
    showToast("Errore nella richiesta: " + getErrorMessage(error), "error")
  }
}

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Dettaglio richiesta nutrizionale'
    : 'Nuova richiesta nutrizionale'
)

const canEditForm = computed(() => {
  return auth.user.role === ROLES.PERSONAL_TRAINER
})

const canEditStatus = computed(() => {
  return auth.user.role === ROLES.NUTRIZIONISTA
})
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="sidebar.toggle" />
        <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
        <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
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
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  gap: 10px;
  font-size: 1rem;
  color: #1e1548;
}

.form-card {
  width: 100%;
  margin-top: 18px;
  background: white;
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.05);
}


.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.col {
  display: flex;
  flex-direction: column;
}


.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}


.form-row input,
.form-row select,
.form-row textarea {
  width: 100%;
  border: 1px solid #d8dcf0;
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font-size: 0.95rem;
  outline: none;
  transition: all .2s ease;
}

.form-row input,
.form-row select {
  min-height: 48px;
}

.form-row textarea {
  min-height: 130px;
  resize: vertical;
}


.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #1e1548;
  box-shadow: 0 0 0 4px rgba(30,21,72,0.10);
}

.form-row input:disabled,
.form-row select:disabled,
.form-row textarea:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-row.grow {
  display: flex;
  flex-direction: column;
}

.form-row.grow textarea {
  min-height: 140px;
}

.actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  margin-top: 24px;
}

.actions button {
  width: 100%;
  justify-content: center;
}


@media (min-width: 768px) {

  .form-card {
    padding: 24px;
    border-radius: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }

  .form-row.grow textarea {
    min-height: 220px;
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