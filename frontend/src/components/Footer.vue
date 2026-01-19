<script setup>
    import { ref } from 'vue'
    // JavaScript/logica del componente
</script>

<template>
  <!-- HTML del componente -->
   <div class="footer">
        <p class="footer-text">Progetto Applicazioni e Servizi Web 2026</p>
   </div>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  height: 5%;
  position: fixed;  
  bottom: 0;  
  left: 0;    
  right: 0;   
  z-index: 100; /*sopra agli altri elementi */
  width: 100%;
  justify-content: center;
}

.footer-text {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
}

@media (max-width: 768px) {
  
}
</style>