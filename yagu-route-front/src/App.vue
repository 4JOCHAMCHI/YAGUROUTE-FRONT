<template>
  <div class="all">
    <div class="header">
      <Header />
    </div>
    <div class="main">
      <MainComponent />
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from "../src/components/Header.vue";
import Footer from "../src/components/Footer.vue";
import MainComponent from "../src/components/MainComponent.vue";

</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.all {
  display: grid;
  grid-template-columns: 1fr; /* 열을 하나만 사용 */
  grid-template-rows: auto 1fr auto; /* 헤더와 푸터는 자동 크기, 중간은 최대 크기 */
  height: 100vh; /* 화면 전체 높이 */
}

.header {
  grid-row-start: 1;
}

.main {
  grid-row-start: 2;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 20px;
}

.footer {
  grid-row-start: 3;
}
</style>
