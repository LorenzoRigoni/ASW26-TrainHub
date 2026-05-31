<script setup>
import { ref } from 'vue'
import Toast from './components/Toast.vue'
import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from './stores/ui'

const UIStore = useUIStore()

const handleResize = () => {
  UIStore.setSidebarByWidth()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <RouterView />

  <Toast />
</template>

<style>
</style>