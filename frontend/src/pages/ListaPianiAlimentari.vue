<script setup>
import { ref } from 'vue'

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
  name: 'Alessandra',
  surname: 'Versari',
  role: 'trainer'
})

/* LISTA PIANI */
//TODO: lo stato che mostriamo nel list item lo calcoliamo noi in base alla data di fine programma. Se è passata il programma va marcato come inattivo. 
const nutritionPlans = ref([
  {
    title: 'Piano definizione maggio',
    client: 'Marco Rossi',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    status: 'attivo',
    pdfUrl: '#'
  },
  {
    title: 'Piano massa estiva',
    client: 'Giulia Bianchi',
    startDate: '2026-04-15',
    endDate: '2026-05-15',
    status: 'inattivo',
    pdfUrl: '#'
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
    startDate: today,
    endDate: today,
    file: null
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

/* OPEN PDF */

const openPdf = (plan) => {
  window.open(plan.pdfUrl, '_blank')
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
          v-for="(plan, index) in nutritionPlans"
          :key="index"
          :title="plan.title"
          :status="plan.status"
          icon="fa fa-file-pdf-o"
          @click="openPdf(plan)"
        >

          <template #subtitle>
            {{ plan.client }} ·
            {{ plan.startDate }} - {{ plan.endDate }}
          </template>
        </ListItem>
      </MainList>
    </main>

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

        <!-- CLIENTE: soluzione provvisoria, dovrà essere scelto dalle liste di richieste che arrivano dal trainer -->
        <div class="form-row">
          <label>Cliente</label>
          <input type="text" placeholder="Nome cliente" v-model="form.client"/>
        </div>

        <!-- FILE -->
        <div class="form-row">
          <label>PDF</label>
          <input type="file" accept=".pdf" @change="handleFileUpload"/>
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


</style>