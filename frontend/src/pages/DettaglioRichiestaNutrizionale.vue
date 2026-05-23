<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute  } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})


const route = useRoute()

const sidebarOpen = ref(true)

const requestId = computed(() => route.params.id)

// MODE
const isEditMode = computed(() => !!requestId.value)

// FORM MOCK
const form = ref({
  title: 'Piano alimentare dimagrimento',
  clientId: 2,
  goal: 'Definizione',
  nutritionistId: 'n1',
  startDate: '2026-05-01',
  endDate: '2026-06-01',
  notes: 'Ridurre carboidrati la sera e aumentare proteine.'
})

// CLIENTI MOCK
const clients = ref([
  { id: 1, name: 'Luca', surname: 'Bianchi' },
  { id: 2, name: 'Giulia', surname: 'Verdi' },
  { id: 3, name: 'Marco', surname: 'Neri' }
])

// NUTRIZIONISTI MOCK
const nutritionists = ref([
  { _id: 'n1', name: 'Anna', surname: 'Ferrari' },
  { _id: 'n2', name: 'Luca', surname: 'Conti' }
])

// METHODS
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeModal = () => {
  console.log('Modal chiusa')
}

const saveRequest = () => {
  console.log('Dati salvati:', form.value)
}

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Dettaglio richiesta nutrizionale'
    : 'Nuova richiesta nutrizionale'
)
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />
        
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <div class="info-header">
                <h1>{{ pageTitle }}</h1>
            </div>
            <div class="form-card">
              <div class="form-grid">
                <!-- COLONNA 1 -->
                <div class="col col-left">

                  <div class="form-row">
                    <label>Titolo</label>
                    <input type="text" v-model="form.title" />
                  </div>

                  <div class="form-row">
                    <label>Cliente</label>
                    <select v-model="form.clientId" :disabled="isEditMode">
                      <option value="" disabled>Seleziona cliente</option>
                      <option v-for="c in clients" :key="c.id" :value="c.id">
                        {{ c.name }} {{ c.surname }}
                      </option>
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

                  <div class="form-row">
                    <label>Nutrizionista</label>
                    <select v-model="form.nutritionistId">
                      <option value="" disabled>Seleziona nutrizionista</option>
                      <option v-for="n in nutritionists" :key="n._id" :value="n._id">
                        {{ n.name }} {{ n.surname }}
                      </option>
                    </select>
                  </div>

                </div>

                <!-- COLONNA 2 -->
                <div class="col col-right">

                  <div class="form-row">
                    <label>Data inizio</label>
                    <input type="date" v-model="form.startDate" />
                  </div>

                  <div class="form-row">
                    <label>Data fine</label>
                    <input type="date" v-model="form.endDate" />
                  </div>

                  <div class="form-row grow">
                    <label>Note</label>
                    <textarea v-model="form.notes"></textarea>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button class="btn-primary red-button" @click="closeModal">Annulla</button>
                <button class="btn-primary" @click="saveRequest">
                  {{ isEditMode ? 'Salva' : 'Invia' }}
                </button>
              </div>
            </div>
        </main>
     </div>
</template>

<style scoped>

.main-content {
  margin-top: 60px;
  padding: 24px;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f9;
  transition: margin-left 0.3s ease;
}

/* desktop sidebar */
@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
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



.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30,21,72,0.25);
  transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-primary:hover {
  background-color: #2d2070;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30,21,72,0.35);
}

h1 {
  font-size: 24pt; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}


.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 5px 0 5px; 
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.red-button{
  background-color: #dc2626;
}

/************************ */

.form-card {
  max-width: 90%;
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

/* colonne */
.col {
  display: flex;
  flex-direction: column;
}

/* colonna destra: deve riempire altezza */
.col-right {
  display: flex;
  flex-direction: column;
}


.form-row.grow {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* textarea riempie lo spazio verticale */
.form-row.grow textarea {
  flex: 1;
  min-height: 220px;
}

.form-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ececf3;
}

.form-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #2b2b3a;
  margin: 0;
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

/* focus state */
.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #1e1548;
  box-shadow: 0 0 0 3px rgba(30,21,72,0.12);
}

/* textarea specific */
.form-row textarea {
  min-height: 100px;
  resize: vertical;
}

.info-header {
  max-width:90%;
  margin: 20px auto 16px;

}
</style>