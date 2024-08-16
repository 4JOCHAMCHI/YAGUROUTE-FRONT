<template>
  <v-container class="headerAll" fluid>
    <v-row no-gutters align="center">
      <v-col class="logo" cols="2">
        <v-btn
            text
            @click="goToHome"
            class="logo-btn"
        >
          <v-icon class="logo-icon">mdi-baseball</v-icon>
        </v-btn>
      </v-col>
      <v-col class="menu" cols="8">
        <span class="font-weight-bold">YAGU-ROUTE</span>
      </v-col>
      <v-col class="login" cols="2">
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push({ name: 'MainComponent' })  // 'Home'은 라우트의 이름입니다. 실제 이름으로 교체하세요.
}
</script>

<style scoped>
.headerAll {
  background-color: #1A237E;
  height: 70px;
}

.logo {
  text-align: center;
}

.logo-btn {
  background-color: #1A237E; /* 버튼 배경 색상, 헤더와 동일 */
  border-radius: 50%; /* 버튼을 둥글게 만들기 */
}

.logo-icon {
  font-size: 36px; /* 아이콘 크기 조정 */
  color: #ffffff; /* 아이콘 색상 */
}

.menu {
  text-align: center;
}

.menu span {
  margin-left: 20px;
  color: white;
}

.login {
  text-align: center;
}
</style>