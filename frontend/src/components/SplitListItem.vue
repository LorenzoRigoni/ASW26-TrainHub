<script setup>
import ExerciseListItem from './ExerciseListItem.vue'

defineProps({
  name: { type: String, required: true },
  image: { type: String, default: null },
  technique: { type: String, default: '' },
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  rest: { type: Number, default: 0 },
  movementPattern: { type: String, default: '' },
  notes: { type: String, default: '' }
})
</script>

<template>
  <li class="exercise-item">
    <div class="main-info">
      <div class="image-box">
        <img v-if="image" :src="`http://localhost:5000${image}`" class="ex-thumb" />
        <div v-else class="ex-placeholder"><i class="fa fa-dumbbell"></i></div>
      </div>

      <div class="details">
        <span class="ex-name">{{ name }}</span>
        <div class="ex-meta">
          <span class="tag">{{ movementPattern }}</span>
          <span v-if="technique" class="technique">| {{ technique }}</span>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-group">
        <span class="label">Serie</span>
        <span class="value">{{ sets }}</span>
      </div>
      <div class="stat-group">
        <span class="label">Reps</span>
        <span class="value">{{ reps }}</span>
      </div>
      <div class="stat-group">
        <span class="label">Rest</span>
        <span class="value">{{ rest }}''</span>
      </div>
    </div>

    <p v-if="notes" class="ex-notes">
      <i class="fa fa-sticky-note-o"></i> {{ notes }}
    </p>
  </li>
</template>

<style scoped>
  .exercise-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid #edf2f7;
    gap: 1rem;
  }

  .main-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 200px;
  }

  .image-box {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  .ex-thumb {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 6px;
    background: white;
    border: 1px solid #eee;
  }

  .ex-placeholder {
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }

  .ex-name {
    display: block;
    font-weight: 600;
    color: #1a202c;
    font-size: 1rem;
  }

  .ex-meta {
    font-size: 0.8rem;
    color: #718096;
    margin-top: 2px;
  }

  .tag {
    color: #3182ce;
    font-weight: 600;
  }

  .technique {
    color: #e53e3e;
    font-style: italic;
    margin-left: 5px;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
  }

  .stat-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #a0aec0;
    letter-spacing: 0.05em;
  }

  .value {
    font-weight: 700;
    color: #2d3748;
  }

  .ex-notes {
    width: 100%;
    font-size: 0.85rem;
    color: #4a5568;
    background: #fffaf0;
    padding: 0.5rem;
    border-radius: 4px;
    border-left: 3px solid #f6ad55;
    margin-top: 0.5rem;
  }
</style>