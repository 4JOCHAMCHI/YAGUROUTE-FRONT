<script setup>
import { ref, reactive, computed } from 'vue'
import axios from "axios";
import { useRouter } from "vue-router";

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const errorMessage = ref('')
const showModal = ref(false)

const router = useRouter() // Vue Router 인스턴스 생성

const isFormValid = computed(() => {
  return formData.name !== '' &&
      formData.email !== '' &&
      formData.phone !== '' &&
      formData.password !== ''
})

const signup = async () => {
  if (isFormValid.value) {
    try {
      let url = `/api/member/signup`;
      const response = await axios.post(url, {
        memberName: formData.name,
        memberEmail: formData.email,
        memberPhone: formData.phone,
        memberPassword: formData.password, // 비밀번호를 함께 전송하는 경우
      });

      console.log('회원가입 성공:', response.data)
      errorMessage.value = '' // 에러 메시지 초기화
      showModal.value = true

      setTimeout(() => {
        showModal.value = false
        router.push('/') // 메인화면으로 리디렉션
      }, 2000);
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  } else {
    errorMessage.value = '모든 필드를 채워주세요.'
  }
}

</script>

<template>
  <v-container class="register">
    <v-card class="mt-16">
      <v-card-title class="py-0">
        <h2 class="pb-4">회원가입</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup" v-model="valid">
          <v-text-field
              v-model="formData.name"
              label="이름"
              prepend-icon="mdi-account"
              type="text"
              required
          ></v-text-field>
          <v-text-field
              v-model="formData.email"
              label="이메일"
              prepend-icon="mdi-email"
              type="email"
              required
          ></v-text-field>
          <v-text-field
              v-model="formData.phone"
              label="전화번호"
              prepend-icon="mdi-phone"
              type="tel"
              required
          ></v-text-field>
          <v-text-field
              v-model="formData.password"
              label="비밀번호"
              prepend-icon="mdi-lock"
              type="password"
              required
          ></v-text-field>
          <v-btn type="submit" color="#B6D6F2" size="x-large" class="text-h6" block>가입하기</v-btn>
        </v-form>
        <v-alert v-if="errorMessage" type="error" color="#1A237E" class="mt-3">{{ errorMessage }}</v-alert>
      </v-card-text>
    </v-card>

    <!-- 환영 모달 -->
    <v-dialog v-model="showModal" max-width="600">
      <v-card class="d-flex">
        <v-card-title class="text-h5">환영합니다!</v-card-title>
        <v-card-text>회원가입이 성공적으로 완료되었습니다.</v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.register {
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
</style>
