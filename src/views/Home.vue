<template>
  <div class="home-container">
    <div class="logo-section">
      <div class="logo-icon">🍽️</div>
      <div class="logo-text">거기어때?</div>
    </div>
    
    <h1 class="title">스포츠 레스토랑 플랫폼</h1>
    
    <div class="content">
      <p>스포츠를 보며 맛있는 음식을 즐길 수 있는 레스토랑을 찾아보세요!</p>
      
      <div class="action-buttons">
        <button class="btn btn-primary">로그인</button>
        <button class="btn btn-secondary">회원가입</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 홈 페이지 로직
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 30px;
  backdrop-filter: blur(10px);
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content {
  max-width: 600px;
}

.content p {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
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
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
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
