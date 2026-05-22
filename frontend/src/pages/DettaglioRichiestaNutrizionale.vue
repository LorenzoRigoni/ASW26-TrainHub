<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'

const userLogged = ref({ 
  name: localStorage.getItem('user_name'), 
  surname: localStorage.getItem('user_surname'), 
  role: localStorage.getItem('user_role') 
})
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role="userLogged.role" @close="sidebarOpen = false" />
        
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <div class="info-header">
                <h1>Dettaglio Richiesta Nutrizionale</h1>
            </div>
        </main>
     </div>
</template>

<style scoped>

.main-content {
  margin-top: 60px;
  margin-left: 10pt;
  padding: 20px;
  padding-bottom: 50px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f9;
}


@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30,21,72,0.25);
  transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-primary:hover {
  background-color: #2d2070;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30,21,72,0.35);
}

h1 {
  font-size: 24pt; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}


.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 15px;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 5px 0 5px;
}

</style>