<template>
  <div class="app">
    <header class="header">
      <Header />
    </header>
    <main class="main">
      <MainComponent />
    </main>
    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import Header from "../src/components/Header.vue";
import Footer from "../src/components/Footer.vue";
import MainComponent from "../src/components/MainComponent.vue";
import MainAfter from "@/components/MainAfter.vue";
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
  max-width: 1400px;  /* 양옆 공백을 줄이기 위해 최대 너비를 증가 */
  margin: 0 auto;
  width: 95%;  /* 전체 너비의 95%를 사용 */
}

.footer {
  background-color: #f5f5f5;
  padding: 1rem 0;
  text-align: center;
}
</style>