<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/NavBar.vue'
</script>

<!-- Temporaneo per testare primo componenti creati -->
<template>
  <div id="app">
    <Navbar />
    
    <main class="main-content">
      <h1>Benvenuto in TrainHub! 💪</h1>
      <p>La tua applicazione per programmi di allenamento</p>
    </main>
  </div>
</template>

<style scoped>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


#app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.main-content {
  padding: 2rem;
  text-align: center;
}

.main-content h1 {
  color: #1e1548;
  margin-bottom: 1rem;
}
</style>
