<!-- SubscriptionCancelDone.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const goMain = () => {
  // TODO: 메인 페이지로 라우팅
  // const router = useRouter();
  // router.push("/");
  console.log("메인 페이지로 이동");
};

/** 고정 캔버스 스케일링 */
const baseWidth = 1024;
const baseHeight = 768;
const canvasRef = ref<HTMLElement | null>(null);

const updateScale = () => {
  const el = canvasRef.value;
  if (!el) return;

  const scale = Math.min(
      window.innerWidth / baseWidth,
      window.innerHeight / baseHeight
  );
  el.style.transform = `scale(${scale})`;
};

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScale);
});
</script>

<template>
  <div class="viewport">
    <div class="canvas" ref="canvasRef">
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
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagesubscribecancelconfirm.css";
</style>
