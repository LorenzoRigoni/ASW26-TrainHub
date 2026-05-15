<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchUserInfo } from '../utils/utils.js'
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

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const showModal = ref(false)

const today = new Date().toISOString().split('T')[0]

const router = useRouter()


const userLogged = ref({
  name: '',
  surname: '',
  role: ''
})

onMounted(async () => {
  const userData = await fetchUserInfo()
  if (userData) {
    userLogged.value = userData
  }
})

/* LISTA SCADENZE: dati di test */
//TODO: lo stato che mostriamo nel list item è di default in attesa appena viene aperta la richiesta. Quando il nutrizionista carica il piano, la richeista viene chiusa automaticamente. 
const programsToDo = ref([
  {
    client: 'Marco Rossi',
    dueDate: '2026-05-01',
  },
  {
    client: 'Lorenzo Rigoni',
    dueDate: '2026-06-15',
  },
  {
    client: 'Pippo Bianchi',
    dueDate: '2026-05-15',
  },
  {
    client: 'Bruno Viola',
    dueDate: '2026-06-21',
  }
])

//funzione per calcolo giorni mancanti alla scadenza
const calculateDaysLeft = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)

  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

//Imposta stato e colore in base ai giorni che mancano alla scadenza
const getStatusData = (dueDate) => {
  const daysLeft = calculateDaysLeft(dueDate)

  if (daysLeft < 5) {
    return {
      text: `${daysLeft} giorni`,
      color: 'red'
    }
  }

  if (daysLeft <= 10) {
    return {
      text: `${daysLeft} giorni`,
      color: 'yellow'
    }
  }

  return {
    text: `${daysLeft} giorni`,
    color: 'green'
  }
}

//Funzione che rielabora la lista di scadenze salvate modificando titolo e aggiungendo lo stato. Setta colore icona e colore status. 
const formattedPrograms = computed(() => {
  return programsToDo.value.map((deadline) => {
    const daysLeft = calculateDaysLeft(deadline.dueDate)

    let statusClass = ''
    let iconClass = ''

    if(daysLeft <= 0) {
        statusClass = 'status-orange'
        iconClass = 'icon-orange'
    } else if(daysLeft < 5){
        statusClass = 'status-red'
        iconClass = 'icon-red'
    } else if (daysLeft <= 10) {
        statusClass = 'status-yellow'
        iconClass = 'icon-yellow'
    } else {
        statusClass = 'status-green'
        iconClass = 'icon-green'
    }

    return {
      ...deadline,
      title: `${deadline.client} - ${deadline.dueDate}`,
      statusText: `${daysLeft} giorni`,
      statusClass,
      iconClass
    }
  })
})

const form = ref({
  client: '',
  dueDate: today,
  notes: ''
})

const openModal = () => {
  form.value = {
    client: ' ',
    dueDate: today,
    notes: ' '
  }
  showModal.value = true
}

//TODO: recuperare dati richiesta da backend. 
const openModalCompiled = () => {
  form.value = {
    client: 'Mario Rossi',
    dueDate: today,
    notes: 'Scadenza posticipata di un mese causa infortunio.'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}


const saveDeadline = () => {
  //TODO salvare le modifiche all'elemento aperto
  closeModal()
}

</script>
<template>
  <div id="app">

    <Navbar @toggle-sidebar="toggleSidebar" />

    <SideMenu :isOpen="sidebarOpen"  :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1>Scadenza</h1>
          <p>Qui puoi visualizzare i programmi in scadenza nei prossimi giorni. </p>
        </div>
        <button class="btn-primary" @click="openModal">
          <i class="fa fa-plus"></i>
           Crea Scadenza
        </button>
      </div>

      <!-- LISTA -->
      <MainList>
        <ListItem
            v-for="(deadline, index) in formattedPrograms"
            :key="index"
            :title="deadline.title"
            :status="deadline.statusText"
            :statusClass="deadline.statusClass"
            :iconClass="deadline.iconClass"
            icon="fa fa-calendar-times-o"
            @click="openModalCompiled"
        >
        </ListItem>
      </MainList>
    </main>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Scadenza</h2>
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

        
        <!-- DATE -->
        <div class="form-row">
          <label>Data scadenza programma </label>
          <input type="date" v-model="form.dueDate"/>
        </div>

        <div class="form-row">
          <label>Note</label>
          <input type="text" v-model="form.notes" />
        </div>

        <div class="modal-actions">
          <button class="btn-danger" @click="closeModal">Annulla</button>
          <button class="btn-primary" @click="saveDeadline">Salva</button>
          <button class="btn-primary" @click="router.push('/bozze/dettaglio-bozza')">Crea Programma</button>
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