<script setup>
import { ref } from 'vue'
import { ROLES } from '../constants/roles.js'

import Footer from '../components/Footer.vue'
import Navbar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import WorkoutProgram from '../components/WorkoutProgram.vue'

const userLogged = {
  name: 'Alessandra',
  surname: 'Versari',
  role: ROLES.PERSONAL_TRAINER
}

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

//Dati di test
const program = {
  title: "Upper / Lower - Ipertrofia",
  splits: [
    {
      name: "Upper A",
      exercises: [
        {
          name: "Panca Piana Bilanciere",
          sets: 4,
          reps: 8,
          rest: 120,
          technique: "Carico progressivo"
        },
        {
          name: "Trazioni alla Sbarra",
          sets: 3,
          reps: 10,
          rest: 90
        },
        {
          name: "Military Press",
          sets: 3,
          reps: 8,
          rest: 90,
          technique: "Rest pause"
        },
        {
          name: "Curl Bilanciere",
          sets: 3,
          reps: 12,
          rest: 60
        }
      ]
    },
    {
      name: "Lower A",
      exercises: [
        {
          name: "Squat",
          sets: 4,
          reps: 6,
          rest: 120,
          technique: "Carico costante"
        },
        {
          name: "Leg Press",
          sets: 3,
          reps: 10,
          rest: 90
        },
        {
          name: "Leg Curl",
          sets: 3,
          reps: 12,
          rest: 60,
          technique: "Drop set"
        },
        {
          name: "Calf Raise",
          sets: 4,
          reps: 15,
          rest: 45
        }
      ]
    },
    {
      name: "Upper B",
      exercises: [
        {
          name: "Panca Inclinata Manubri",
          sets: 4,
          reps: 10,
          rest: 90
        },
        {
          name: "Rematore Bilanciere",
          sets: 4,
          reps: 8,
          rest: 90
        },
        {
          name: "Alzate Laterali",
          sets: 3,
          reps: 15,
          rest: 45,
          technique: "Tempo controllato"
        }
      ]
    },
    {
      name: "Lower B",
      exercises: [
        {
          name: "Stacco da Terra",
          sets: 4,
          reps: 5,
          rest: 150,
          technique: "Carico progressivo"
        },
        {
          name: "Affondi Camminati",
          sets: 3,
          reps: 12,
          rest: 90
        },
        {
          name: "Hip Thrust",
          sets: 3,
          reps: 10,
          rest: 90
        }
      ]
    }
  ]
}
</script>

<template>
     <div id="app">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <SideMenu :isOpen="sidebarOpen" :role = "userLogged.role" @close="sidebarOpen = false" />
        <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
            <WorkoutProgram :program="program" />
        </main>
        <Footer />
    </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.program-title { 
  font-size: 1.75rem; 
  font-weight: bold; 
  color: #1e1548; 
  margin: 0 0 0.25rem; 
}

.main-content {
  margin-top: 60px;      
  margin-left: 0;
  padding-bottom: 50px;   
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

@media (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 280px;
  }
}

/*Sidebar in mobile*/
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>