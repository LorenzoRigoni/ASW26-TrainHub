<script setup>
import { ref, onMounted } from 'vue'
import { ROLES, getErrorMessage } from '../utils/utils.js'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import axios from 'axios'
import { API_URL } from '../utils/config.js'

import MainList from '../components/MainList.vue'
import MainListItem from '../components/MainListItem.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

const router = useRouter()
const auth = useAuthStore()
const programs = ref([])
const sidebarOpen = ref(true)

const fetchData = async () => {
  try {
    if (auth.user.role === ROLES.PERSONAL_TRAINER) {
      const res = await axios.get(`${API_URL}/api/training-programs/trainer-programs`, auth.apiConfig)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: p.title || `Programma di ${p.athleteId?.name || 'Cliente'} ${p.athleteId?.surname || ''}`,
        client: `${p.athleteId?.name || 'Cliente'} ${p.athleteId?.surname || ''}`,
        category: p.splits[0]?.name || 'N/A',
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.programStatus
      }))
    } else {
      const res = await axios.get(`${API_URL}/api/training-programs/my-programs`, auth.apiConfig)
      programs.value = res.data.data.map(p => ({
        id: p._id,
        title: p.title || `Scheda creata da ${p.trainerId?.surname || 'Trainer'}`,
        trainer: `${p.trainerId?.name || 'Trainer'} ${p.trainerId?.surname || ''}`,
        category: p.splits[0]?.name || 'Generale',
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.programStatus
      }))
    }
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
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

    <SideMenu :isOpen="sidebarOpen" :role="auth.user.role" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="lista-programmi">
        <div class="header-text">
          <h1 class="programmi-title">Elenco programmi di allenamento</h1>
          <p class="programmi-sub">
            {{ auth.user.role === ROLES.PERSONAL_TRAINER ? 'Gestisci i piani dei tuoi atleti' : 'Visualizza i tuoi progressi' }}
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
              <span v-if="auth.user.role === 'trainer'">
                {{ p.client }}
              </span>
              <span v-else>
                {{ p.trainer }}
              </span>
              
              - {{p.date}}
            </template>
          </MainListItem>
        </MainList>

        <div v-if="programs.length === 0" class="empty-state">
           <i class="fa fa-folder-open-o"></i>
           <p>Nessun programma trovato.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>