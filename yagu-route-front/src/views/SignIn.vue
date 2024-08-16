<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter()

const memberEmail = ref('')
const memberPassword = ref('')
const errorMessage = ref('')


const signin = async() => {
  if (memberEmail.value.trim() === '' || memberPassword.value.trim() === '') {
    errorMessage.value = '이메일과 비밀번호를 모두 입력해주세요.'
    return
  }

  try {
    // 여기에 로그인 로직을 구현합니다.
    console.log('로그인 시도:', memberEmail.value, memberPassword.value)
    const response = await axios.post(`/rest_login`, {
      username: memberEmail.value,
      password: memberPassword.value
    })

    if (response.status == 200) {
      router.push('dashboard') // 메인화면으로 리디렉션
      errorMessage.value = '' // 에러 메시지 초기화
    }
  } catch(error) {
    console.error('로그인 실패:', error)
    alert("로그인에 실패했습니다.");
  }
}

const redirectToNaverLogin = () => {
  // 네이버 로그인 엔드포인트로 리디렉션
  // window.location.href = '/oauth2/authorization/naver'
  window.location.href = '/oauth2/naver'
}

const redirectToKakaoLogin = () => {
  // 네이버 로그인 엔드포인트로 리디렉션
  window.location.href = '/oauth2/authorization/kakao'
}

const redirectToGoogleLogin = () => {
  // 네이버 로그인 엔드포인트로 리디렉션
  window.location.href = '/oauth2/authorization/google'
}
</script>

<template>
  <v-container class="signin" >
    <v-card class="mt-16">
      <v-card-title class="py-0">
        <h2 class="pb-4">로그인</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signin" v-model="valid">
          <v-text-field
              v-model="memberEmail"
              label="이메일"
              prepend-icon="mdi-email"
              type="email"
              required
          ></v-text-field>
          <v-text-field
              v-model="memberPassword"
              label="비밀번호"
              prepend-icon="mdi-lock"
              type="password"
              required
          ></v-text-field>
          <v-btn type="submit" color="#B6D6F2" size="x-large" class="text-h6" block>로그인</v-btn>

        </v-form>
        <v-alert v-if="errorMessage" type="error" color="#1A237E" class="mt-3">{{ errorMessage }}</v-alert>

        <!-- 소셜 로그인 버튼 -->
        <div class="social-login mt-8 ga-2">
          <v-btn color="#03C75A" size="large" class="text-white" dark block @click="redirectToNaverLogin">
            <span class="text-white text-h6 font-weight-bold mr-2">N</span>
            네이버로 로그인
          </v-btn>
          <v-btn color="#FFEB00" size="large" dark block class="text-black mt-2" @click="redirectToKakaoLogin">
            <v-icon left class="mr-2">mdi-chat</v-icon>
            카카오로 로그인
          </v-btn>
          <v-btn color="#FFFFFF" size="large" dark block class="mt-2" @click="redirectToGoogleLogin">
            <v-icon left class="mr-2" color="#DB4437">mdi-google</v-icon>
            <span class="text-h7" style="color: #DB4437;">구글로 로그인</span>
          </v-btn>
        </div>

        <!-- 소셜 로그인 버튼 가로 배열 -->
        <!--  <div class="social-login mt-16 d-flex flex-row justify-space-around">
            <v-btn
              color="#03C75A"
              icon=""
              size="x-large"
              @click="redirectToNaverLogin"
            >
              <span class="text-white text-h4 font-weight-bold">N</span>
          </v-btn>
          <v-btn
            color="#FFEB00"
            icon=""
            size="x-large"
            @click="redirectToKakaoLogin"
          >
            <v-icon size="30">mdi-chat</v-icon>
          </v-btn>
          <v-btn
            color="#FFFFFF"
            icon=""
            size="x-large"
            @click="redirectToGoogleLogin"
          >
            <v-icon size="30" color="#DB4437">mdi-google</v-icon>
          </v-btn>
        </div>
        -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.signin {
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-container {
  max-width: 600px;
}

.v-card {
  padding: 40px;
}

.v-btn {
  margin-top: 20px;
}

.social-login {
  display: flex;
  flex-direction: column;
}
</style>
