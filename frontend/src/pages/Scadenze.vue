<script setup>
import { ref, computed, onMounted } from 'vue'
import { calculateDaysLeft} from '../utils/utils.js'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'

import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import AppModal from '../components/Modal.vue'


const router = useRouter()
const sidebarOpen = ref(true)
const showModal = ref(false)
const loading = ref(true)
const deadlines = ref([])
const athletes = ref([])
const showProgramModal = ref(false)
const showDeadlineModal = ref(false)
const selectedDeadline = ref(null)

const today = new Date().toISOString().split('T')[0]

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const newDeadline = ref({
  athleteId: '',
  title: 'Nuovo Programma',
  dueDate: today,
  notes: ''
})

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const fetchData = async () => {
  loading.value = true
  try {
    const [resSca, resAth] = await Promise.all([
      axios.get('http://localhost:5000/api/deadlines', config),
      axios.get('http://localhost:5000/api/users/my-clients', config)
    ])
    deadlines.value = resSca.data.data
    athletes.value = resAth.data.data
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const createProgram = async (deadline) => {
  try {
    const res = await axios.post('http://localhost:5000/api/training-programs/init', {
      athleteId: deadline.athleteId._id,
      deadlineId: deadline.id || deadline._id,
      sessionsPerWeek: parseInt(sessions),
      title: newDeadline.value.title || `Programma - ${deadline.athleteId.surname}`
    }, config)

    if (res.data.success) {
      router.push(`/bozze/dettaglio-bozza/${res.data.data._id}`)
    }
  } catch (error) {
    showToast("Errore nella creazione del programma: " + error, "error")
  }
}

const saveNewDeadline = async () => {
  console.log(newDeadline.value)
  if (!newDeadline.value.athleteId || !newDeadline.value.dueDate) {
    showToast("Atleta o data di scadenza mancante", "error")
  }
  try {
    await axios.post('http://localhost:5000/api/deadlines', newDeadline.value, config)
    showModal.value = false
    fetchData()
    showToast("Scadenza creata con successo!", "success")
  } catch (error) {
    showToast("Errore nella creazione della scadenza: " + error, "error")
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}


const programForm = ref({
  title: '',
  sessions: 3,
  startDate: today,
  endDate: today
})

const openProgramModal = (deadline) => {
  selectedDeadline.value = deadline

  programForm.value = {
    title: `Programma - ${deadline.athleteId?.surname || ''}`,
    sessions: 3,
    startDate: deadline.dueDate?.split('T')[0] || today,
    endDate: today
  }

  showDeadlineModal.value = false
  showProgramModal.value = true
}

const openDeadlineDetail = (deadline) => {
  selectedDeadline.value = { ...deadline }
  
  if (selectedDeadline.value.dueDate) {
    selectedDeadline.value.dueDate = new Date(selectedDeadline.value.dueDate)
      .toISOString()
      .split('T')[0]
  }
  
  showDeadlineModal.value = true
}

const saveDeadlineChanges = async () => {
  if (!selectedDeadline.value || !selectedDeadline.value._id) {
    showToast("Nessuna scadenza selezionata", "error")
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:5000/api/deadlines/${selectedDeadline.value._id}`,
      {
        title: selectedDeadline.value.title,
        dueDate: selectedDeadline.value.dueDate,
        notes: selectedDeadline.value.notes
      },
      config
    );

    if (response.data.success) {
      showDeadlineModal.value = false;
      selectedDeadline.value = null;
      await fetchData();
      showToast("Scadenza aggiornata con successo!", "success")
    }
  } catch (error) {
    showToast("Errore durante l'aggiornamento della scadenza: " + error, "error");
  }
};

const formattedDeadlines = computed(() => {
  return deadlines.value.map((d) => {
    const daysLeft = calculateDaysLeft(d.dueDate)

    let statusClass = ''
    let iconClass = ''

    if (daysLeft <= 0) {
      statusClass = 'status-red'
      iconClass = 'icon-red'
    } 
    else if (daysLeft < 5) {
      statusClass = 'status-orange'
      iconClass = 'icon-orange'
    } 
    else if (daysLeft <= 10) {
      statusClass = 'status-yellow'
      iconClass = 'icon-yellow'
    } 
    else {
      statusClass = 'status-green'
      iconClass = 'icon-green'
    }

    return {
      ...d,
      statusText:
        daysLeft === 0
          ? 'Oggi'
          : daysLeft === 1
          ? '1 giorno'
          : `${daysLeft} giorni`,

      statusClass,
      iconClass
    }
  })
})

</script>
<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-scadenze">
        <div class="page-header">
          <div class="header-text">
            <h1 class="scadenze-title">Le mie Scadenze</h1>
            <p class="subtitle">Gestisci i programmi in arrivo per i tuoi atleti.</p>
          </div>
          <button class="btn-primary" @click="showModal = true">
            <i class="fa fa-plus"></i> Nuova Scadenza
          </button>
        </div>

        <div v-if="loading" class="loader">Caricamento in corso...</div>

        <MainList v-else>
          <ListItem
            v-for="s in formattedDeadlines"
            :key="s.id"
            icon="fa fa-calendar-check-o"
            :title="`${s.athleteId?.name || ''} ${s.athleteId?.surname || ''}`"
            :status="s.statusText"
            :statusClass="s.statusClass"
            :iconClass="s.iconClass"
            @click="openDeadlineDetail(s)"
          >
            <template #subtitle>
              <div class="plan-subtitle">
                <div class="info-row">
                  <i class="fa fa-clock-o"></i>
                  <span>Inizio previsto: <strong>{{ new Date(s.dueDate).toLocaleDateString() }}</strong></span>
                </div>
              </div>
            </template>
          </ListItem>
        </MainList>

        <div v-if="!loading && deadlines.length === 0" class="empty-state">
           <i class="fa fa-check-circle-o"></i>
           <p>Nessuna scadenza pendente. Ottimo lavoro!</p>
        </div>
      </div>

      <AppModal
        v-model="showDeadlineModal"
        title="Dettaglio e Modifica Scadenza"
        @close="showDeadlineModal = false"
        width="650px"
      >
        <div v-if="selectedDeadline" class="deadline-detail">

          <div class="detail-row">
            <span class="label">Atleta</span>
            <span>
              {{ selectedDeadline.athleteId?.name }}
              {{ selectedDeadline.athleteId?.surname }}
            </span>
          </div>

          <div class="form-row">
            <label for="edit-title" class="label">Titolo:</label>
            <input 
              type="text" 
              id="edit-title" 
              v-model="selectedDeadline.title" 
              class="form-control"
            />
          </div>

          <div class="form-row">
            <label for="edit-date" class="label">Scadenza:</label>
            <input 
              type="date" 
              id="edit-date" 
              v-model="selectedDeadline.dueDate"
            />
          </div>

          <div
            class="form-row"
            v-if="selectedDeadline.notes"
          >
            <label for="edit-notes" class="label">Note:</label>
            <textarea 
              id="edit-notes" 
              v-model="selectedDeadline.notes" 
              class="form-control"
              placeholder="Aggiungi eventuali note..."
            ></textarea>
          </div>

        </div>

        <template #actions>
          <button class="btn-primary btn-red"  @click="showDeadlineModal = false">
            <i class="fa fa-close"></i>
            Chiudi
          </button>

          <button class="btn-primary"  @click="saveDeadlineChanges">
            <i class="fa fa-save"></i>
            Salva Modifiche
          </button>

          <button v-if="selectedDeadline?.status === 'pending'"  class="btn-primary"  @click="openProgramModal(selectedDeadline)">
            <i class="fa fa-magic"></i>
            Crea Programma
          </button>
        </template>
      </AppModal>

      <AppModal
        v-model="showProgramModal"
        title="Crea Programma"
        width="580px"
      >
        <div class="form-row">
          <label>Nome Programma</label>

          <input
            type="text"
            v-model="programForm.title"
          />
        </div>

        <div class="form-row">
          <label>Split</label>

          <input
            type="number"
            min="1"
            max="7"
            v-model.number="programForm.sessions"
          />
        </div>

        <div class="form-row">
          <label>Data Inizio</label>

          <input
            type="date"
            v-model="programForm.startDate"
          />
        </div>

        <div class="form-row">
          <label>Fine Validità</label>

          <input
            type="date"
            v-model="programForm.endDate"
          />
        </div>

        <template #actions>
          <button
            class="btn-primary btn-red"
            @click="showProgramModal = false"
          >
            Annulla
          </button>

          <button
            class="btn-primary"
            @click="createProgram"
          >
            Crea Programma
          </button>
        </template>
      </AppModal>

      <AppModal
        v-model="showModal"
        title="Nuova Scadenza"
        width="520px"
      >
        <div class="form-row">
          <label>Titolo</label>

          <input
            type="text"
            v-model="newDeadline.title"
            placeholder="Es: Nuova Scheda"
          />
        </div>

        <div class="form-row">
          <label>Atleta</label>

          <select v-model="newDeadline.athleteId">
            <option disabled value="">
              Scegli atleta...
            </option>

            <option
              v-for="a in athletes"
              :key="a.id"
              :value="a.id"
            >
              {{ a.name }}
              {{ a.surname }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>Data</label>

          <input
            type="date"
            v-model="newDeadline.dueDate"
            :min="today"
          />
        </div>

        <div class="form-row">
          <label>Note</label>

          <input
            type="text"
            v-model="newDeadline.notes"
            placeholder="Es: Ipertrofia"
          />
        </div>

        <template #actions>
          <button
            class="btn-primary btn-red"
            @click="showModal = false"
          >
            Annulla
          </button>

          <button
            class="btn-primary"
            @click="saveNewDeadline"
          >
            Salva Scadenza
          </button>
        </template>
      </AppModal>
    </main>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10pt;
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

.deadline-detail {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: white;
  border: 1px solid #e5e8f3;
  border-radius: 14px;
}

.label {
  font-weight: 700;
  color: #1e1548;
}

.form-control {
  flex: 1;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  background: white;
  color: #333;
}

.form-control:focus {
  outline: none;
  border-color: #5b47c5;
  box-shadow: 0 0 0 4px rgba(91, 71, 197, 0.12);
}
</style>