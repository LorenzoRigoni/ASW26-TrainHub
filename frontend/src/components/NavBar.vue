<script setup>
    import { ref } from 'vue'
    // JavaScript/logica del componente
    // TODO: Inserire apertura/chiusura del menù laterale
</script>

<template>
  <!-- HTML del componente -->
   <nav class="navbar">
    <button class="sideMenù" @click="">
        <i class="fa fa-bars" aria-hidden="true"></i>
    </button>

    <!-- Logo -->
    <div class="navbar-logo">
      <img src="../assets/TrainHub - Logo.png" alt="TrainHub Logo" class="logo-icon" />
    </div>

    <!-- Foto profilo utente -->
    <button class="profile-button">
      <img src="../assets/UserIcon.png" alt="User profile image" class="user-icon" />
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
  height: 5%;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%); 
}

.logo-icon {
  width: auto;
  height: 50px;
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
}

.profile-button:hover {
  background-color: #f0f0f0;
  border-color: #4a5eff;
}

.user-icon {
  color: #1e1548;
  height: 35px;
  width: auto;
}


@media (max-width: 768px) {
  
}
</style>