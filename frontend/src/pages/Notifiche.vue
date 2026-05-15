<script setup>
import { ref, onMounted } from 'vue'
import { fetchUserInfo } from '../utils/utils.js'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'
import Footer from '../components/Footer.vue'

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

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

/* NOTIFICHE */
//TODO sostituire con dati reali
const notifications = ref([
  {
    title: 'Nuovo diario compilato',
    message: 'Marco Rossi ha compilato il diario alimentare.',
    date: 'Oggi · 09:42',
    status: 'nuova',
    icon: 'fa fa-book',
    read: false
  },

  {
    title: 'Piano alimentare in scadenza',
    message: 'Il piano di Giulia Bianchi scadrà tra 2 giorni.',
    date: 'Oggi · 08:10',
    status: 'warning',
    icon: 'fa fa-exclamation-triangle',
    read: false
  },

  {
    title: 'Nuovo cliente assegnato',
    message: 'Ti è stato assegnato Luca Verdi.',
    date: 'Ieri · 18:22',
    status: 'info',
    icon: 'fa fa-user-plus',
    read: true
  },

  {
    title: 'Pagamento ricevuto',
    message: 'Pagamento confermato per Andrea Neri.',
    date: 'Ieri · 11:05',
    status: 'success',
    icon: 'fa fa-check-circle',
    read: true
  }
])

//TODO decidere cosa mostrare al click sulla notifica: dettaglio? messaggio di conferma? 
const openNotification = (notification) => {
  notification.read = true
  console.log(notification)
}
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <SideMenu :isOpen="sidebarOpen" :role="userLogged.role"  @close="sidebarOpen = false"/>
    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="page-header">
        <div>
          <h1>Notifiche</h1>
          <p> Aggiornamenti recenti della piattaforma</p>
        </div>
      </div>
      <MainList>
        <ListItem
          v-for="(notification, index) in notifications"
          :key="index"
          :title="notification.title"
          :status="notification.status"
          :icon="notification.icon"
          :class="{ 'notification-read': notification.read, 'notification-unread': !notification.read }"
          @click="openNotification(notification)"
        >
          <template #subtitle>
            <div class="notification-subtitle">
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-date">
                <i class="fa fa-clock-o"></i>
                <span> {{ notification.date }}</span>
              </div>
            </div>
          </template>

          <template #status>
            <span class="notification-badge" :class="notification.status">
              {{
                notification.status === 'nuova'
                  ? 'Nuova'
                  : notification.status === 'warning'
                  ? 'Attenzione'
                  : notification.status === 'success'
                  ? 'Completata'
                  : 'Info'
              }}
            </span>
          </template>
        </ListItem>
      </MainList>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background: #f7f8fc;
}

.main-content {
  margin-top: 60px;
  margin-left: 10pt;
  padding: 24px;
  padding-bottom: 50px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 1.9rem;
  color: #1e1548;
  font-weight: 700;
}

.page-header p {
  margin-top: 6px;
  color: #666;
  font-size: 0.95rem;
}

.notification-subtitle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.notification-message {
  color: #555;
  font-size: 0.92rem;
}

.notification-date {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #888;
  font-size: 0.82rem;
}

.notification-date i {
  color: #455dc7;
}


.notification-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}


.notification-badge.nuova {
  background: #dbeafe;
  color: #1d4ed8;
}


.notification-badge.warning {
  background: #fef3c7;
  color: #92400e;
}


.notification-badge.success {
  background: #dcfce7;
  color: #166534;
}


.notification-badge.info {
  background: #ede9fe;
  color: #6d28d9;
}


.notification-unread {
  background: #f5f0d7;
  box-shadow: 0 6px 18px rgba(91,71,197,0.12);
}

.notification-read {
  background: #ffffff;
  opacity: 0.75;
}

</style>