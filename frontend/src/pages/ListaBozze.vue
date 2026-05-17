<script setup>
import { ref, onMounted, computed} from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { ROLES } from '../utils/utils.js'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { formatPrograms } from '../utils/utils.js'


/**
 * L'idea è che una bozza viene creata partendo dalla scadenza.
 * Nel list item bozza sarebbe carino continuare a mostrare i giorni mancanti alla scadenza. 
 */
const router = useRouter()
const programs = ref([])
const loading = ref(true)
const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})

const sidebarOpen = ref(true)


const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const goToDetail = (id) => {
  router.push(`/bozze/dettaglio-bozza`)
}

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const fetchBozze = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:5000/api/training-programs/trainer-programs', config)
    const allPrograms = res.data.data || res.data
    programs.value = allPrograms.filter(p => p.programStatus === 'draft')
    console.log(allPrograms)
  } catch (error) {
    console.error("Errore nel recupero delle bozze:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBozze)

const formattedPrograms = computed(() => {
 return formatPrograms(programs.value)
})

</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-programmi">
        <div class="header">
          <h1 class="programmi-title">Bozze Programmi</h1>
          <p class="programmi-sub">Gestisci i programmi che stai preparando.</p>
        </div>

        <div v-if="loading" class="loader" style="text-align: center; padding: 2rem;">
          <i class="fa fa-spinner fa-spin"></i> Caricamento bozze...
        </div>

        <MainList v-else-if="formattedPrograms.length > 0">
          <MainListItem
            v-for="program in formattedPrograms"
            :key="program._id"
            :title="program.title"
            :status="program.statusText"
            :statusClass="program.statusClass"
            :iconClass="program.iconClass"
            icon="fa fa-pencil-square-o"
            @click="router.push(`/bozze/dettaglio-bozza/${program._id}`)"
          >
            <template #subtitle>
              {{ program.athleteId?.name }} {{ program.athleteId?.surname }} - {{ program.sessionsPerWeek }} split
            </template>
          </MainListItem>
        </MainList>

        <div v-if="!loading && formattedPrograms.length === 0" class="empty-state">
           <i class="fa fa-folder-open-o"></i>
           <p>Nessun programma in stato bozza trovato.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.lista-programmi {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.header {
  display:flow-root;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.programmi-title { 
  font-size: 1.75rem; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}

.programmi-sub   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}
.main-content {
  margin-top: 60px;      
  margin-left: 0;
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
</style>