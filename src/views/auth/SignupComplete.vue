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
      
      <button class="main-button" @click="goToMain">
        메인 화면으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
}

.complete-card {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.check-icon {
  margin-bottom: 30px;
}

.check-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
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
  fill: white;
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
  color: #333;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 40px;
}

.message p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 5px 0;
}

.main-button {
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px;
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 195, 247, 0.4);
}

@media (max-width: 640px) {
  .complete-card {
    padding: 40px 30px;
    margin: 20px;
  }
  
  .check-circle {
    width: 100px;
    height: 100px;
  }
  
  .check-mark {
    width: 50px;
    height: 50px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>
