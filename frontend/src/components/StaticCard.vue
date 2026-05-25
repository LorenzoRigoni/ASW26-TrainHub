/*Componente riutilizzato in tutte le Dashboard home. E' una card statica che contiene un dato. */
<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon:  { type: String, required: true },  // es. 'fa fa-users'
  color: { type: String, default: '#4a90d9' },
  bg:    { type: String, default: 'rgba(74,144,217,0.12)' }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="stat-card" :style="{ '--card-accent': color }" @click="emit('click')">
    <div class="stat-info">
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
    </div>
    <div class="stat-icon-wrap" :style="{ background: bg }">
      <i :class="icon" :style="{ color }"></i>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #ebebeb;
  border-top: 3px solid var(--card-accent);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}

.stat-label {
  margin: 0 0 0.4rem;
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: #1e1548;
  line-height: 1;
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
</style>