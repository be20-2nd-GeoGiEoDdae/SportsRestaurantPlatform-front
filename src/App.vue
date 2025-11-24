<script setup>
import Navbar from '@/components/shared/navbar/Navbar.vue'
</script>

<template>
  <Navbar />

  <!-- 고정 네비바를 피하기 위한 안전 영역 -->
  <div class="page-container">
    <router-view />
  </div>
</template>

<style scoped>
.page-container {
  padding-top: 60px; /* 네비바 높이 70px + 여유 20px */
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
