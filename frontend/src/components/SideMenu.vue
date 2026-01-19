<script setup>
import { ref } from 'vue'
import SideMenuItem from './SideMenuItem.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const activeItem = ref('home')

const menuItems = [
  { id: 'home', icon: 'fa fa-home', label: 'Home' },
  { id: 'profile', icon: 'fa fa-user', label: 'Profilo' },
  { id: 'clients', icon: 'fa fa-users', label: 'Clienti' },
  { id: 'settings', icon: 'fa fa-cog', label: 'Impostazioni' },
  { id: 'notifications', icon: 'fa fa-bell', label: 'Notifiche' }
]

//TODO: implementare logica componente
</script>

<template>
  <aside class="side-menu" :class="{ open: isOpen }">

    <!-- Barra di ricerca -->
    <div class="search-container">
      <div class="search-wrapper">
        <i class="fa fa-search search-icon"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cerca..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <!-- Lista voci menu -->
    <nav class="menu-nav">
      <ul class="menu-list">
        <SideMenuItem
          v-for="item in menuItems"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          :active="activeItem === item.id"
          @click="handleItemClick(item.id)"
        />
      </ul>
    </nav>
  </aside>
</template>

<style scoped>

.side-menu {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e1548 0%, #0f0a2e 100%);
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 70px;
  transition: transform 0.3s ease;
  z-index: 90;
  overflow-y: auto;
  overflow-x: hidden;
  align-items: center;
}

/* Barra di ricerca */
.search-container {
  padding: 2pt;
  background-color: rgba(0, 0, 0, 0.2);
  width: 80%;
  margin-left: 10pt;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  border: none;
  border-radius: 25px;
  background-color: white;
  padding: 5pt;
  outline: none;
  height: 20px;
  transition: box-shadow 0.3s ease;
  
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(74, 94, 255, 0.3);
}

.search-input::placeholder {
  color: #999;
}

/* Menu Navigation */
.menu-nav {
  padding: 0.5rem;
}

.menu-list {
  padding: 0;
  margin: 0;
}

/* Scrollbar personalizzata */
.side-menu::-webkit-scrollbar {
  width: 6px;
}

.side-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.side-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.side-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .side-menu {
    transform: translateX(-100%);
  }
  
  .side-menu.open {
    transform: translateX(0);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style>