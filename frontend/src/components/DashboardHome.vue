<script setup>
import { computed } from 'vue'
import StatCard   from './StaticCard.vue'
import ActionCard from './ActionCard.vue'
import PanelList  from './HomePanelList.vue'
import ListItem   from './HomeListItem.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ nome: 'Alessandra', cognome: 'Versari', ruolo: 'personalTrainer' })
  },

  stats: {
    type: Object,
    default: () => ({ clientiAttivi: 2, schedeCreate: 1, richiesteNutriz: 0, inAttesa: 0 })
  },
  clienti: {
    type: Array,
    default: () => [
      { id: 1, nome: 'Lorenzo',    cognome: 'Rigoni', email: 'rigoni.lorenzo.21@gmail.com',    stato: 'Attivo' },
      { id: 2, nome: 'Alessandro', cognome: 'Fabbri', email: 'alessandro.fabbri@gmail.com',    stato: 'Attivo' }
    ]
  },
  schede: {
    type: Array,
    default: () => [
      { id: 1, titolo: 'Lorenzo Rigoni - Piano 1', categoria: 'Ipertrofia', stato: 'Assegnata' }
    ]
  },
  
  misurazionOggi:    { type: Object, default: null },
  ultimoAllenamento: { type: Object, default: () => ({ data: '2025-04-28' }) },
  schedeCliente: {
    type: Array,
    default: () => [{ id: 1, titolo: 'Piano Forza - Settimana 3', categoria: 'Forza', stato: 'Attiva' }]
  },
  pianiNutrizionali: {
    type: Array,
    default: () => [{ id: 1, titolo: 'Piano Alimentare Aprile', fileName: 'piano_aprile.pdf' }]
  },
  
  statsNutrizionista: {
    type: Object,
    default: () => ({ clientiAttivi: 5, richiesteInAttesa: 3, ptCollaboratori: 2 })
  },
  richiesteNutrizionista: {
    type: Array,
    default: () => [
      { id: 1, cliente: 'Marco Bianchi', tipo: 'Nuovo piano alimentare', data: '2025-05-01' },
      { id: 2, cliente: 'Sara Verdi',    tipo: 'Aggiornamento piano',    data: '2025-05-02' }
    ]
  },
  clientiNutrizionista: {
    type: Array,
    default: () => [
      { id: 1, nome: 'Marco', cognome: 'Bianchi', email: 'marco.bianchi@gmail.com', stato: 'Attivo' },
      { id: 2, nome: 'Sara',  cognome: 'Verdi',   email: 'sara.verdi@gmail.com',    stato: 'Attivo' }
    ]
  }
})

const emit = defineEmits([
  'nuova-scheda', 'vedi-clienti', 'vedi-schede', 'apri-cliente', 'apri-scheda',
  'aggiungi-misurazioni', 'inizia-allenamento', 'apri-scheda-cliente', 'apri-piano-nutrizionale',
  'apri-richiesta', 'apri-cliente-nutrizionista'
])


const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buongiorno'
  if (h < 18) return 'Buon pomeriggio'
  return 'Buonasera'
})


const avatarColors = ['#2d6a4f','#1b4332','#40916c','#52b788','#1e6091','#1a759f','#168aad','#76c893']
const getInitials   = (n, c) => `${n[0]}${c[0]}`.toUpperCase()
const getAvatarColor = (n)   => avatarColors[n.charCodeAt(0) % avatarColors.length]

const giorniDaUltimo = computed(() => {
  if (!props.ultimoAllenamento?.data) return null
  return Math.floor((new Date() - new Date(props.ultimoAllenamento.data)) / 86400000)
})

const statCardsPT = computed(() => [
  { label: 'Clienti Attivi',    value: props.stats.clientiAttivi,   icon: 'fa fa-users',   color: '#4a90d9', bg: 'rgba(74,144,217,0.12)' },
  { label: 'Schede Create',     value: props.stats.schedeCreate,    icon: 'fa fa-list',    color: '#7c6af7', bg: 'rgba(124,106,247,0.12)' },
  { label: 'Richieste Nutriz.', value: props.stats.richiesteNutriz, icon: 'fa fa-apple',   color: '#e05c9a', bg: 'rgba(224,92,154,0.12)' },
  { label: 'In Attesa',         value: props.stats.inAttesa,        icon: 'fa fa-clock-o', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' }
])
const statCardsNutri = computed(() => [
  { label: 'Clienti Attivi',   value: props.statsNutrizionista.clientiAttivi,     icon: 'fa fa-users',       color: '#4a90d9', bg: 'rgba(74,144,217,0.12)' },
  { label: 'Richieste',        value: props.statsNutrizionista.richiesteInAttesa, icon: 'fa fa-inbox',       color: '#e05c9a', bg: 'rgba(224,92,154,0.12)' },
  { label: 'PT Collaboratori', value: props.statsNutrizionista.ptCollaboratori,   icon: 'fa fa-handshake-o', color: '#40916c', bg: 'rgba(64,145,108,0.12)' }
])
</script>

<template>
  <div class="dashboard-home">

    <!--HEADER -->
    <div class="dashboard-header">
      <div>
        <h1 class="welcome-title">{{ greeting }}, {{ user.nome }} 👋</h1>
        <p class="welcome-sub">Ecco il riepilogo della tua attività</p>
      </div>
      <button v-if="user.ruolo === 'personalTrainer'" class="btn-primary" @click="emit('nuova-scheda')">
        <i class="fa fa-plus"></i> Nuova Scheda
      </button>
      <button v-else-if="user.ruolo === 'cliente'" class="btn-primary" @click="emit('inizia-allenamento')">
        <i class="fa fa-play"></i> Inizia Allenamento
      </button>
      <button v-else-if="user.ruolo === 'nutrizionista'" class="btn-primary" @click="emit('apri-richiesta', null)">
        <i class="fa fa-file-text-o"></i> Nuova Richiesta
      </button>
    </div>



    <!-- PERSONAL TRAINER -->
    <template v-if="user.ruolo === 'personalTrainer'">

      <div class="stats-grid">
        <StatCard
          v-for="card in statCardsPT" :key="card.label"
          :label="card.label" :value="card.value"
          :icon="card.icon"   :color="card.color" :bg="card.bg"
        />
      </div>

      <div class="panels-grid">
        <PanelList
          title="I tuoi Clienti"
          link-label="Vedi tutti"
          :is-empty="clienti.length === 0"
          empty-icon="fa fa-users"
          empty-text="Nessun cliente ancora"
          @link-click="emit('vedi-clienti')"
        >
          <ListItem
            v-for="c in clienti" :key="c.id"
            :title="`${c.nome} ${c.cognome}`"
            :subtitle="c.email"
            @click="emit('apri-cliente', c.id)"
          >
            <template #left>
              <div class="avatar" :style="{ background: getAvatarColor(c.nome) }">
                {{ getInitials(c.nome, c.cognome) }}
              </div>
            </template>
            <template #right>
              <span class="badge" :class="c.stato === 'Attivo' ? 'badge-attivo' : 'badge-inattivo'">
                {{ c.stato }}
              </span>
            </template>
          </ListItem>
        </PanelList>

        <PanelList
          title="Ultime Schede"
          link-label="Vedi tutte"
          :is-empty="schede.length === 0"
          empty-icon="fa fa-file-text-o"
          empty-text="Nessuna scheda ancora"
          @link-click="emit('vedi-schede')"
        >
          <ListItem
            v-for="s in schede" :key="s.id"
            :title="s.titolo"
            :subtitle="`${s.categoria} · ${s.stato}`"
            @click="emit('apri-scheda', s.id)"
          >
            <template #left>
              <div class="icon-wrap"><i class="fa fa-list" style="color:#1e1548"></i></div>
            </template>
            <template #right>
              <i class="fa fa-chevron-right arrow"></i>
            </template>
          </ListItem>
        </PanelList>
      </div>

    </template>

    <!--  CLIENTE -->
    <template v-else-if="user.ruolo === 'cliente'">
      <div class="action-cards-grid">
        <ActionCard
          icon="fa fa-book" icon-color="#4a90d9" icon-bg="rgba(74,144,217,0.12)"
          @click="emit('aggiungi-misurazioni')"
        >
          <template v-if="misurazionOggi">
            <p class="card-label">Peso di oggi</p>
            <p class="card-value">{{ misurazionOggi.peso }} <span class="unit">kg</span></p>
            <p class="card-sub">Misurazioni già inserite ✓</p>
          </template>
          <template v-else>
            <p class="card-label">Diario di oggi</p>
            <p class="card-cta" style="color:#4a90d9">Aggiungi misurazioni</p>
            <p class="card-sub">Peso, circonferenze...</p>
          </template>
        </ActionCard>

        <ActionCard
          icon="fa fa-play" icon-color="#7c6af7" icon-bg="rgba(124,106,247,0.15)"
          :highlight="true"
          @click="emit('inizia-allenamento')"
        >
          <p class="card-label">Allenamento di oggi</p>
          <p class="card-cta" style="color:#7c6af7">Inizia allenamento</p>
          <p class="card-sub">Scheda attiva disponibile</p>
        </ActionCard>

        <ActionCard
          icon="fa fa-calendar-check-o" icon-color="#f5a623" icon-bg="rgba(245,166,35,0.12)"
          :clickable="false"
        >
          <p class="card-label">Ultimo allenamento</p>
          <template v-if="giorniDaUltimo !== null">
            <p class="card-value">{{ giorniDaUltimo }} <span class="unit">{{ giorniDaUltimo === 1 ? 'giorno fa' : 'giorni fa' }}</span></p>
            <p class="card-sub">{{ ultimoAllenamento.data }}</p>
          </template>
          <template v-else>
            <p class="card-sub">Nessun allenamento registrato</p>
          </template>
        </ActionCard>

      </div>

      <div class="panels-grid">
        <PanelList
          title="Le tue Schede"
          link-label="Vedi tutte"
          :is-empty="schedeCliente.length === 0"
          empty-icon="fa fa-list"
          empty-text="Nessuna scheda assegnata"
          @link-click="emit('vedi-schede')"
        >
          <ListItem
            v-for="s in schedeCliente" :key="s.id"
            :title="s.titolo"
            :subtitle="`${s.categoria} · ${s.stato}`"
            @click="emit('apri-scheda-cliente', s.id)"
          >
            <template #left>
              <div class="icon-wrap"><i class="fa fa-list" style="color:#1e1548"></i></div>
            </template>
            <template #right>
              <i class="fa fa-chevron-right arrow"></i>
            </template>
          </ListItem>
        </PanelList>

        <PanelList
          title="Piani Nutrizionali"
          :is-empty="pianiNutrizionali.length === 0"
          empty-icon="fa fa-file-pdf-o"
          empty-text="Nessun piano disponibile"
        >
          <ListItem
            v-for="p in pianiNutrizionali" :key="p.id"
            :title="p.titolo"
            :subtitle="p.fileName"
            @click="emit('apri-piano-nutrizionale', p.id)"
          >
            <template #left>
              <div class="icon-wrap" style="background:rgba(224,92,154,0.1)">
                <i class="fa fa-file-pdf-o" style="color:#e05c9a"></i>
              </div>
            </template>
            <template #right>
              <i class="fa fa-download arrow" style="color:#9ca3af"></i>
            </template>
          </ListItem>
        </PanelList>
      </div>

    </template>

    <!--  NUTRIZIONISTA -->
    <template v-else-if="user.ruolo === 'nutrizionista'">

      <div class="stats-grid stats-grid--3">
        <StatCard
          v-for="card in statCardsNutri" :key="card.label"
          :label="card.label" :value="card.value"
          :icon="card.icon"   :color="card.color" :bg="card.bg"
        />
      </div>

      <div class="panels-grid">
        <PanelList
          title="Richieste in Attesa"
          :is-empty="richiesteNutrizionista.length === 0"
          empty-icon="fa fa-inbox"
          empty-text="Nessuna richiesta"
          :badge="`${richiesteNutrizionista.length} nuove`"
        >
          <ListItem
            v-for="r in richiesteNutrizionista" :key="r.id"
            :title="r.cliente"
            :subtitle="`${r.tipo} · ${r.data}`"
            @click="emit('apri-richiesta', r.id)"
          >
            <template #left>
              <div class="icon-wrap" style="background:rgba(224,92,154,0.1)">
                <i class="fa fa-file-text-o" style="color:#e05c9a"></i>
              </div>
            </template>
            <template #right>
              <i class="fa fa-chevron-right arrow"></i>
            </template>
          </ListItem>
        </PanelList>

        <PanelList
          title="Clienti Attivi"
          link-label="Vedi tutti"
          :is-empty="clientiNutrizionista.length === 0"
          empty-icon="fa fa-users"
          empty-text="Nessun cliente ancora"
          @link-click="emit('apri-cliente-nutrizionista', null)"
        >
          <ListItem
            v-for="c in clientiNutrizionista" :key="c.id"
            :title="`${c.nome} ${c.cognome}`"
            :subtitle="c.email"
            @click="emit('apri-cliente-nutrizionista', c.id)"
          >
            <template #left>
              <div class="avatar" :style="{ background: getAvatarColor(c.nome) }">
                {{ getInitials(c.nome, c.cognome) }}
              </div>
            </template>
            <template #right>
              <span class="badge badge-attivo">{{ c.stato }}</span>
            </template>
          </ListItem>
        </PanelList>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-home {
  padding: 2rem 2.5rem 5rem;
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
  margin: 0 0 0.25rem; 
}

.welcome-sub   { 
  margin: 0; 
  color: #6b7280; 
  font-size: 0.95rem; 
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e1548;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(30,21,72,0.25);
  transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-primary:hover {
  background-color: #2d2070;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(30,21,72,0.35);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.stats-grid--3   { 
  grid-template-columns: repeat(3, 1fr); 
}

.action-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}
.panels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 0.85rem;
}

.icon-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(30,21,72,0.08);
  display: flex; align-items: center; justify-content: center;
}

.arrow { 
  color: #d1d5db; 
  font-size: 0.75rem; 
}

.badge { 
  font-size: 0.72rem; 
  font-weight: 600; 
  padding: 0.25rem 0.7rem; 
  border-radius: 20px; 
}

.badge-attivo   { 
  background-color: #d1fae5; 
  color: #065f46; 
}

.badge-inattivo { 
  background-color: #fee2e2; 
  color: #991b1b; 
}

.card-label {
  margin: 0 0 0.2rem;
  font-size: 0.78rem; 
  color: #6b7280;
  text-transform: uppercase; 
  font-weight: 500; 
  letter-spacing: 0.03em;
}

.card-value {
  margin: 0 0 0.15rem;
  font-size: 1.75rem; 
  font-weight: 800; 
  color: #1e1548; 
  line-height: 1.1;
}

.card-value .unit { 
  font-size: 0.9rem; 
  font-weight: 500; 
  color: #6b7280; 
}

.card-cta   { 
  margin: 0 0 0.15rem; 
  font-size: 1rem; 
  font-weight: 700; 
}

.card-sub   { 
  margin: 0; 
  font-size: 0.75rem; 
  color: #9ca3af; 
}

@media (max-width: 1024px) {
  .stats-grid, .stats-grid--3  { grid-template-columns: repeat(2, 1fr); }
  .action-cards-grid            { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .dashboard-home    { padding: 1.25rem 1rem 5rem; }
  .stats-grid,
  .stats-grid--3     { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .action-cards-grid { grid-template-columns: 1fr; }
  .panels-grid       { grid-template-columns: 1fr; }
  .welcome-title     { font-size: 1.35rem; }
}

@media (max-width: 480px) {
  .btn-primary span { display: none; }
  .btn-primary      { padding: 0.65rem 1rem; }
}
</style>