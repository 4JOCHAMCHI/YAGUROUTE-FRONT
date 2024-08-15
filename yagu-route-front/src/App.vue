<template>
  <div class="app">
    <header class="header">
      <Header />
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import Header from "../src/components/Header.vue";
import Footer from "../src/components/Footer.vue";
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

.header {
  background-color: #f5f5f5;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 95%;
}

.footer {
  background-color: #f5f5f5;
  padding: 1rem 0;
  text-align: center;
}
</style>
