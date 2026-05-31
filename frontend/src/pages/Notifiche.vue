<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from '../utils/toast.js'
import { useAuthStore } from '../stores/auth.js'
import { getErrorMessage } from '../utils/utils.js'
import { API_URL } from '../utils/config.js'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import MainList from '../components/MainList.vue'
import ListItem from '../components/MainListItem.vue'

const auth = useAuthStore()
const sidebarOpen = ref(true)
const notifications = ref([])
const loading = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const getNotificationDetails = (type) => {
  switch (type) {
    case 'program_created':
      return { icon: 'fa fa-file-text-o', status: 'nuova' }
    case 'workout_created':
      return { icon: 'fa fa-check-circle', status: 'success' }
    case 'package_expiring':
      return { icon: 'fa fa-exclamation-triangle', status: 'warning' }
    case 'program_completed':
      return { icon: 'fa fa-check-circle', status: 'success' }
    case 'nutrition_plan':
      return { icon: 'fa fa-cutlery', status: 'info' }
    default:
      return { icon: 'fa fa-bell', status: 'info' }
  }
}

const fetchNotifications = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${API_URL}/api/notifications`, auth.apiConfig)
    
    notifications.value = (response.data.data || []).map(n => {
      const details = getNotificationDetails(n.type)
      return {
        id: n._id,
        title: n.title,
        message: n.message,
        date: new Date(n.createdAt).toLocaleString(),
        status: details.status,
        icon: details.icon,
        isRead: n.isRead
      }
    })
  } catch (error) {
    showToast("Errore nel caricamento dei dati: " + getErrorMessage(error), "error")
  } finally {
    loading.value = false
  }
}

onMounted(fetchNotifications)

const openNotification = async (notification) => {
  if (notification.isRead) return

  try {
    await axios.patch(`${API_URL}/api/notifications/${notification.id}/read`, {}, auth.apiConfig)
    notification.isRead = true
  } catch (error) {
    showToast("Errore nel segnare la notifica come letta: " + getErrorMessage(error), "error")
  }
}

const hideNotification = async (notification) => {
  try {
    await axios.patch(`${API_URL}/api/notifications/${notification.id}/hide`, {}, auth.apiConfig)
    
    notifications.value = notifications.value.filter(n => n.id !== notification.id)
  } catch (error) {
    showToast("Errore nel nascondere la notifica: " + getErrorMessage(error), "error")
  }
}
</script>

<template>
  <div id="app">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <SideMenu :isOpen="sidebarOpen" :role="auth.user.role"  @close="sidebarOpen = false"/>
    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="page-header">
        <div class="header-text">
          <h1>Notifiche</h1>
          <p> Aggiornamenti recenti della piattaforma</p>
        </div>
      </div>

      <div v-if="loading" class="loader">Caricamento...</div>

      <MainList v-else-if="notifications.length > 0">
        <ListItem
          v-for="(notification, index) in notifications"
          :key="notification.id"
          :title="notification.title"
          :status="notification.status"
          :icon="notification.icon"
          :class="{ 'notification-read': notification.isRead, 'notification-unread': !notification.isRead }"
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
            <div class="notification-actions">
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
              <button class="hide-btn" @click.stop="hideNotification(notification)" title="Nascondi notifica">
                <i class="fa fa-times"></i>
              </button>
            </div>
          </template>
        </ListItem>
      </MainList>

      <div v-else class="empty-state">
        <p>Non hai ancora nessuna notifica.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
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

.notification-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hide-btn {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 0.2s ease, background-color 0.2s ease;
  width: 30px;
  height: 30px;
}

.hide-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
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