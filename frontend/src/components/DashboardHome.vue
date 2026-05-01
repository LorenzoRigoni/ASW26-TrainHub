<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      nome: 'Alessandra',
      cognome: 'Versari',
      ruolo: 'Personal Trainer' // 'Personal Trainer' | 'Cliente' | 'Nutrizionista' 
    })
  },
  stats: {
    type: Object,
    default: () => ({
      clientiAttivi: 2,
      schedeCreate: 1,
      richiesteNutriz: 0,
      inAttesa: 0
    })
  },
  clienti: {
    type: Array,
    default: () => [
      { id: 1, nome: 'Lorenzo', cognome: 'Rigoni', email: 'rigoni.lorenzo.21@gmail.com', stato: 'Attivo' },
      { id: 2, nome: 'Alessandro', cognome: 'Fabbri', email: 'alessandro.fabbri@gmail.com', stato: 'Attivo' }
    ]
  },
  schede: {
    type: Array,
    default: () => [
      { id: 1, titolo: 'Lorenzo Rigoni - Piano 1', categoria: 'Ipertrofia', stato: 'Assegnata' }
    ]
  }
})

const emit = defineEmits(['nuova-scheda', 'vedi-clienti', 'vedi-schede', 'apri-cliente', 'apri-scheda'])


const getInitials = (nome, cognome) => {
  return `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase()
}


const avatarColors = [
  '#2d6a4f', '#1b4332', '#40916c', '#52b788',
  '#1e6091', '#1a759f', '#168aad', '#76c893'
]

const getAvatarColor = (nome) => {
  const idx = nome.charCodeAt(0) % avatarColors.length
  return avatarColors[idx]
}


const greeting = computed(() => {
  const ora = new Date().getHours()
  if (ora < 12) return 'Buongiorno'
  if (ora < 18) return 'Buon pomeriggio'
  return 'Buonasera'
})



const statCards = computed(() => [
  {
    label: 'Clienti Attivi',
    value: props.stats.clientiAttivi,
    icon: 'fa fa-users',
    color: '#4a90d9',
    bg: 'rgba(74, 144, 217, 0.12)'
  },
  {
    label: 'Schede Create',
    value: props.stats.schedeCreate,
    icon: 'fa fa-dumbbell',
    color: '#7c6af7',
    bg: 'rgba(124, 106, 247, 0.12)'
  },
  {
    label: 'Richieste Nutriz.',
    value: props.stats.richiesteNutriz,
    icon: 'fa fa-apple',
    color: '#e05c9a',
    bg: 'rgba(224, 92, 154, 0.12)'
  },
  {
    label: 'In Attesa',
    value: props.stats.inAttesa,
    icon: 'fa fa-clock-o',
    color: '#f5a623',
    bg: 'rgba(245, 166, 35, 0.12)'
  }
])
</script>

<template>
  <div class="dashboard-home">

    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="welcome-title">
          {{ greeting }}, {{ user.nome }}
        </h1>
        <p class="welcome-sub">Ecco il riepilogo della tua attività</p>
      </div>
      <button class="btn-nuova-scheda" @click="emit('nuova-scheda')">
        <i class="fa fa-plus"></i>
        <span>Nuova Scheda</span>
      </button>
    </div>


    <div class="stats-grid">
      <div
        v-for="(card, idx) in statCards"
        :key="idx"
        class="stat-card"
        :style="{ '--card-accent': card.color }"
      >
        <div class="stat-info">
          <p class="stat-label">{{ card.label }}</p>
          <p class="stat-value">{{ card.value }}</p>
        </div>
        <div class="stat-icon-wrap" :style="{ background: card.bg }">
          <i :class="card.icon" :style="{ color: card.color }"></i>
        </div>
      </div>
    </div>

    <div class="panels-grid">
        
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">I tuoi Clienti</h2>
          <button class="panel-link" @click="emit('vedi-clienti')">
            Vedi tutti <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <div class="panel-body">
          <div v-if="clienti.length === 0" class="panel-empty">
            <i class="fa fa-users"></i>
            <p>Nessun cliente ancora</p>
          </div>
          <ul v-else class="client-list">
            <li
              v-for="cliente in clienti"
              :key="cliente.id"
              class="client-item"
              @click="emit('apri-cliente', cliente.id)"
            >
              <div
                class="client-avatar"
                :style="{ background: getAvatarColor(cliente.nome) }"
              >
                {{ getInitials(cliente.nome, cliente.cognome) }}
              </div>
              <div class="client-info">
                <span class="client-name">{{ cliente.nome }} {{ cliente.cognome }}</span>
                <span class="client-email">{{ cliente.email }}</span>
              </div>
              <span
                class="badge"
                :class="cliente.stato === 'Attivo' ? 'badge-attivo' : 'badge-inattivo'"
              >
                {{ cliente.stato }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Ultime Schede</h2>
          <button class="panel-link" @click="emit('vedi-schede')">
            Vedi tutte <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <div class="panel-body">
          <div v-if="schede.length === 0" class="panel-empty">
            <i class="fa fa-file-text-o"></i>
            <p>Nessuna scheda ancora</p>
          </div>
          <ul v-else class="schede-list">
            <li
              v-for="scheda in schede"
              :key="scheda.id"
              class="scheda-item"
              @click="emit('apri-scheda', scheda.id)"
            >
              <div class="scheda-icon-wrap">
                <i class="fa fa-dumbbell scheda-icon"></i>
              </div>
              <div class="scheda-info">
                <span class="scheda-titolo">{{ scheda.titolo }}</span>
                <span class="scheda-meta">{{ scheda.categoria }} · {{ scheda.stato }}</span>
              </div>
              <i class="fa fa-chevron-right scheda-arrow"></i>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-home {
  padding: 2rem 2.5rem 5rem 2.5rem;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}


.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e1548;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.wave-emoji {
  display: inline-block;
  margin-left: 0.3rem;
  animation: wave 2s ease-in-out infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(15deg); }
  40%       { transform: rotate(-10deg); }
  60%       { transform: rotate(12deg); }
  80%       { transform: rotate(-5deg); }
}

.welcome-sub {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.btn-nuova-scheda {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30, 21, 72, 0.25);
}

.btn-nuova-scheda:hover {
  background-color: #2d2070;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30, 21, 72, 0.35);
}

.btn-nuova-scheda:active {
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #ebebeb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-top: 3px solid var(--card-accent);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.stat-label {
  margin: 0 0 0.4rem 0;
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


.panels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.panel {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
  transition: color 0.2s ease;
  padding: 0;
}

.panel-link:hover {
  color: #1e1548;
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

.panel-empty i {
  font-size: 2rem;
}

.client-list,
.schede-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.client-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f7f7f7;
}

.client-item:last-child {
  border-bottom: none;
}

.client-item:hover {
  background-color: #f8f9ff;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.client-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.client-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e1548;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.client-email {
  font-size: 0.78rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  flex-shrink: 0;
}

.badge-attivo {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-inattivo {
  background-color: #fee2e2;
  color: #991b1b;
}

.scheda-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f7f7f7;
}

.scheda-item:last-child {
  border-bottom: none;
}

.scheda-item:hover {
  background-color: #f8f9ff;
}

.scheda-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(30, 21, 72, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scheda-icon {
  color: #1e1548;
  font-size: 1rem;
}

.scheda-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.scheda-titolo {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e1548;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scheda-meta {
  font-size: 0.78rem;
  color: #9ca3af;
}

.scheda-arrow {
  color: #d1d5db;
  font-size: 0.75rem;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-home {
    padding: 1.25rem 1rem 5rem 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .panels-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 1.35rem;
  }

  .stat-value {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .btn-nuova-scheda span {
    display: none;
  }

  .btn-nuova-scheda {
    padding: 0.65rem 1rem;
  }
}
</style>