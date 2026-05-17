<script setup>
import SplitItem from './SplitListItem.vue'

defineProps({
  program: { type: Object, required: true }
})
</script>

<template>
  <div class="program-container">
    <SplitItem
      v-for="(split, i) in program.splits"
      :key="split._id || i"
      :split="split"
    />
  </div>
</template>

<style scoped>

.program {
  padding: 2rem 2.5rem 5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.program-container {
  padding: 1rem 0; 
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.program-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>