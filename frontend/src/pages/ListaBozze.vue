<script setup>
import { ref, onMounted, computed} from 'vue'
import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import { ROLES } from '../utils/utils.js'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { formatPrograms } from '../utils/utils.js'
import { showToast } from '../utils/toast.js'


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
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
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
        <div class="header-text">
          <h1>Bozze Programmi</h1>
          <p>Gestisci i programmi che stai preparando.</p>
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
  </div>
</template>

<style scoped>

</style>