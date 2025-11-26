<template>
  <div class="admin-login-container">
    <div class="login-card">
      <h1 class="title">관리자 로그인</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 아이디 입력 -->
        <div class="form-group">
          <Label for="id" required>아이디</Label>
          <Input
              id="id"
              v-model="formData.adminId"
              type="text"
              placeholder="아이디를 입력해주세요"
              full-width
              :variant="errors.adminId ? 'error' : 'default'"
          />
          <div v-if="errors.adminId" class="error-message">{{ errors.adminId }}</div>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <Label for="password" required>비밀번호</Label>
          <Input
              id="password"
              v-model="formData.adminPassword"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              full-width
              :variant="errors.adminPassword ? 'error' : 'default'"
          />
          <div v-if="errors.adminPassword" class="error-message">{{ errors.adminPassword }}</div>
        </div>

        <!-- 로그인 버튼 -->
        <Button
            type="submit"
            variant="primary"
            size="large"
            full-width
            class="login-btn"
        >
          로그인
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from '@/api/axios'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/authStore"

import Button from '@/components/shared/basic/Button.vue'
import Input from '@/components/shared/basic/Input.vue'
import Label from '@/components/shared/basic/Label.vue'

const router = useRouter()
const authStore = useAuthStore()

/* ===============================
    상태값
================================*/
const formData = reactive({
  adminId: '',
  adminPassword: ''
})

const errors = reactive({
  adminId: '',
  adminPassword: ''
})

/* ===============================
    관리자 로그인 처리
================================*/
const handleLogin = async () => {
  // 유효성 검사
  if (!formData.adminId.trim()) {
    errors.adminId = '아이디를 입력해주세요.'
    return
  }
  if (!formData.adminPassword.trim()) {
    errors.adminPassword = '비밀번호를 입력해주세요.'
    return
  }

  // 에러 초기화
  errors.adminId = ''
  errors.adminPassword = ''

  try {
    const response = await axios.post('/api/admin/login', formData)

    if (response.data.success) {
      const { accessToken, refreshToken } = response.data.data

      // 🔥 관리자도 일반 사용자와 동일하게 로컬스토리지에 저장해야 RouterGuard가 인식 가능
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      console.log("관리자 accessToken:", accessToken)

      // 🔥 JWT에서 role 읽어서 Pinia에 저장
      await authStore.loadFromToken()

      // 관리자 대시보드로 이동
      router.push('/admin/user-view')
    } else {
      const { errorField, message } = response.data

      if (errorField === 'id') errors.adminId = message
      else if (errorField === 'password') errors.adminPassword = message
      else errors.adminId = message || '로그인에 실패했습니다.'
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    errors.adminId =
        error.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.'
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-light);
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
}

.login-card {
  background-color: var(--background-white);
  padding: 40px;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 20px var(--shadow-light);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.login-btn {
  margin-top: 20px;
}

.error-message {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 4px;
}
</style>
