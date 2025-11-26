<!-- SubscriptionComplete.vue -->
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goMain = () => {
  // 메인 페이지 라우트에 맞게 수정
  router.push("/");
};
</script>

<template>
  <div class="sub-complete-page">
    <main class="sub-complete-main">
      <div class="complete-card">
        <h2 class="complete-title">
          <span class="brand-text">거기어때</span>
          <span> 구독 결제 완료</span>
        </h2>

        <!-- 필요 없으면 이 문장은 지워도 됨 -->
        <p class="complete-desc">
          정기 결제가 정상적으로 완료되었습니다.
        </p>

        <el-button
            type="primary"
            class="go-main-btn"
            @click="goMain"
        >
          메인 페이지로 돌아가기
        </el-button>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 페이지 배경 (스크린샷의 회색 배경) */
.sub-complete-page {
  min-height: 100vh;
  background-color: #e9e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 네비바 아래쪽에서 가운데 정렬되도록 여유 패딩 */
.sub-complete-main {
  width: 100%;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

/* 가운데 흰 박스 */
.complete-card {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  padding: 60px 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  text-align: center;
  box-sizing: border-box;
}

/* 타이틀 */
.complete-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
}

.brand-text {
  color: #00a9ff;
}

/* 서브 문구 */
.complete-desc {
  font-size: 14px;
  color: #555555;
  margin-bottom: 32px;
}

/* 버튼 */
.go-main-btn {
  min-width: 220px;
  height: 42px;
  font-size: 14px;
}
</style>
