<script setup>
import { ref } from 'vue'

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