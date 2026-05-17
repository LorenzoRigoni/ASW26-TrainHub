import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Login.vue'
import HomePage from '../pages/Home.vue'
import ScadenzePage from '../pages/Scadenze.vue'
import ClientiPage from '../pages/ListaClienti.vue'
import ProgrammiPage from '../pages/ListaProgrammi.vue'
import DiarioPage from '../pages/DiarioCliente.vue' //Quello che vede pt quando va in dettaglio cliente (ma non editabile)
import DettaglioProgrammaPage from '../pages/DettaglioProgramma.vue'
import ListaProgrammi from '../pages/ListaProgrammi.vue'
import EserciziPage from '../pages/ListaEsercizi.vue'
import ListaRichiesteNutrizionePage from '../pages/ListaRichiesteNutrizione.vue'
import ListaPianiAlimentariPage from '../pages/ListaPianiAlimentari.vue'
import NotifichePage from '../pages/Notifiche.vue'
import ImpostazioniPage from '../pages/Impostazioni.vue'
import BozzaProgrammaPage from '../pages/BozzaProgramma.vue'
import ListaBozzePage from '../pages/ListaBozze.vue'


const routes = [
  { path: '/',        component: LoginPage},
  { path: '/home', component: HomePage },
  { path: '/home/notifiche', component: NotifichePage },
  { path: '/home/impostazioni', component: ImpostazioniPage },

  { path: '/scadenze', component: ScadenzePage },

  { path: '/clienti', component: ClientiPage },
  { path: '/clienti/dettaglio-cliente', component: DiarioPage },

  { path: '/programmi', component: ListaProgrammi },
  { path: '/programmi/dettaglio-programma/:id', component: DettaglioProgrammaPage },

  { path: '/bozze', component: ListaBozzePage },
  { path: '/bozze/dettaglio-bozza/:id', component: BozzaProgrammaPage },

  { path: '/esercizi', component: EserciziPage },
  { path: '/richieste-nutrizione', component: ListaRichiesteNutrizionePage },
  { path: '/piani-alimentari', component: ListaPianiAlimentariPage }
  

]

export default createRouter({
  history: createWebHistory(),
  routes
})