<template>
    <Navbar />
    <div class="home-container">
        <div class="logo-section">
        <div class="logo-icon">🍽️</div>
        <div class="logo-text">거기어때?</div>
        </div>
        
        <h1 class="title">스포츠 레스토랑 플랫폼</h1>
        
        <div class="content">
        <p>스포츠를 보며 맛있는 음식을 즐길 수 있는 레스토랑을 찾아보세요!</p>
        
        <div class="action-buttons">
            <!-- 로그인 안 된 상태 -->
            <template v-if="!isLoggedIn">
            <Button
                type="button"
                @click="startSocialLogin"
                variant="primary"
                class="btn-primary"
            >
            카카오 로그인
            </Button>
            </template>
            
            <!-- 로그인 된 상태 -->
            <template v-else>
            <Button
                type="button"
                @click="goToService"
                variant="primary"
                class="btn-primary"
            >서비스 이용하기
            </Button>
            <Button
                type="button"
                @click="logout"
                variant="primary"
                class="btn-secondary"
            >
            서비스 이용하기
            </Button>
            </template>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/shared/navbar/Navbar.vue'
import Button from '@/components/shared/basic/Button.vue'

const router = useRouter()
const isLoggedIn = ref(false)

// 로그인 상태 확인
const checkLoginStatus = () => {
  const accessToken = localStorage.getItem('accessToken')
  isLoggedIn.value = !!accessToken
}

// 소셜 로그인 시작
const startSocialLogin = () => {
  // 백엔드의 소셜 로그인 URL로 리다이렉트
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
}

// 로그아웃
const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  isLoggedIn.value = false
  alert('로그아웃되었습니다.')
}

// 서비스 이용하기
const goToService = () => {
  alert('서비스는 곧 출시됩니다!')
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background-light);
  color: var(--text-primary);
  text-align: center;
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo-icon {
  background-color: var(--primary-color);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 30px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.content {
  max-width: 600px;
}

.content p {
  font-size: 18px;
  margin-bottom: 40px;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-primary {
  background-color: #4FC3F7;
  color: white;
}

.btn-primary:hover {
  background-color: #29B6F6;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: white;
  color: #4FC3F7;
  border: 2px solid #4FC3F7;
}

.btn-secondary:hover {
  background-color: #f0f8ff;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .title {
    font-size: 32px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
