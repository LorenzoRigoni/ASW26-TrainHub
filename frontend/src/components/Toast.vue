<script setup>
import { toastState } from '../utils/toast'
</script>

<template>
  <Transition name="slide-toast">
    <div 
      v-if="toastState.show" 
      :class="['toast-popup', `toast-${toastState.type}`]"
    >
      <span class="toast-message">{{ toastState.message }}</span>
      <button class="toast-close" @click="toastState.show = false">&times;</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-popup {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 300px;
  max-width: 450px;
  font-family: sans-serif;
}

.toast-success {
  background-color: #e6f7ed;
  color: #1f9254;
  border: 1px solid #a3e2bd;
}

.toast-error {
  background-color: #fdebee;
  color: #de354c;
  border: 1px solid #fbc4cb;
}

.toast-message {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.slide-toast-enter-active,
.slide-toast-leave-active {
  transition: all 0.4s ease;
}

.slide-toast-enter-from {
  transform: translateY(40px);
  opacity: 0;
}

.slide-toast-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>