<script setup>
import { useNotifications } from '../utils/useNotifications'
import { useRouter } from 'vue-router'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
const { unreadCount } = useNotifications()

const goToNotifications = () => {
  unreadCount.value = 0
  router.push('/home/notifiche')
}
</script>

<template>
  <nav class="navbar">
    
    <button class="burger-btn" @click="emit('toggle-sidebar')" aria-label="Apri/chiudi menu">
      <i class="fa fa-bars"></i>
    </button>

    
    <div class="navbar-logo">
      <img src="../assets/TrainHub - Logo.png" alt="TrainHub Logo" class="logo-icon" />
    </div>

    <div class="navbar-actions">
      <!-- NOTIFICATION BELL -->
      <button class="notification-btn" @click="goToNotifications" aria-label="Notifiche">
        <i class="fa fa-bell"></i>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>

      <!-- PROFILE BUTTON -->
      <button class="profile-button" aria-label="Profilo utente">
        <img src="../assets/UserIcon.png" alt="User profile" class="user-icon" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 0 1rem;
}

.burger-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #1e1548;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.burger-btn:hover {
  background-color: #f0f0f0;
}

.navbar-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-icon {
  height: 44px;
  width: auto;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #1e1548;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.notification-btn:hover {
  background-color: #f0f0f0;
}

.notification-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #dc2626;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 2px solid white;
}

.profile-button {
  background: none;
  border: 2px solid #1e1548;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.profile-button:hover {
  background-color: #f0f0f0;
  border-color: #4a5eff;
}

.user-icon {
  height: 30px;
  width: auto;
}

@media (max-width: 768px) {
  .logo-icon {
    height: 36px;
  }
}
</style>