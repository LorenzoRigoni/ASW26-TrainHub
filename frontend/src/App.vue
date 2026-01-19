<script setup>
import Footer from './components/Footer.vue';
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/NavBar.vue'
import SideMenu from './components/SideMenu.vue';
</script>

<!-- Temporaneo per testare e visualizzare primi componenti creati -->
<template>
  <div id="app">
    <Navbar />
    <SideMenu/>
    <main class="main-content">
      <h1>Benvenuto in TrainHub! 💪</h1>
      <p>La tua applicazione per programmi di allenamento</p>
    </main>
    <Footer></Footer>
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
  font-family: Century Gothic;
}

.main-content {
  text-align: center;
  margin-top: 100pt;
}

.main-content h1 {
  color: #1e1548;
  margin-bottom: 1rem;
}
</style>
