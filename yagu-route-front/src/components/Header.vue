<template>
  <div class="headerAll">
    <div class="logo">
      <h3>Yagu-Route</h3>
    </div>
    <div class="menu">
      <span>야구 예매</span>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.headerAll {
  display: grid;
  grid-template-columns: 100px auto 100px;
  background-color: #ff6b6b;
  height: 70px;
}

.logo {
  align-self: center;
  justify-self: center;
}

.logo h3{
  margin: 0;
}

.menu {
  align-self: center;
}

.menu span{
  margin-left: 20px;
}

.login {
  align-self: center;
  justify-self: center;
}

.login p {
  margin: 0;

}


</style>