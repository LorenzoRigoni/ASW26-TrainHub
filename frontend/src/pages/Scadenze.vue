<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'

// Questa pagina è pensata per essere visibile solo al pt. 
// In pratica quando un cliente ha compilato tutte le settimane, tranne l'ultima, viene creata automaticamente 
// una scadenza visibile al pt. i dati della scadenza li compiliamo noi in automatico. Questo permette al pt di 
// sapere quando deve essere pronto un programma di allenamento nuovo per la settimana successiva. 
// sarebbe carino calcolare quanti giorni mancano alla scadenza in modo ma mostrare gli elementi e colorarli 
// in ordine di priorità. 
// Lasciamo la due date editable, per un qualsiasi motivo il trainer potrebbe dover posticipare la scadenza 
// (infortunio, vacanze, malattia...)

const router = useRouter()
const sidebarOpen = ref(true)
const showModal = ref(false)
const loading = ref(true)
const deadlines = ref([])
const athletes = ref([])

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
    console.error("Errore caricamento:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const getPriorityClass = (dueDate) => {
  const diffTime = new Date(dueDate) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'status-expired'
  if (diffDays <= 3) return 'status-urgent'
  return 'status-upcoming'
}

const createProgram = async (deadline) => {
  const sessions = prompt(`Quanti split settimanali per ${deadline.athleteId.name}?`, "3")
  if (!sessions || isNaN(sessions)) return
  console.log(deadline)
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
    console.error("Errore creazione programma:", error)
    alert("Errore nell'inizializzazione del programma.")
  }
}

const saveNewDeadline = async () => {
  console.log(newDeadline.value)
  if (!newDeadline.value.athleteId || !newDeadline.value.dueDate) {
    alert("Compila tutti i campi obbligatori")
    return
  }
  try {
    await axios.post('http://localhost:5000/api/deadlines', newDeadline.value, config)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
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
            v-for="s in deadlines"
            :key="s.id"
            icon="fa fa-calendar-check-o"
            :title="`${s.athleteId?.name || ''} ${s.athleteId?.surname || ''}`"
            :status="s.status === 'pending' ? 'In attesa' : 'Completata'"
            :class="getPriorityClass(s.dueDate)"
          >
            <template #subtitle>
              <div class="plan-subtitle">
                <div class="info-row">
                  <i class="fa fa-clock-o"></i>
                  <span>Inizio previsto: <strong>{{ new Date(s.dueDate).toLocaleDateString() }}</strong></span>
                </div>
                
                <div v-if="s.status === 'pending'" class="info-row" style="margin-top: 8px;">
                  <button 
                    @click.stop="createProgram(s)" 
                    class="btn-primary"
                    style="padding: 8px 14px; font-size: 0.85rem;"
                  >
                    <i class="fa fa-magic"></i> Crea Programma
                  </button>
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

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Nuova Scadenza</h2>
            </div>

          <div class="form-row">
            <label>Titolo</label>
            <input type="text" v-model="newDeadline.title" placeholder="Es: Nuova Scheda">
          </div>
          
          <div class="form-row">
            <label>Atleta</label>
            <select v-model="newDeadline.athleteId">
              <option value="" disabled>Scegli atleta...</option>
              <option v-for="a in athletes" :key="a.id" :value="a.id">
                {{ a.name }} {{ a.surname }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label>Data</label>
            <input type="date" v-model="newDeadline.dueDate" :min="today">
          </div>

          <div class="form-row">
            <label>Note</label>
            <input type="text" v-model="newDeadline.notes" placeholder="Es: Ipertrofia">
          </div>

          <div class="modal-actions">
            <button class="btn-danger" @click="showModal = false" style="background: #666;">Annulla</button>
            <button class="btn-primary" @click="saveNewDeadline">Salva Scadenza</button>
          </div>
        </div>
      </div>
    </main>

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