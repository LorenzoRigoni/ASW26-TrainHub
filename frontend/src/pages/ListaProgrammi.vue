<script setup>
import { ref, onMounted } from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { fetchUserInfo, ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const programs = ref([])
const userLogged = ref({ name: '', surname: '', role: '' })
const sidebarOpen = ref(true)

const fetchData = async () => {
  try {
    const userData = await fetchUserInfo()
    if (userData) userLogged.value = userData

    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    if (userLogged.value.role === ROLES.PERSONAL_TRAINER) {
      const res = await axios.get('http://localhost:5000/api/training-programs/trainer/programs', config)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: `${p.athleteId.name} ${p.athleteId.surname}`,
        category: p.splits[0]?.name || 'N/A',
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.programStatus
      }))
    } else {
      const res = await axios.get('http://localhost:5000/api/training-programs/my-programs', config)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: `Scheda creata da ${p.trainerId.surname}`,
        category: p.splits[0]?.name || 'Generale',
        status: p.programStatus
      }))
    }
  } catch (error) {
    console.error("Errore caricamento programmi:", error)
  }
}

onMounted(fetchData)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const goToDetail = (id) => {
  router.push(`/programmi/dettaglio-programma/${id}`)
}

</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-programmi">
        <div class="header">
          <h1 class="programmi-title">Elenco programmi di allenamento</h1>
          <p class="programmi-sub">
            {{ userLogged.role === ROLES.PERSONAL_TRAINER ? 'Gestisci i piani dei tuoi atleti' : 'Visualizza i tuoi progressi' }}
          </p>
        </div>

        <MainList>
          <MainListItem
            v-for="p in programs"
            :key="p.id"
            icon="fa fa-file-text-o"
            :title="p.title"
            :status="p.status" 
            @click="goToDetail(p.id)"
          >
            <template #subtitle>
              {{ p.category }} - {{ p.date }}
            </template>
          </MainListItem>
        </MainList>

        <div v-if="programs.length === 0" class="empty-state">
           <i class="fa fa-folder-open-o"></i>
           <p>Nessun programma trovato.</p>
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