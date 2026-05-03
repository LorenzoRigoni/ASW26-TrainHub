<script setup>
// Singola riga di lista. 
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
})

const emit = defineEmits(['click'])
</script>

<template>
  <li class="list-item" @click="emit('click')">

    <!-- Lato sinistro: avatar, icona, ecc. -->
    <div class="list-item-left">
      <slot name="left" />
    </div>

    <!-- Info centrali -->
    <div class="item-info">
      <span class="item-title">{{ title }}</span>
      <span v-if="subtitle" class="item-sub">{{ subtitle }}</span>
    </div>

    <!-- Lato destro: badge, freccia, ecc. -->
    <div class="list-item-right">
      <slot name="right" />
    </div>

  </li>
</template>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.15s;
  border-bottom: 1px solid #f7f7f7;
}

.list-item:last-child { 
    border-bottom: none; 
}

.list-item:hover { 
    background-color: #f8f9ff; 
}

.list-item-left  { 
    flex-shrink: 0; 
}

.list-item-right { 
    flex-shrink: 0; 
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e1548;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-sub {
  font-size: 0.78rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>