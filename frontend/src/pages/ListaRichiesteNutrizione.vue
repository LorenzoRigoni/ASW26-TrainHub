<script setup>
import { ref } from 'vue'

import { ROLES } from '../constants/roles.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'


const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({
  name: 'Alessandra',
  surname: 'Versari',
  role: 'nutritionist'
})

/* LISTA RICHIESTE */
//TODO: lo stato che mostriamo nel list item è di default in attesa appena viene aperta la richiesta. Quando il nutrizionista carica il piano, la richeista viene chiusa automaticamente. 
const nutritionPlans = ref([
  {
    title: 'Definizione - Maggio 2026',
    client: 'Marco Rossi',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    status: 'Consegnato',
    nutritionist: 'Paolo Verdi'
  },
  {
    title: 'Massa - giugno 2026',
    client: 'Giulia Bianchi',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    status: 'In attesa',
    nutritionist: 'Paolo Verdi'
  }
])

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  title: '',
  client: '',
  startDate: today,
  endDate: today,
  file: null
})

const openModal = () => {
  form.value = {
    title: '',
    client: '',
    startDate: '',
    endDate: ''

  }

  showModal.value = true
}

//TODO: recuperare dati richiesta da backend. Se stato = consegnato non deve più essere modificabile
const openModalCompiled = () => {
  form.value = {
    title: 'Definizione - Maggio 2026',
    client: 'Marco Rossi',
    startDate: '2026-05-01',
    endDate: '2026-07-01',
    goal: 'Definizione',
    nutritionist: 'Nutrizionista1'
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

  nutritionPlans.value.push({
    title: form.value.title,
    client: form.value.client,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    pdfUrl: '#'
  })

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
          @click="openModalCompiled()"
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
          <h2>Richiedi piano alimentare</h2>
        </div>

        <!-- TITOLO: sarebbe carino generarlo automaticamente -->
        <div class="form-row">
          <label>Titolo</label>
          <input type="text" placeholder="Nome piano" v-model="form.title"/>
        </div>

        <!-- CLIENTE: soluzione provvisoria, dovrà essere scelto dalle liste di clienti del trainer -->
        <div class="form-row">
            <label>Cliente</label>
            <select v-model="form.client">
                <option value="Cliente1">Cliente1</option>
                <option value="Cliente2">Cliente2</option>
                <option value="Cliente3">Cliente3</option>
            </select>
        </div>

        <div class="form-row">
            <label>Obiettivo</label>
            <select v-model="form.goal">
                <option value="Definizione">Definizione</option>
                <option value="Mantenimento">Mantenimento</option>
                <option value="Massa">Massa</option>
            </select>
        </div>

         <!-- NUTRIZIONISTA: soluzione provvisoria, dovrà essere scelto dalla lista di nutrizionisti  -->
        <div class="form-row">
            <label>Nutrizionista</label>
            <select v-model="form.nutritionist">
                <option value="Nutrizionista1">Nutrizionista1</option>
                <option value="Nutrizionista2">Nutrizionista2</option>
                <option value="Nutrizionista3">Nutrizionista3</option>
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
          <button class="btn-primary" @click="savePlan"> Invia</button>
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