<script setup>
import { ref } from 'vue'
import SideMenuItem from './SideMenuItem.vue'
import { ROLES } from '../constants/roles'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    required: true
  }
})
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['close'])
const isActive = (path) => route.path === path
const searchQuery = ref('')

const menuItems = [
  { id: 'home', icon: 'fa fa-home', label: 'Home', route: '/home', roles: [ROLES.PERSONAL_TRAINER,ROLES.CLIENTE,ROLES.NUTRIZIONISTA] },
  { id: 'clients', icon: 'fa fa-users', label: 'Clienti', route: '/clienti', roles: [ROLES.PERSONAL_TRAINER,ROLES.NUTRIZIONISTA] },
  { id: 'schede', icon: 'fa fa-list', label: 'Schede', route: '/programmi', roles: [ROLES.PERSONAL_TRAINER,ROLES.CLIENTE] },
  { id: 'diario', icon: 'fa fa-book', label: 'Diario', route: '/clienti/dettaglio-cliente', roles: [ROLES.CLIENTE] },
  { id: 'esercizi', icon: 'fa fa-tasks', label: 'Elenco Esercizi', route: '/esercizi', roles: [ROLES.PERSONAL_TRAINER] },
  { id: 'richieste-nutriz', icon: 'fa fa-apple', label: 'Richieste Nutriz.', route: '/richieste-nutrizione', roles: [ROLES.PERSONAL_TRAINER,ROLES.NUTRIZIONISTA] },
  { id: 'richieste-pt', icon: 'fa fa-heartbeat', label: 'In scadenza', route: '/scadenze', roles: [ROLES.PERSONAL_TRAINER] },
  { id: 'piani-nutriz', icon: 'fa fa-leaf', label: 'Piani Alimentari', route: '/piani-alimentari', roles: [ROLES.CLIENTE,ROLES.NUTRIZIONISTA] },
]

//TODO: modificare routes
const bottomItems = [
  { id: 'notifications', icon: 'fa fa-bell',   label: 'Notifiche', route: '/home' },
  { id: 'settings',      icon: 'fa fa-cog',    label: 'Impostazioni', route: '/home' },
  { id: 'logout',        icon: 'fa fa-sign-out', label: 'Esci' , route: '/home'},
]


const filteredItems = () => {
  return menuItems
    .filter(item => item.roles.includes(props.role))
    .filter(item =>
      item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
}

</script>

<template>
  <div v-if="isOpen" class="sidebar-overlay" @click="emit('close')"/>

  <aside class="side-menu" :class="{ open: isOpen }">
    <button class="close-btn" @click="emit('close')" aria-label="Chiudi menu">
      <i class="fa fa-times"></i>
    </button>

    
    <div class="search-container">
      <div class="search-wrapper">
        <i class="fa fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cerca..."
          class="search-input"
        />
      </div>
    </div>

    
    <nav class="menu-nav">
      <ul class="menu-list">
         <SideMenuItem
            v-for="item in filteredItems()"
            :key="item.id"
            :icon="item.icon"
            :label="item.label"
            :to="item.route"
            :active="isActive(item.route)"
          />
      </ul>
    </nav>

    
    <div class="menu-bottom">
      <ul class="menu-list">
        <SideMenuItem
          v-for="item in bottomItems"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          :to="item.route"
          :active="isActive(item.route)"
        />
      </ul>
    </div>

  </aside>
</template>

<style scoped>
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 150;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }
}


.side-menu {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e1548 0%, #0f0a2e 100%);
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 60px; 
  transition: transform 0.3s ease;
  z-index: 160;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/*Sempre visibile in versione desktop*/
@media (min-width: 769px) {
  .side-menu {
    transform: translateX(0);
  }

  .side-menu:not(.open) {
    transform: translateX(-100%);
  }
}


@media (max-width: 768px) {
  .side-menu {
    transform: translateX(-100%);
  }

  .side-menu.open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
  }
}


.close-btn {
  position: absolute;
  top: 70px;
  right: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}


.search-container {
  padding: 0.75rem 1rem;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  font-size: 0.85rem;
}

.search-input {
  width: 100%;
  border: none;
  border-radius: 20px;
  background-color: white;
  padding: 6px 34px 6px 12px;
  outline: none;
  font-size: 0.875rem;
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  box-shadow: 0 0 0 3px #4a5eff59;
}

.search-input::placeholder {
  color: #aaa;
}


.menu-nav {
  flex: 1;
  padding: 0.25rem 0.5rem;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}


.menu-bottom {
  padding: 0.25rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.side-menu::-webkit-scrollbar { 
  width: 4px; 
}

.side-menu::-webkit-scrollbar-track { 
  background: transparent; 
}

.side-menu::-webkit-scrollbar-thumb { 
  background: rgba(255,255,255,0.15); 
  border-radius: 2px; 
}
</style>