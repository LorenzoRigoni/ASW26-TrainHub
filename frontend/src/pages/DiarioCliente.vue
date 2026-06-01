<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { API_URL } from '../utils/config.js'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { useSidebarStore } from '../stores/sidebar.js'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import { Line } from 'vue-chartjs'

import defaultAvatar from '../assets/profileImage.png'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import BackButton from '../components/GoBackButton.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const route = useRoute()
const sidebar = useSidebarStore()
const auth = useAuthStore()

const displayedUser = ref({ 
  name: auth.user.name, 
  surname: auth.user.surname, 
  role: auth.user.role,
  email: auth.user.email,
  birthDate: auth.user.birthDate,
  image: auth.user.image
})

const diaryEntries = ref([])

const fetchAthleteInfo = async (id) => {
  try {
    let response
    if (id) {
      response = await axios.get(`${API_URL}/api/users/athlete/${id}`, auth.apiConfig)
    } else {
      response = await axios.get(`${API_URL}/api/users/athlete/${auth.user.id}`, auth.apiConfig)
    }
    const data = response.data.data
    displayedUser.value = {
      name: data.name,
      surname: data.surname,
      role: data.role,
      email: data.email,
      birthDate: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('it-IT') : 'gg/mm/aaaa',
      image: data.profilePicture ? `${API_URL}${data.profilePicture}` : defaultAvatar
    }
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

const fetchDiaryEntries = async () => {
  try {
    let url = `${API_URL}/api/personal-diary/body-diary`
    if (route.params.id) {
      url = `${API_URL}/api/personal-diary/body-diary/athlete/${route.params.id}`
    }
    
    const response = await axios.get(url, auth.apiConfig)

    diaryEntries.value = (response.data.data || []).map((entry) => ({
      date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : '',
      activity: entry.activity || 'off',
      adherence: entry.adherence || 'Media',
      steps: entry.steps ?? 0,
      hunger: entry.hunger ?? 5,
      notes: entry.notes || '',
      weight: entry.weight ?? 0
    }))
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

onMounted(async () => {
  fetchAthleteInfo(route.params.id)
  fetchDiaryEntries()
})


const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  date: today,
  activity: 'on',
  adherence: 'Media',
  steps: 0,
  hunger: 5,
  notes: ''
})

const openModal = () => {
  form.value = {
    date: today,
    activity: 'on',
    adherence: 'Media',
    steps: 0,
    hunger: 5,
    notes: '',
    weight: 0
  }
  showModal.value = true
}

const openModalCompiled = () => {
  form.value = {
    date: today,
    activity: 'on',
    adherence: 'Media',
    steps: 0,
    hunger: 5,
    notes: '',
    weight: 75
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveEntry = async () => {
  try {
    const payload = {
      date: form.value.date,
      activity: form.value.activity,
      adherence: form.value.adherence,
      steps: form.value.steps,
      hunger: form.value.hunger,
      notes: form.value.notes,
      weight: form.value.weight
    }

    const response = await axios.post(`${API_URL}/api/personal-diary/body-diary`, payload, auth.apiConfig)
    const entry = response.data.data

    diaryEntries.value.push({
      date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : form.value.date,
      activity: entry.activity || form.value.activity,
      adherence: entry.adherence || form.value.adherence,
      steps: entry.steps ?? form.value.steps,
      hunger: entry.hunger ?? form.value.hunger,
      notes: entry.notes || form.value.notes,
      weight: entry.weight || form.value.weight
    })

    showToast("Dati salvati correttamente!", "success")
    closeModal()
  } catch (error) {
    showToast("Errore nel salvataggio dei dati: " + getErrorMessage(error), "error")
  }
}

// ultime 7 registrazioni per tabella
const latestEntries = computed(() => {
  return [...diaryEntries.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7)
})

// ultime 7 per grafici (poi diventeranno 30)
const chartEntries = computed(() => {
  return [...diaryEntries.value]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
})

const weightChartData = computed(() => ({
  labels: chartEntries.value.map(entry =>
    new Date(entry.date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit'
    })
  ),
  datasets: [
    {
      label: 'Peso',
      data: chartEntries.value.map(entry => entry.weight),
      borderWidth: 2,
      tension: 0.3
    }
  ]
}))

const adherenceMap = {
  Ottima: 3,
  Media: 2,
  Sgarro: 1
}

const adherenceChartData = computed(() => ({
  labels: chartEntries.value.map(entry =>
    new Date(entry.date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit'
    })
  ),
  datasets: [
    {
      label: 'Aderenza',
      data: chartEntries.value.map(
        entry => adherenceMap[entry.adherence] || 0
      ),
      borderWidth: 2,
      tension: 0.3
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const adherenceOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      min: 1,
      max: 3,
      ticks: {
        callback: value => {
          if (value === 3) return 'Ottima'
          if (value === 2) return 'Media'
          if (value === 1) return 'Sgarro'
        }
      }
    }
  }
}
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="sidebar.toggle" />
        <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
        <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
          <div class="diary">
            <div class="header-container">
              <BackButton />
              <div class="header-text">
                <h1 class="title"> Diario</h1>
              </div>
            </div>
            <div class="diary-header">
              <div class="client-info">
                <div class="avatar-wrapper">
                  <img v-if="displayedUser.image" :src="displayedUser.image" alt="Profilo cliente" class="avatar" />
                  <div v-else class="avatar-placeholder"><i class="fa fa-user"></i></div>
                </div>

                <div class="client-details">
                  <h1>{{ displayedUser.name }} {{ displayedUser.surname }}</h1>
                  <div class="client-meta">
                    <span class="header-row">
                      <p>Data nascita: </p>
                      {{ displayedUser.birthDate || '-' }}
                    </span>

                    <span class="header-row">
                      <p>Email: </p>
                      {{ displayedUser.email || '-' }}
                    </span>
                  </div>
                </div>
              </div>
              <button v-if="auth.user.role === ROLES.CLIENTE"  class="btn-primary add-btn" @click="openModal">
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
                    <th>Peso corporeo</th>
                    <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(entry, index) in latestEntries" :key="index" @click="openModalCompiled()">
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
                        <td>{{ entry.weight }}</td>
                        <td>{{ entry.notes || '-' }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="charts-grid">

              <div class="chart-card">
                <h3>Andamento del peso</h3>
                <p>Ultimi 7 giorni</p>

                <Line
                  :data="weightChartData"
                  :options="chartOptions"
                />
              </div>

              <div class="chart-card">
                <h3>Aderenza piano alimentare</h3>
                <p>Ultimi 7 giorni</p>

                <Line
                  :data="adherenceChartData"
                  :options="adherenceOptions"
                />
              </div>

            </div>
          </div>
        </main>
    </div>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal">

            <div class="modal-header">
                <h2>Nuova registrazione</h2>
            </div>

            <!-- DATA -->
            <div class="form-row">
                <label for="data">Data</label>
                <input id="data" type="date" v-model="form.date" />
            </div>

            <div class="form-row">
                <label for="activity">Attività</label>
                <div id="activity" class="radio-group">
                    <label class="radio-card on-card"><input type="radio" value="on" v-model="form.activity" />ON</label>
                    <label class="radio-card off-card"><input type="radio" value="off" v-model="form.activity" /> OFF</label>
                </div>
            </div>

            <div class="form-row">
                <label for="adherence">Aderenza</label>
                <select id="adherence" v-model="form.adherence">
                    <option value="Ottima">Ottima</option>
                    <option value="Media">Media</option>
                    <option value="Sgarro">Sgarro</option>
                </select>
            </div>

            <div class="form-row">
                <label for="steps">NEAT</label>
                <input
                    id="steps"
                    type="number"
                    placeholder="Passi giornalieri"
                    v-model.number="form.steps"
                />
            </div>

            <div class="form-column">
                <label>Livello fame</label>
                <div for="hunger" class="hunger-row">
                    <input
                        id="hunger"
                        type="range"
                        min="1"
                        max="10"
                        v-model.number="form.hunger"
                    />
                    <span class="hunger-value">{{ form.hunger }}</span>
                </div>
            </div>

            <div class="form-row">
                <label for="weight">Peso corporeo</label>
                <input
                    id="weight"
                    type="number"
                    placeholder="Peso corporeo"
                    v-model.number="form.weight"
                />
            </div>

            <div class="form-row note-row">
                <label for="note">Nota</label>
                <textarea id="note" v-model="form.notes" placeholder="Aggiungi una nota"></textarea>
            </div>

            <div class="actions">
                <button class="btn-primary btn-red" @click="closeModal"><i class="fa fa-undo" aria-hidden="true"></i>Annulla</button>
                <button class="btn-primary" @click="saveEntry"><i class="fa fa-check" aria-hidden="true"></i>Conferma</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.diary-table th:nth-child(2),
.diary-table td:nth-child(2),
.diary-table th:nth-child(4),
.diary-table td:nth-child(4),
.diary-table th:nth-child(5),
.diary-table td:nth-child(5),
.diary-table th:nth-child(7),
.diary-table td:nth-child(7) {
    display: none;
}


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

.diary-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.diary-table tbody tr:hover {
  background: #f6f7fb;
}

.diary-table tbody tr:last-child td {
  border-bottom: none;
}

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

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}


.badge.Ottima {
  color: #8a6d00;
  background: #fff4c2;
}


.badge.Sgarro {
  color: #b00020;
  background: #ffd6d6;
}


.badge.Media {
  color: #1a7f37;
  background: #d9f7df;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

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

.modal {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 18px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-header {
  margin-bottom: 5px;
}

.modal-header h2 {
  font-size:14pt;
  margin: 0;
  color: #1e1548;
}

.form-row,
.form-column {
  display: flex;
  flex-direction: column;
}

.form-row label,
.form-column label {
  font-size: 10pt;
  font-weight: 600;
  min-width: unset;
  margin-bottom: 2px;
}

.modal input,
.modal select,
.modal textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.modal textarea {
  min-height: 100px;
  resize: vertical;
}

.modal input[type="date"]:focus, 
.modal input[type="number"]:focus,
.modal select:focus,
.modal textarea:focus {
  outline: none;
  border-color: #5b47c5;
  box-shadow: 0 0 0 4px rgba(91,71,197,0.12);
}

.note-row {
  flex-direction: column;
  align-items: stretch;
}

.note-row label {
  min-width: auto;
}

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

.hunger-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hunger-row input[type="range"] {
  flex: 1;
}

.hunger-value {
  font-size: 10pt;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  line-height: 1;
  transform: translateY(-1px);
}


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

.charts-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  min-height: 320px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.chart-card h3 {
  margin: 0;
  color: #1e1548;
  font-size: 1.2rem;
}

.chart-card p {
  margin-top: 6px;
  margin-bottom: 18px;
  color: #666;
  font-size: 0.9rem;
}

.chart-card canvas {
  height: 220px !important;
}

.diary-header {
  background: #1e1548;
  border-radius: 28px;
  padding: 28px 34px;
  display: flow-root;
  align-items: flex-start;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  gap: 24px;
}

.client-info {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  flex-shrink: 0;
}


.avatar {
  object-fit: cover;
  border: 4px solid #f1f2f7;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow:
    0 8px 24px rgba(0,0,0,0.12),
    0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
  background-color: white;
}

.client-details h1 {
  margin: 0;
  font-size: 16pt;
  color: #ffffff;
  font-weight: 700;
}

.client-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.client-meta span {
  color: #fffdfd;
  font-size: 10pt;
}

.add-btn {
  background-color: white;
  color: black;
  margin-top: 7px;
  padding: 5pt;
}

.actions {
  display: flex;
  flex-direction: row;
  margin:0;
}

.actions button {
  width: 40%;

}

@media (min-width: 768px) {
  .diary-header{
      display: flex;
      justify-content: space-between;
  }

  .diary-table thead {
    display: table-header-group;
    background: #1e1548;
    color: white;
  }

  .diary-table tbody tr {
    display: table-row;
  }

  .diary-table td, .diary-table th {
    display: table-cell !important;
  }

  .avatar{
    height: 170px;
    width: 170px;
  }
  .client-details h1 {
    font-size: 24pt;
  }
  .client-meta span {
    font-size: 14pt;
  }

  .header-row{
    display:flex;
    gap:12px;
  }

  .client-info {
    flex-direction: row;
    text-align: left;
    align-items: center;
    gap: 18px;
  }

  .add-btn {
    align-self: flex-end;
  }

  .modal {
    max-width: 700px;
    padding: 28px;
    gap: 18px;
  }

  .modal-header h2 {
    font-size: 18pt;
  }
  .form-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .form-column {
    flex-direction: column;
  }

  .form-row label,
  .form-column label {
    min-width: 140px;
    font-size: 0.95rem;
  }

  .modal input,
  .modal select,
  .modal textarea {
    flex: 1;
  }


  .hunger-value {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
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
