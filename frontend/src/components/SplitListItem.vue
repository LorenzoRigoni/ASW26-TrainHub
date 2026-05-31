<script setup>
import ExerciseListItem from './ExerciseListItem.vue'
import { API_URL } from '../utils/config.js'

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
        <img v-if="image" :src="`${API_URL}${image}`" class="ex-thumb" />
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
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.exercise-item:active {
  transform: scale(0.99);
}

.main-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.image-box {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.ex-thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: white;
  border: 1px solid #eee;
  padding: 4px;
}

.ex-placeholder {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.2rem;
}

.details {
  min-width: 0;
  flex: 1;
}

.ex-name {
  display: block;
  font-weight: 700;
  color: #1a202c;
  font-size: 1rem;
  line-height: 1.3;
}

.ex-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.82rem;
}

.tag {
  background: rgba(49,130,206,.12);
  color: #3182ce;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.technique {
  color: #e53e3e;
  font-style: italic;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 1px solid #edf2f7;
  border-radius: 12px;
  padding: 10px;
}

.label {
  font-size: 0.68rem;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: .04em;
}

.value {
  margin-top: 4px;
  font-weight: 700;
  font-size: 1rem;
  color: #2d3748;
}

.ex-notes {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4a5568;
  background: #fffaf0;
  padding: 12px;
  border-radius: 12px;
  border-left: 4px solid #f6ad55;
}


@media (min-width: 768px) {

  .exercise-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background: transparent;
    border: none;
    border-bottom: 1px solid #edf2f7;
    border-radius: 0;

    padding: 18px 0;
  }

  .exercise-item:hover {
    transform: translateY(-1px);
  }

  .main-info {
    flex: 1;
    min-width: 280px;
  }

  .stats {
    display: flex;
    gap: 18px;
    margin-left: auto;
  }

  .stat-group {
    background: transparent;
    border: none;
    padding: 0;
    min-width: 60px;
  }

  .ex-notes {
    width: 100%;
    margin-top: 8px;
  }
}

</style>