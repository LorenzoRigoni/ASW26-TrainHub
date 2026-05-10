<script setup>
import { ref } from 'vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'


const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userLogged = ref({
  name: 'Alessandra',
  surname: 'Versari',
  role: 'nutritionist'
})
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role = "userLogged.role" @close="sidebarOpen = false" />
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
        </main>
    </div>
</template>

<style scoped>

</style>