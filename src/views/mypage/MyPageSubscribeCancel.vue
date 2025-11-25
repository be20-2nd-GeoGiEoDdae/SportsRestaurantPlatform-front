<!-- SubscriptionCancel.vue -->
<script setup>
const handleCancelSubscribe = () => {
  // TODO: 구독 해지 API 호출
  console.log("구독 결제 해지");
};

const goToMain = () => {
  // TODO: 메인 페이지로 라우팅
  // e.g. useRouter().push("/");
  console.log("메인 페이지로 이동");
};
</script>

<template>
  <div class="viewport">
    <div class="canvas">

  <div class="cancel-page">

    <!-- 메인 영역 -->
    <main class="main-area">
      <el-card class="cancel-card" shadow="never">
        <h2 class="page-title">구독결제 취소</h2>

        <div class="inner-card-wrapper">
          <el-card class="message-card" shadow="never">
            <div class="message-header">
              <span class="brand-text">거기 어때</span>
              <span class="message-title">정기 구독을 취소 하시겠습니까?</span>
            </div>

            <div class="message-body">
              <p>- 기존 혜택은 다음 결제일 전까지 유지 됩니다.</p>
              <p>- 콘텐츠 기록에 대한 정보가 삭제될 수 있습니다.</p>
              <p>- 구독만 중단할 수 있습니다.</p>
              <p>- 구독을 취소해도 멤버십도 기간은 유지됩니다.</p>
            </div>

            <div class="message-footer">
              <p class="confirm-text">그래도 해지 하시겠습니까?</p>
              <el-button
                  class="cancel-btn"
                  round
                  @click="handleCancelSubscribe"
              >
                구독 결제 해지
              </el-button>
            </div>
          </el-card>

          <el-button
              type="primary"
              class="back-main-btn"
              @click="goToMain"
          >
            메인 페이지로 돌아가기
          </el-button>
        </div>
      </el-card>
    </main>
  </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagesubscribecancel.css";
</style>
