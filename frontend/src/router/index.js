import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Login.vue'
import HomePage from '../pages/Home.vue'
import RegistrazionePage from '../pages/Registrazione.vue'

const routes = [
  { path: '/',        component: LoginPage},
  { path: '/home', component: HomePage },
  { path: '/registrazione', component: RegistrazionePage }
]

export default createRouter({
  history: createWebHistory(),
  routes
})