<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getInitials, getAvatarColor, ROLES, getErrorMessage } from '../utils/utils'
import { API_URL } from '../utils/config.js'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { useSidebarStore } from '../stores/sidebar.js'

import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import StatCard from '../components/StaticCard.vue'
import ActionCard from '../components/ActionCard.vue'
import PanelList from '../components/HomePanelList.vue'
import ListItem from '../components/HomeListItem.vue'
import AIChat from '../components/AIChat.vue'
import profileImage from '../assets/profileImage.png'
import axios from 'axios'


const auth = useAuthStore()
const customersList = ref([])
const stats = ref({ activeClientsCount: 0, totalPrograms: 0, activeNutritionalPlans: 0, pendingPrograms: 0 })
const nutriStats = ref({ activeClientsCount: 0, totalPlans: 0, activeNutritionalPlans: 0, pendingPlans: 0 })
const programsList = ref([])
const recentNotifications = ref([])
const richiesteNutrizionista = ref([])
const clientiNutrizionista = ref([])
const activeProgram = ref(null)
const sidebar = useSidebarStore()
const router = useRouter()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
})

const giorniDaUltimo = computed(() => {
  const data = '2025-05-01'

  if (!data) return null

  return Math.floor(
    (new Date() - new Date(data)) / 86400000
  )
})

const statCardsPT = computed(() => [
  {
    label: 'Clienti Attivi',
    value: stats.value?.activeClientsCount,
    icon: 'fa fa-users',
    color: '#4a90d9',
    bg: 'rgba(74,144,217,0.12)',
    route: '/clienti'
  },
  {
    label: 'Schede Create',
    value: stats.value?.totalPrograms,
    icon: 'fa fa-list',
    color: '#7c6af7',
    bg: 'rgba(124,106,247,0.12)',
    route: '/programmi'
  },
  {
    label: 'Richieste Nutriz.',
    value: stats.value?.activeNutritionalPlans,
    icon: 'fa fa-apple',
    color: '#e05c9a',
    bg: 'rgba(224,92,154,0.12)',
    route: '/richieste-nutrizione'
  },
  {
    label: 'In Attesa',
    value: stats.value?.pendingPrograms,
    icon: 'fa fa-clock-o',
    color: '#f5a623',
    bg: 'rgba(245,166,35,0.12)',
    route: '/scadenze'
  }
])

const statCardsNutri = computed(() => [
  {
    label: 'Clienti Attivi',
    value: nutriStats.value?.activeClientsCount,
    icon: 'fa fa-users',
    color: '#4a90d9',
    bg: 'rgba(74,144,217,0.12)',
    route: '/clienti'
  },
  {
    label: 'Piani Creati',
    value: nutriStats.value?.totalPlans,
    icon: 'fa fa-list',
    color: '#7c6af7',
    bg: 'rgba(124,106,247,0.12)',
    route: '/piani-alimentari'
  },
  {
    label: 'Richieste Nutriz.',
    value: nutriStats.value?.activeNutritionalPlans,
    icon: 'fa fa-apple',
    color: '#e05c9a',
    bg: 'rgba(224,92,154,0.12)',
    route: '/richieste-nutrizione'
  },
  {
    label: 'In Attesa',
    value: nutriStats.value?.pendingPlans,
    icon: 'fa fa-clock-o',
    color: '#f5a623',
    bg: 'rgba(245,166,35,0.12)',
    route: '/richieste-nutrizione'
  }
])

const getNotifIcon = (type) => {
  switch (type) {
    case 'program_created':
      return 'fa fa-file-text-o'

    case 'workout_created':
      return 'fa fa-check-circle'

    case 'package_expiring':
      return 'fa fa-exclamation-triangle'

    case 'nutrition_plan':
      return 'fa fa-cutlery'

    default:
      return 'fa fa-bell'
  }
}

const goToCustomerDetail = (id) => {
  router.push(`/clienti/dettaglio-cliente/${id}`)
}

const goToProgramDetail = (id) => {
  router.push(`/programmi/dettaglio-programma/${id}`)
}

const goToCustomersList = () => {
  router.push('/clienti')
}

const goToProgramsList = () => {
  router.push('/programmi')
}

const goToNutritionRequestsId = (richiesta) => {
  router.push(`/richieste-nutrizione/dettaglio-richiesta/${richiesta}`)
}

const goToNutritionPlanDetail = () => {
  router.push('/programmi')
}

const fetchData = async () => {
  try {
    try {
      const notifRes = await axios.get(`${API_URL}/api/notifications/unread`, auth.apiConfig)
      if (notifRes.data && notifRes.data.data) {
        recentNotifications.value = notifRes.data.data.slice(0, 3)
      }

      if (!recentNotifications.value) recentNotifications.value = []
    } catch (notifErr) {
      showToast("Errore nel caricamento delle notifiche: " + getErrorMessage(notifErr), "error")
    }

    if (auth.user.role === ROLES.PERSONAL_TRAINER) {
      const [clientsRes, statsRes, programsRes] = await Promise.all([
        axios.get(`${API_URL}/api/users/my-clients`, auth.apiConfig),
        axios.get(`${API_URL}/api/users/trainer-stats`, auth.apiConfig),
        axios.get(`${API_URL}/api/users/programs-list`, auth.apiConfig)
      ])

      customersList.value = clientsRes.data?.data || []
      customersList.value.forEach((c) => {
      if (c.profilePicture) {
        c.profilePicture = `${API_URL}${c.profilePicture}`
      } else {
        c.profilePicture = profileImage
      }
    })
      stats.value = statsRes.data?.data || { activeClientsCount: 0, totalPrograms: 0, activeNutritionalPlans: 0, pendingPrograms: 0 }
      programsList.value = programsRes.data?.data || []
    } else if (auth.user.role === ROLES.CLIENTE) {
      const [programsRes, activeRes] = await Promise.all([
        axios.get(`${API_URL}/api/training-programs/my-programs`, auth.apiConfig),
        axios.get(`${API_URL}/api/training-programs/active`, auth.apiConfig).catch(() => ({ data: { data: null } }))
      ])

      programsList.value = (programsRes.data?.data || []).map(p => ({
        id: p._id,
        title: `Scheda del ${new Date(p.createdAt).toLocaleDateString()}`,
        category: p.splits.length > 0 ? p.splits[0].name : 'Allenamento',
        status: p.programStatus === 'active' ? 'Attiva' : 'Archiviata'
      }))

      activeProgram.value = activeRes.data.data
    } else {
      const [nutrClients, statsRes, nutrRequests] = await Promise.all([
        axios.get(`${API_URL}/api/users/my-clients`, auth.apiConfig),
        axios.get(`${API_URL}/api/users/nutritionist-stats`, auth.apiConfig),
        axios.get(`${API_URL}/api/nutrition-requests`, auth.apiConfig)
      ])
      richiesteNutrizionista.value = nutrRequests.data.data
      nutriStats.value = statsRes.data.data
      clientiNutrizionista.value = nutrClients.data.data
      clientiNutrizionista.value.forEach((c) => {
      if (c.profilePicture) {
        c.profilePicture = `${API_URL}${c.profilePicture}`
      } else {
        c.profilePicture = profileImage
      }
    })
    }
  } catch(error){
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  }
}

onMounted(fetchData)
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="sidebar.toggle" />
    <SideMenu :isOpen="sidebar.isOpen" :role="auth.user.role" @close="sidebar.close" />
    <main class="main-content" :class="{ 'sidebar-open': sidebar.isOpen }">
      <div class="dashboard-home">
        <div class="page-header">
          <div class="header-text">
            <h1 class="welcome-title">{{ greeting }}, {{ auth.user.name }}</h1>
            <p class="welcome-sub">Ecco il riepilogo della tua attività</p>
          </div>
          <button v-if="auth.user.role === ROLES.CLIENTE" class="btn-primary" @click=""> 
            <i class="fa fa-play"></i> Inizia Allenamento
          </button>
        </div>

        <!-- NOTIFICATION SECTION -->
        <div v-if="recentNotifications.length > 0 && auth.user.role !== ROLES.CLIENTE" class="notif-section">
          <PanelList
            title="Nuove Notifiche"
            link-label="Vedi tutte"
            @link-click="router.push('/home/notifiche')"
          >
            <ListItem
              v-for="n in recentNotifications" :key="n._id"
              :title="n.title"
              :subtitle="n.message"
              @click="router.push('/home/notifiche')"
            >
              <template #left>
                <div class="icon-wrap notif-icon-wrap">
                  <i :class="getNotifIcon(n.type)"></i>
                </div>
              </template>
            </ListItem>
          </PanelList>
        </div>


        <!-- PERSONAL TRAINER -->
        <template v-if="auth.user.role === ROLES.PERSONAL_TRAINER">
          <div class="stats-grid">
            <StatCard
              v-for="card in statCardsPT" :key="card.label"
              :label="card.label" :value="card.value"
              :icon="card.icon"   :color="card.color" :bg="card.bg"
              @click="router.push(card.route)"
            />
          </div>

          <div class="panels-grid">
            <PanelList
              title="I tuoi Clienti"
              link-label="Vedi tutti"
              :is-empty="customersList.length === 0"
              empty-icon="fa fa-users"
              empty-text="Nessun cliente ancora"
              @link-click="goToCustomersList"
            >
              <ListItem
                v-for="c in customersList" :key="c.id"
                :title="`${c.name} ${c.surname}`"
                :subtitle="c.email"
                @click="goToCustomerDetail(c.id)"
              >
                <template #left>
                  <div class="avatar">
                    <img :src="c.profilePicture" alt="User profile" class="user-icon" />
                  </div>
                </template>
                <template #right>
                  <span class="badge" :class="c.status === 'Attivo' ? 'badge-attivo' : 'badge-inattivo'">
                    {{ c.status }}
                  </span>
                </template>
              </ListItem>
            </PanelList>

            <PanelList
              title="Ultime Schede"
              link-label="Vedi tutte"
              :is-empty="programsList.length === 0"
              empty-icon="fa fa-file-text-o"
              empty-text="Nessuna scheda ancora"
              @link-click="goToProgramsList"
            >
              <ListItem
                v-for="s in programsList" :key="s.id"
                :title="s.title"
                :subtitle="`${s.category} · ${s.status}`"
                @click="goToProgramDetail(s.id)"
              >
                <template #left>
                  <div class="icon-wrap"><i class="fa fa-list" style="color:#1e1548"></i></div>
                </template>
                <template #right>
                  <i class="fa fa-chevron-right arrow"></i>
                </template>
              </ListItem>
            </PanelList>
          </div>

        </template>

        <!--  CLIENTE -->
        <template v-else-if="auth.user.role === ROLES.CLIENTE">
          <div class="action-cards-grid">
            <ActionCard
              icon="fa fa-book" icon-color="#4a90d9" icon-bg="rgba(74,144,217,0.12)"
              @click="router.push('/diario')"
            >
              <template v-if="misurazionOggi">
                <p class="card-label">Peso di oggi</p>
                <p class="card-value">{{ misurazionOggi.peso }} <span class="unit">kg</span></p>
                <p class="card-sub">Misurazioni già inserite ✓</p>
              </template>
              <template v-else>
                <p class="card-label">Diario di oggi</p>
                <p class="card-cta" style="color:#4a90d9">Aggiungi misurazioni</p>
                <p class="card-sub">Peso, circonferenze...</p>
              </template>
            </ActionCard>

            <ActionCard
              icon="fa fa-play" icon-color="#7c6af7" icon-bg="rgba(124,106,247,0.15)"
              :highlight="true"
              @click="router.push('/programmi')"
            >
              <p class="card-label">Allenamento di oggi</p>
              <p class="card-cta" style="color:#7c6af7">Inizia allenamento</p>
              <p class="card-sub">Scheda attiva disponibile</p>
            </ActionCard>

            <ActionCard
              icon="fa fa-calendar-check-o" icon-color="#f5a623" icon-bg="rgba(245,166,35,0.12)"
              :clickable="true"
              @click="router.push('/programmi')"
            >
              <p class="card-label">Ultimo allenamento</p>
              <template v-if="giorniDaUltimo !== null">
                <p class="card-value">{{ giorniDaUltimo }} <span class="unit">{{ giorniDaUltimo === 1 ? 'giorno fa' : 'giorni fa' }}</span></p>
                <!--<p class="card-sub">{{ ultimoAllenamento.data }}</p>-->
              </template>
              <template v-else>
                <p class="card-sub">Nessun allenamento registrato</p>
              </template>
            </ActionCard>

          </div>

          <div class="panels-grid">
            <PanelList
              v-if="recentNotifications.length > 0"
              title="Nuove Notifiche"
              link-label="Vedi tutte"
              @link-click="router.push('/home/notifiche')"
            >
              <ListItem
                v-for="n in recentNotifications" :key="n._id"
                :title="n.title"
                :subtitle="n.message"
                @click="router.push('/home/notifiche')"
              >
                <template #left>
                  <div class="icon-wrap notif-icon-wrap">
                    <i :class="getNotifIcon(n.type)"></i>
                  </div>
                </template>
              </ListItem>
            </PanelList>

            <PanelList
              title="Le tue Schede"
              link-label="Vedi tutte"
              :is-empty="programsList.length === 0"
              empty-icon="fa fa-list"
              empty-text="Nessuna scheda assegnata"
              @link-click="goToProgramsList"
            >
              <ListItem
                v-for="s in programsList" :key="s.id"
                :title="s.title"
                :subtitle="`${s.category} · ${s.status}`"
                @click="goToProgramDetail(s.id)"
              >
                <template #left>
                  <div class="icon-wrap"><i class="fa fa-list" style="color:#1e1548"></i></div>
                </template>
                <template #right>
                  <i class="fa fa-chevron-right arrow"></i>
                </template>
              </ListItem>
            </PanelList>
          </div>

        </template>

        <!--  NUTRIZIONISTA -->
        <template v-else-if="auth.user.role === ROLES.NUTRIZIONISTA">

          <div class="stats-grid stats-grid--3">
            <StatCard
              v-for="card in statCardsNutri" :key="card.label"
              :label="card.label" :value="card.value"
              :icon="card.icon"   :color="card.color" :bg="card.bg"
              @click="router.push(card.route)"
            />
          </div>

          <div class="panels-grid">
            <PanelList
              title="Richieste in Attesa"
              :is-empty="richiesteNutrizionista.length === 0"
              empty-icon="fa fa-inbox"
              empty-text="Nessuna richiesta"
              :badge="`${richiesteNutrizionista.length} nuove`"
            >
              <ListItem
                v-for="r in richiesteNutrizionista" :key="r.id"
                :title="`${r.clientId.name} ${r.clientId.surname}`"
                :subtitle="`${r.goal} · ${new Date(r.startDate).toLocaleDateString()}`"
                @click="goToNutritionRequestsId(r._id)"
              >
                <template #left>
                  <div class="icon-wrap" style="background:rgba(224,92,154,0.1)">
                    <i class="fa fa-file-text-o" style="color:#e05c9a"></i>
                  </div>
                </template>
                <template #right>
                  <i class="fa fa-chevron-right arrow"></i>
                </template>
              </ListItem>
            </PanelList>

            <PanelList
              title="Clienti Attivi"
              link-label="Vedi tutti"
              :is-empty="clientiNutrizionista.length === 0"
              empty-icon="fa fa-users"
              empty-text="Nessun cliente ancora"
              @link-click="goToCustomersList"
            >
              <ListItem
                v-for="c in clientiNutrizionista" :key="c.id"
                :title="`${c.name} ${c.surname}`"
                :subtitle="c.email"
                @click="goToCustomerDetail(c.id)"
              >
                <template #left>
                  <div class="avatar" :style="{ background: getAvatarColor(c.name) }">
                    {{ getInitials(c.name, c.surname) }}
                  </div>
                </template>
                <template #right>
                  <span class="badge badge-attivo">{{ c.status }}</span>
                </template>
              </ListItem>
            </PanelList>
          </div>
        </template>
      </div>
      <AIChat />
    </main>
  </div>
</template>

<style scoped>
.dashboard-home {
  min-height: 100vh;
  background-color: #f4f6f9;
}

.notif-section {
  margin-bottom: 2rem;
}

.notif-icon-wrap {
  background: rgba(224,92,154,0.1);
  color: #e05c9a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 10px;
  margin-bottom: 10px;
}


.panels-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 0.85rem;
}

.icon-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(30,21,72,0.08);
  display: flex; align-items: center; justify-content: center;
}

.arrow { 
  color: #d1d5db; 
  font-size: 0.75rem; 
}

.badge { 
  font-size: 0.72rem; 
  font-weight: 600; 
  padding: 0.25rem 0.7rem; 
  border-radius: 20px; 
}

.badge-attivo   { 
  background-color: #d1fae5; 
  color: #065f46; 
}

.badge-inattivo { 
  background-color: #fee2e2; 
  color: #991b1b; 
}

.card-label {
  margin: 0 0 0.2rem;
  font-size: 0.78rem; 
  color: #6b7280;
  text-transform: uppercase; 
  font-weight: 500; 
  letter-spacing: 0.03em;
}

.card-value {
  margin: 0 0 0.15rem;
  font-size: 1.75rem; 
  font-weight: 800; 
  color: #1e1548; 
  line-height: 1.1;
}

.card-value .unit { 
  font-size: 0.9rem; 
  font-weight: 500; 
  color: #6b7280; 
}

.card-cta   { 
  margin: 0 0 0.15rem; 
  font-size: 1rem; 
  font-weight: 700; 
}

.card-sub   { 
  margin: 0; 
  font-size: 0.75rem; 
  color: #9ca3af; 
}

.user-icon {
  height: 50px;
  width: auto;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10pt;
}

@media (min-width: 768px) {
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 1.75rem;
}

.panels-grid {
  display: grid;
  grid-template-columns:1fr 1fr;
}

 .action-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
}
}
</style>
