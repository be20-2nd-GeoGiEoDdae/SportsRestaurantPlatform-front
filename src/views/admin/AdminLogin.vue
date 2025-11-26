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
import Button from '@/components/shared/basic/Button.vue'
import Input from '@/components/shared/basic/Input.vue'
import Label from '@/components/shared/basic/Label.vue'

const router = useRouter()

// 폼 데이터
const formData = reactive({
  adminId: '',
  adminPassword: ''
})

// 에러 메시지
const errors = reactive({
  adminId: '',
  adminPassword: ''
})

// 로그인 처리
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

  console.log('로그인 요청 데이터:', formData)

  try {
    const response = await axios.post('/api/admin/login', formData)

    if (response.data.success) {
        // 로그인 성공시 세션스토리지에 JWT토큰정보 저장
        sessionStorage.setItem('adminToken', response.data.data.accessToken);
        // 로그인 성공 시 대시보드로 이동
        router.push('/admin/user-view')
    } else {
        // 로그인 실패
        const { errorField, message } = response.data
        if (errorField === 'id') {
            errors.adminId = message || '아이디가 올바르지 않습니다.'
        } else if (errorField === 'password') {
            errors.adminPassword = message || '비밀번호가 올바르지 않습니다.'
        } else {
            errors.adminId = message || '로그인에 실패했습니다.'
        }
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    errors.adminId = error.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.';
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