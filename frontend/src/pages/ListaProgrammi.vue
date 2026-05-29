<script setup>
import { ref, onMounted } from 'vue'
import { ROLES } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import axios from 'axios'

import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const programs = ref([])
const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})
const sidebarOpen = ref(true)

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    if (userLogged.value.role === ROLES.PERSONAL_TRAINER) {
      const res = await axios.get('http://localhost:5000/api/training-programs/trainer-programs', config)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: p.title || `Programma di ${p.athleteId?.name || 'Cliente'} ${p.athleteId?.surname || ''}`,
        client: `${p.athleteId?.name || 'Cliente'} ${p.athleteId?.surname || ''}`,
        category: p.splits[0]?.name || 'N/A',
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.programStatus
      }))
    } else {
      const res = await axios.get('http://localhost:5000/api/training-programs/my-programs', config)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: p.title || `Scheda creata da ${p.trainerId?.surname || 'Trainer'}`,
        category: p.splits[0]?.name || 'Generale',
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.programStatus
      }))
    }
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + error, "error")
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
        <div class="header-text">
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
              {{p.client}} - {{ p.date }}
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

</style>