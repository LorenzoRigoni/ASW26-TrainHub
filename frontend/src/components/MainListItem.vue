//Componente pensato per essere riutilizzato in tutte le pagine di tipo ListaX
<script setup>
defineProps({
  title: String,
  subtitle: String,
  status: String,
  icon: String
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="list-item" @click="emit('click')">
    
    <!-- ICONA/AVATAR UTENTE -->
    <div class="item-icon">
      <i :class="icon"></i>
    </div>

    <!-- CONTENUTO -->
    <div class="item-content">
      <div class="item-title">{{ title }}</div>
      <div class="item-subtitle">
        <slot name="subtitle">
          {{ subtitle }}
        </slot>
      </div>
    </div>

    <!-- STATUS -->
    <div class="item-status">
      <slot name="status">
        <span class="status-badge" :class ="status">{{ status }}</span>
      </slot>
    </div>

  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  transition: 0.2s;
  cursor: pointer;
  border-top: 3px solid #1e1548;
}

.list-item:hover {
  background: #eaeaea;
}

.item-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: #d6f5ea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}


.item-content {
  flex: 1;
}

.item-title {
  font-weight: 600;
}

.item-subtitle {
  font-size: 13px;
  color: #666;
}


.item-status {
  margin-left: 10px;
}

.status-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

/*Stati clienti*/
.status-badge.attivo {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inattivo {
  background: #fef9c3;
  color: #854d0e;
}

.status-badge.perso {
  background: #fee2e2;
  color: #991b1b;
}

/*Stati programmi */
.status-badge.completato {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.in-corso {
  background: #fef9c3;
  color: #854d0e;
}
</style>