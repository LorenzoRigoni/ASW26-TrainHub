//Componente pensato per essere riutilizzato in tutte le pagine di tipo ListaX
<script setup>
defineProps({
  title: String,
  subtitle: String,
  status: String,
  statusClass: String,
  icon: String,
  iconClass: String
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="list-item" @click="emit('click')">
    
    <!-- ICONA/AVATAR UTENTE -->
     <div class="item-left">
      <slot name="left">
        <div v-if="icon" class="item-icon" :class="iconClass">
          <i :class="icon"></i>
        </div>
    </slot>
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
        <span class="status-badge" :class="statusClass">{{ status }}</span>
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
  background: #dee3e1;
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

/**
 * TODO: rimuovere con refactor
 */
/*Stati clienti --> fare refactor*/
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

/*Stati programmi --> Fare refactor */
.status-badge.completato {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.in-corso {
  background: #fef9c3;
  color: #854d0e;
}

/*Colori generici per status */
.status-green {
  background: #32e287;
  color: #031913;
}

.status-yellow {
  background: #f6eb6e;
  color: #000000;
}

.status-orange {
  background: #efa435;
  color: #000000;
}

.status-red {
  background: #e97979;
  color: #000000;
}

/*Colori generici per icons */
.icon-green {
  background: #32e287;
  color: #000000;
}

.icon-yellow {
  background: #f6eb6e;
  color: #000000;
}

.icon-orange{
  background: #efa435;
  color: #000000;
}

.icon-red {
  background: #e97979;
  color: #000000;
}
</style>