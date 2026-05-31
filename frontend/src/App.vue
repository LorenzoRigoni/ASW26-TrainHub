<script setup>
import { ref } from 'vue'
import Toast from './components/Toast.vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { useSidebarStore } from './stores/sidebar'
import { useRoute } from 'vue-router'

const sidebar = useSidebarStore()
const route = useRoute()

//per rimuovre sidebarin mobile subito dopo la navigazione
watch(() => route.path, () => {
  if (window.innerWidth < 768) {
    sidebar.close()
  }
})

</script>

<template>
  <RouterView />

  <Toast />
</template>

<style>
</style>