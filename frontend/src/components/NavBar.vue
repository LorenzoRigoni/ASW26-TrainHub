<script setup>

const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
  <nav class="navbar">
    
    <button class="burger-btn" @click="emit('toggle-sidebar')" aria-label="Apri/chiudi menu">
      <i class="fa fa-bars"></i>
    </button>

    
    <div class="navbar-logo">
      <img src="../assets/TrainHub - Logo.png" alt="TrainHub Logo" class="logo-icon" />
    </div>

    
    <button class="profile-button" aria-label="Profilo utente">
      <img src="../assets/UserIcon.png" alt="User profile" class="user-icon" />
    </button>
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