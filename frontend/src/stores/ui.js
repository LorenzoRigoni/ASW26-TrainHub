import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: window.innerWidth >= 769
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    openSidebar() {
      this.sidebarOpen = true
    },

    closeSidebar() {
      this.sidebarOpen = false
    },

    setSidebarByWidth() {
      this.sidebarOpen = window.innerWidth >= 769
    }
  }
})