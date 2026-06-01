<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
</script>

<template>
  <button class="back-btn" @click="goBack">
    <i class="fa fa-arrow-left"></i>
  </button>
</template>

<style scoped>
.back-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: .2s ease;
}

.back-btn:active {
  transform: scale(.96);
}

@media (min-width: 768px) {
  .back-btn:hover {
    transform: translateX(-2px);
    background: #f8fafc;
  }
}
</style>