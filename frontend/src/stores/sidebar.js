import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpen: window.innerWidth >= 768
  }),

  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    close() {
      this.isOpen = false
    },
    open() {
      this.isOpen = true
    },
    initFromViewport() {
      this.isOpen = window.innerWidth >= 768
    }
  }
})