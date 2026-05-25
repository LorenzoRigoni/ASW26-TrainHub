import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export function useNotifications() {
  const unreadCount = ref(0)
  let interval = null

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', config)
      unreadCount.value = response.data.unreadCount
    } catch (error) {
      console.error('Errore caricamento conteggio notifiche:', error)
    }
  }

  onMounted(() => {
    fetchUnreadCount()
    interval = setInterval(fetchUnreadCount, 30000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return {
    unreadCount,
    fetchUnreadCount
  }
}
