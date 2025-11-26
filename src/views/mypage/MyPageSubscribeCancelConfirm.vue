<!-- SubscriptionCancelDone.vue -->
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goMain = () => {
  // 메인 페이지로 라우팅
  router.push("/");
};
</script>

<template>
  <div class="cancel-page">
    <!-- 메인 영역 -->
    <main class="main-area">
      <div class="layout-inner">
        <h2 class="page-title">구독결제 취소</h2>

        <el-card class="message-card" shadow="never">
          <div class="message-inner">
            <p class="message-line">
              <span class="brand-text">거기어때</span>
              <span> 정기 구독 결제가</span>
            </p>
            <p class="message-line">
              해지 되었습니다.
            </p>
          </div>
        </el-card>

        <el-button
            type="primary"
            class="back-main-btn"
            @click="goMain"
        >
          메인 페이지로 돌아가기
        </el-button>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagesubscribecancelconfirm.css";
</style>
