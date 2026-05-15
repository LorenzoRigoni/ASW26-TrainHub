<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { fetchUserInfo, ROLES } from '../utils/utils.js'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import Footer from '../components/Footer.vue'


const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({
  name: '',
  surname: '',
  role: ''
})

const clients = ref([])
const nutritionists = ref([])
const isEditMode = ref(false)
const selectedPlanId = ref(null)

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
  const userData = await fetchUserInfo()
  if (userData) {
    userLogged.value = userData
    if (userData.role === ROLES.PERSONAL_TRAINER) {
      fetchClients()
    }
    fetchNutritionists()
  }
})

/* LISTA RICHIESTE */
const nutritionPlans = ref([
  {
    id: 1,
    title: 'Definizione - Maggio 2026',
    client: 'Marco Rossi',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    status: 'Consegnato',
    nutritionist: 'Paolo Verdi',
    goal: 'Definizione'
  },
  {
    id: 2,
    title: 'Massa - giugno 2026',
    client: 'Giulia Bianchi',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    status: 'In attesa',
    nutritionist: 'Paolo Verdi',
    goal: 'Massa'
  }
])

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  title: '',
  client: '',
  nutritionist: '',
  goal: '',
  startDate: today,
  endDate: today,
  file: null
})

const openModal = () => {
  isEditMode.value = false
  selectedPlanId.value = null
  form.value = {
    title: '',
    client: '',
    nutritionist: '',
    goal: '',
    startDate: today,
    endDate: today
  }
  showModal.value = true
}

const openModalCompiled = (plan) => {
  isEditMode.value = true
  selectedPlanId.value = plan.id
  form.value = {
    title: plan.title,
    client: plan.client,
    nutritionist: plan.nutritionist,
    goal: plan.goal || '',
    startDate: plan.startDate,
    endDate: plan.endDate
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}


const handleFileUpload = (event) => {
  form.value.file = event.target.files[0]
}


const savePlan = () => {
  if (isEditMode.value) {
    const index = nutritionPlans.value.findIndex(p => p.id === selectedPlanId.value)
    if (index !== -1) {
      nutritionPlans.value[index] = {
        ...nutritionPlans.value[index],
        ...form.value
      }
    }
  } else {
    nutritionPlans.value.push({
      id: Date.now(),
      ...form.value,
      status: 'In attesa'
    })
  }
  closeModal()
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
          <h1>Richieste piani alimentari</h1>
          <p>Richiedi al team nutrition piani alimentari per i tuoi clienti</p>
        </div>
        <button class="btn-primary" @click="openModal" v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
          <i class="fa fa-plus"></i>
          Crea richiesta
        </button>
      </div>

      <!-- LISTA -->
      <MainList>
        <ListItem
          v-for="(plan, index) in nutritionPlans"
          :key="index"
          :title="plan.title"
          :status="plan.status"
          icon="fa fa-file-pdf-o"
          @click="openModalCompiled(plan)"
        >

          <template #subtitle>
            <div class="plan-subtitle">
                <div class="info-row">
                    <i class="fa fa-user-circle-o"></i>
                    <span>Cliente: {{ plan.client }}</span>
                </div>

                <div class="info-row"  v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
                    <i class="fa fa-user-circle-o"></i>
                    <span> Nutrizionista: {{ plan.nutritionist }}</span>
                </div>

                <div class="info-row" v-if="userLogged.role === ROLES.NUTRIZIONISTA">
                    <i class="fa fa-user-circle-o"></i>
                    <span> Trainer: {{ plan.trainer }}</span>
                </div>

                <div class="info-row">
                    <i class="fa fa-calendar-check-o"></i>
                    <span> Periodo validità: {{ plan.startDate }} / {{ plan.endDate }}</span>
                </div>
            </div>
          </template>
        </ListItem>
      </MainList>
    </main>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Modifica richiesta' : 'Richiedi piano alimentare' }}</h2>
        </div>

        <!-- TITOLO -->
        <div class="form-row">
          <label>Titolo</label>
          <input type="text" placeholder="Nome piano" v-model="form.title"/>
        </div>

        <!-- CLIENTE -->
        <div class="form-row">
            <label>Cliente</label>
            <select v-model="form.client">
                <option value="" disabled>Seleziona cliente</option>
                <template v-if="userLogged.role === ROLES.PERSONAL_TRAINER">
                  <option v-for="c in clients" :key="c.id" :value="c.name + ' ' + c.surname">
                    {{ c.name }} {{ c.surname }}
                  </option>
                </template>
                <template v-else>
                   <option value="Marco Rossi">Marco Rossi</option>
                   <option value="Giulia Bianchi">Giulia Bianchi</option>
                </template>
            </select>
        </div>

        <div class="form-row">
            <label>Obiettivo</label>
            <select v-model="form.goal">
                <option value="" disabled>Seleziona obiettivo</option>
                <option value="Definizione">Definizione</option>
                <option value="Mantenimento">Mantenimento</option>
                <option value="Massa">Massa</option>
            </select>
        </div>

         <!-- NUTRIZIONISTA -->
        <div class="form-row">
            <label>Nutrizionista</label>
            <select v-model="form.nutritionist">
                <option value="" disabled>Seleziona nutrizionista</option>
                <option v-for="n in nutritionists" :key="n._id" :value="n.name + ' ' + n.surname">
                   {{ n.name }} {{ n.surname }}
                </option>
            </select>
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

        <!-- ACTIONS -->
        <div class="modal-actions">
          <button class="btn-danger" @click="closeModal">Annulla</button>
          <button class="btn-primary" @click="savePlan">{{ isEditMode ? 'Salva' : 'Invia' }}</button>
        </div>
      </div>
    </div>
    <Footer />
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