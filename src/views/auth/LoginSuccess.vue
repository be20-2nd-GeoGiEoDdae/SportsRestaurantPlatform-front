<template>
  <div class="login-success-container">
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <h2>로그인 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const accessToken = route.query.accessToken
  const refreshToken = route.query.refreshToken
  
  if (accessToken && refreshToken) {
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    
    // 홈 페이지로 리다이렉트
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } else {
    // 토큰이 없으면 로그인 실패로 처리
    alert('로그인에 실패했습니다.')
    router.push('/')
  }
})
</script>

<style scoped>
.login-success-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
}

.loading-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4FC3F7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
}

p {
  color: #666;
  font-size: 14px;
}
</style>
