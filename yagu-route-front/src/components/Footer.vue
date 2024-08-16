<template>
  <div class="footerAll">
    <div class="main font-weight-bold">
      <p class="top">(주)Tuna | 대표이사: Dennis | 사업자 등록번호: 111-11-11111 | 메일:tuna@tuna.com</p>
      <span>이용약관</span>
      <span>개인정보처리방침</span>
      <span>운영정책</span>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.footerAll {
  display: grid;
  height: 100px;
  grid-template-columns: 100px auto 100px;
  background-color: #1A237E;
  color: white;

}

.main {
  grid-column-start: 2;
  align-self: center;
}

.main span {
  margin-right: 10px;
  font-size: 12px;
}

.main p {
  font-size: 13px;
}

.top {
  margin-bottom: 20px;
  margin-top: 0;
}

</style>