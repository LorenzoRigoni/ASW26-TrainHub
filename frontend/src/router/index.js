import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Login.vue'
import HomePage from '../pages/Home.vue'

const routes = [
  { path: '/',        component: LoginPage},
  { path: '/home', component: HomePage }
]

export default createRouter({
  history: createWebHistory(),
  routes
})