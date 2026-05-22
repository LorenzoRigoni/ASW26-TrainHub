<script setup>
defineProps({
  title:     { type: String,  required: true },
  linkLabel: { type: String,  default: '' },   
  isEmpty:   { type: Boolean, default: false },
  emptyIcon: { type: String,  default: 'fa fa-list' },
  emptyText: { type: String,  default: 'Nessun elemento' },
  badge:     { type: String,  default: '' },
})

const emit = defineEmits(['link-click'])
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ title }}</h2>

      <button v-if="linkLabel" class="panel-link" @click="emit('link-click')">
        {{ linkLabel }} <i class="fa fa-chevron-right"></i>
      </button>

      <span v-if="badge" class="panel-badge">{{ badge }}</span>
    </div>

    <div class="panel-body">
      <!-- Stato vuoto -->
      <div v-if="isEmpty" class="panel-empty">
        <i :class="emptyIcon"></i>
        <p>{{ emptyText }}</p>
      </div>

      <!-- Lista passata come slot -->
      <ul v-else class="item-list">
        <slot />
      </ul>
    </div>

  </div>
</template>

<style scoped>
.panel {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #ebebeb;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}
.panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e1548;
}
.panel-link {
  background: none;
  border: none;
  color: #2d9e7f;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0;
  transition: color 0.2s;
}
.panel-link:hover { color: #1e1548; }

.panel-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  background-color: #fee2e2;
  color: #991b1b;
}
.panel-body {
  padding: 0.5rem 0;
  min-height: 160px;
}
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 160px;
  color: #c0c4cc;
  font-size: 0.9rem;
}
.panel-empty i { font-size: 2rem; }
.item-list { list-style: none; margin: 0; padding: 0; }
</style>