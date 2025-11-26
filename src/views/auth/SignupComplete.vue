<template>
  <div class="signup-complete-container">
    <div class="complete-card">
        <div class="check-icon">
            <div class="check-circle">
            <svg viewBox="0 0 24 24" class="check-mark">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            </div>
        </div>
        
        <h1 class="title">회원 가입 완료</h1>
        
        <div class="message">
            <p>지금 바로 다양한 스포츠 관람</p>
            <p>서비스를 이용해보세요</p>
        </div>
        
        <Button
            type="button"
            @click="goToMain"
            variant="primary"
            class="main-btn"
          >
          메인으로 돌아가기
        </Button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from '@/components/shared/basic/Button.vue'
import '@/assets/shared/colors.css';


const router = useRouter()

const goToMain = () => {
  router.push('/')
}
</script>

<style scoped>
.signup-complete-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-light);
  padding: 20px;
}

.complete-card {
  background: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 40px var(--shadow-light);
  max-width: 400px;
  width: 100%;
}

.check-icon {
  margin-bottom: 30px;
}

.check-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: checkBounce 0.6s ease-out;
}

.check-mark {
  width: 60px;
  height: 60px;
  fill: var(--background-white);
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.message {
  margin-bottom: 40px;
}

.message p {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 5px 0;
}

.main-btn {
  width: 100%;
  max-width: 280px;
}
</style>
