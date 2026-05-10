<script setup>
import { ref } from 'vue'
import { ROLES } from '../constants/roles.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

//TODO Mostrare bottone registra solo a cliente

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const props = defineProps({
  user: {
    type: Object,
    default: () => ({  name: 'Alessandra', surname: 'Versari',  role: 'trainer'})
    }
  })


//DATI DI TEST
//Quando ci saranno tante registrazioni di diario, mostreremo sempre solo quelle delle ultime due settimane (oppure solo quelle del mese corrente?)
const diaryEntries = ref([
  {
    date: '2026-05-01',
    activity: 'on',
    adherence: 'Ottima',
    steps: 9200,
    hunger: 5
  },
  {
    date: '2026-05-02',
    activity: 'off',
    adherence: 'Media',
    steps: 4000,
    hunger: 7
  },
  {
    date: '2026-05-03',
    activity: 'on',
    adherence: 'Ottima',
    steps: 10500,
    hunger: 4
  },
  {
    date: '2026-05-04',
    activity: 'on',
    adherence: 'Sgarro',
    steps: 3000,
    hunger: 8
  },
  {
    date: '2026-05-05',
    activity: 'off',
    adherence: 'Media',
    steps: 6000,
    hunger: 6
  },
  {
    date: '2026-05-06',
    activity: 'on',
    adherence: 'Ottima',
    steps: 11000,
    hunger: 3
  },
  {
    date: '2026-05-07',
    activity: 'on',
    adherence: 'Media',
    steps: 7500,
    hunger: 6
  },
  {
    date: '2026-05-08',
    activity: 'off',
    adherence: 'Sgarro',
    steps: 2000,
    hunger: 9
  }
])

//Finestra pop up per inserimento dati
const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  date: today,
  activity: 'on',
  adherence: 'Media',
  steps: 0,
  hunger: 5
})

const openModal = () => {
  form.value = {
    date: today,
    activity: 'on',
    adherence: 'Media',
    steps: 0,
    hunger: 5
  }
  showModal.value = true
}

//TODO: Aggiungere argomenti. Prendere dati da backend, serve per mostrare una registrazione passata del diario.
const openModalCompiled = () => {
  form.value = {
    date: today,
    activity: 'on',
    adherence: 'Media',
    steps: 0,
    hunger: 5
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveEntry = () => {
  diaryEntries.value.push({ ...form.value })
  closeModal()
}
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role = "user.role" @close="sidebarOpen = false" />
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
          <div class="diary">
            <div class = "header">
                <h1>Diario</h1>
                <button class="btn-primary" @click="openModal">
                    <i class="fa fa-plus"></i> Registra dati
                </button>
            </div>
            <table class="diary-table">
                <thead>
                    <tr>
                    <th>Data</th>
                    <th>Attività</th>
                    <th>Aderenza piano alimentare</th>
                    <th>NEAT (passi giornalieri)</th>
                    <th>Livello di fame (1-10)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(entry, index) in diaryEntries" :key="index" @click="openModalCompiled()">
                        <td>{{ entry.date }}</td>
                        <td>
                        <span :class="['status', entry.activity === 'on' ? 'on' : 'off']">
                            {{ entry.activity }}
                        </span>
                        </td>
                        <td>
                        <span :class="['badge', entry.adherence]">
                            {{ entry.adherence }}
                        </span>
                        </td>
                        <td>{{ entry.steps }}</td>
                        <td>{{ entry.hunger }}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </main>
        <Footer />
    </div>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal">

            <div class="modal-header">
                <h2>Nuova registrazione</h2>
            </div>

            <!-- DATA -->
            <div class="form-row">
                <label>Data</label>
                <input type="date" v-model="form.date" />
            </div>

            <!-- ATTIVITÀ -->
            <div class="form-row">
                <label>Attività</label>
                <div class="radio-group">
                    <label class="radio-card on-card"><input type="radio" value="on" v-model="form.activity" />ON</label>
                    <label class="radio-card off-card"><input type="radio" value="off" v-model="form.activity" /> OFF</label>
                </div>
            </div>

            <!-- ADERENZA -->
            <div class="form-row">
                <label>Aderenza</label>
                <select v-model="form.adherence">
                    <option value="Ottima">Ottima</option>
                    <option value="Media">Media</option>
                    <option value="Sgarro">Sgarro</option>
                </select>
            </div>

            <!-- NEAT -->
            <div class="form-row">
                <label>NEAT</label>
                <input
                    type="number"
                    placeholder="Passi giornalieri"
                    v-model.number="form.steps"
                />
            </div>

            <!-- FAME -->
            <div class="form-column">
                <label>Livello fame</label>
                <div class="hunger-row">
                    <input
                        type="range"
                        min="1"
                        max="10"
                        v-model.number="form.hunger"
                    />
                    <span class="hunger-value">{{ form.hunger }}</span>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn-danger" @click="closeModal">Annulla</button>
                <button class="btn-primary" @click="saveEntry">Conferma</button>
            </div>

        </div>
    </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.diary{
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.main-content {
  margin-top: 60px;      
  margin-left: 10pt;
  padding-bottom: 50px;   
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

/*Sidebar in mobile*/
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
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
  font-size: 1.75rem; 
  font-weight: 700; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 15px;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 5px 0 5px;
}

.diary-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  margin-top: 10px;
}

/* Header */
.diary-table thead {
  background: #1e1548;
  color: white;
}

.diary-table th {
  padding: 14px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Celle */
.diary-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

/* hover righe */
.diary-table tbody tr:hover {
  background: #f6f7fb;
}

/* ultimi bordi arrotondati */
.diary-table tbody tr:last-child td {
  border-bottom: none;
}

/* STATUS ON/OFF */
.status {
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.status.on {
  color: #1a7f37;
  background: #e8f7ee;
}

.status.off {
  color: #000;
  background: #f0f0f0;
}

/* BADGE ADERENZA */
.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

/* Medio */
.badge.Ottima {
  color: #8a6d00;
  background: #fff4c2;
}

/* Sgarro */
.badge.Sgarro {
  color: #b00020;
  background: #ffd6d6;
}

/* Ottimo */
.badge.Media {
  color: #1a7f37;
  background: #d9f7df;
}


/*CSS finestra inserimento dati */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* OVERLAY */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 30, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

/* MODAL */

.modal {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(to bottom, #ffffff, #f7f8fc);
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: modalFade 0.25s ease;
}

/* HEADER */

.modal-header {
  margin-bottom: 5px;
}

.modal-header h2 {
  margin: 0;
  color: #1e1548;
  font-size: 1.45rem;
  font-weight: 700;
}

/* RIGHE FORM */

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* LABEL */

.form-row label,
.form-column label {
  min-width: 140px;
  font-weight: 600;
  color: #2b2b40;
  font-size: 0.95rem;
}

/* INPUT */

.modal input[type="date"],
.modal input[type="number"],
.modal select {
  flex: 1;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
}

.modal input:focus,
.modal select:focus {
  outline: none;
  border-color: #5b47c5;
  box-shadow: 0 0 0 4px rgba(91,71,197,0.12);
}

/* RADIO */

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  border: 2px solid transparent;
}

.on-card {
  background: #e7f8ee;
  color: #1a7f37;
}

.off-card {
  background: #ffe4e4;
  color: #c62828;
}

.radio-card:hover {
  transform: translateY(-1px);
}

/* HUNGER */

.hunger-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hunger-row input[type="range"] {
  flex: 1;
}

.hunger-value {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1e1548;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* ACTIONS */

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

/* BTN ANNULLA */

.btn-danger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #d62828;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(214,40,40,0.25);
  transition: 0.2s ease;
}

.btn-danger:hover {
  background-color: #b71c1c;
  transform: translateY(-1px);
}

/* ANIMAZIONE */

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

</style>