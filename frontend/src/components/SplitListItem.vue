<script setup>
import ExerciseListItem from './ExerciseListItem.vue'

defineProps({
  split: { type: Object, required: true }
})
</script>

<template>
  <div class="split">

    <div class="split-header">
      <h3>{{ split.name }}</h3>
      <span class="count">{{ split.exercises.length }} esercizi</span>
    </div>

    <ul class="exercise-list">
      <ExerciseListItem
        v-for="(ex, i) in split.exercises"
        :key="i"
        v-bind="ex"
      />
    </ul>
  </div>
</template>

<style scoped>
.split {
  background: #f9fafb;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.split-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.count {
  font-size: 0.8rem;
  color: #6b7280;
}

.exercise-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>