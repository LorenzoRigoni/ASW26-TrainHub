<script setup>
defineProps({
  name:        { type: String, required: true },
  sets:        { type: Number, required: true },
  reps:        { type: Number, required: true },
  rest:        { type: Number, required: true },
  technique:   { type: String, default: '' },
  image:       { type: String, default: '' } // URL immagine (le facciamo caricare quando il pt aggiunge un esercizio alla sua lista). Di default lasciamo icona o mettiamo immagine generica? 
})

const emit = defineEmits(['click', 'edit', 'delete'])
</script>

<template>
  <li class="list-item" @click="emit('click')">

    <!-- LEFT: icona -->
    <div class="list-item-left">
      <div name="left">
        <img
        v-if="image"
        :src="image"
        class="exercise-img"
        />

        <!-- Mostriamo l'icona solo se il pt non ha caricato un'immagine per l'esercizio -->
        <div v-else class="icon">
          <i class="fa fa-check-circle-o"></i>
        </div>
      </div>
    </div>

    <!-- CENTER -->
    <div class="item-info">
      <span class="item-title">{{ name }}</span>

      <div class="item-sub-row">
        <span class="badge">{{ sets }} set × {{ reps }} rep</span>
        <span class="badge"><i class="fa fa-clock"></i> rest: {{ rest }}s</span>
      </div>

      <span v-if="technique" class="item-sub">
        {{ technique }}
      </span>
    </div>

    <!-- RIGHT -->
    <div class="list-item-right">
      <div name="right">
        <button class="icon-btn" @click.stop="emit('edit')"><i class="fa fa-pencil"></i></button>
        <button class="icon-btn" @click.stop="emit('delete')"><i class="fa fa-trash"></i></button>
      </div>
    </div>

  </li>
</template>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.list-item:hover {
  background-color: #f8f9ff;
}

.icon {
  width: 36px;
  height: 36px;
  background: #bbcbdb;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 16px;
}


.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e1548;
}

.item-sub-row {
  display: flex;
  gap: 0.4rem;
}

.badge {
  font-size: 0.75rem;
  background: #1e1548;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 999px;
}

.item-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

.list-item-right {
  display: flex;
  gap: 0.4rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.7;
  padding: 4px;
}

.icon-btn:hover {
  opacity: 1;
}

.icon {
  width: 36px;
  height: 36px;
  background: #e6f4f1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 16px;
  color: #0f766e;
}

.icon-btn .fa-pencil {
  color: #1e48a4;
}

.icon-btn .fa-trash {
  color: #ad1616;
}

.exercise-img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 10px;
}
</style>