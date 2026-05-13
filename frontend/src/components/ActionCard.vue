<script setup>
// Card cliccabile usata nella home del Cliente.
// Lo slot #default permette di mettere contenuto custom nel body della card.
defineProps({
  icon:        { type: String,  required: true },   // es. 'fa fa-book'
  iconColor:   { type: String,  default: '#4a90d9' },
  iconBg:      { type: String,  default: 'rgba(74,144,217,0.12)' },
  highlight:   { type: Boolean, default: false },  
  clickable:   { type: Boolean, default: true },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="action-card"
    :class="{ 'action-card--highlight': highlight, 'action-card--clickable': clickable }"
    @click="clickable && emit('click')"
  >
    <div class="action-card-icon" :style="{ background: iconBg }">
      <i :class="icon" :style="{ color: iconColor }"></i>
    </div>

    <div class="action-card-body">
      <!-- inserire label, valore, sottotitolo dal parent -->
      <slot />
    </div>

    <i v-if="clickable" class="fa fa-chevron-right arrow"></i>
  </div>
</template>

<style scoped>
.action-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #ebebeb;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 15pt;
}
.action-card--clickable {
  cursor: pointer;
}
.action-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}
.action-card--highlight {
  border-top: 3px solid #7c6af7;
}
.action-card-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.action-card-body {
  flex: 1;
  min-width: 0;
}
.arrow {
  color: #d1d5db;
  font-size: 0.75rem;
  flex-shrink: 0;
}
</style>