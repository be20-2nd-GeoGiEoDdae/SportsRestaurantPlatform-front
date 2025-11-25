<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

const route = useRoute();
const router = useRouter();

const reviewId = route.params.id;

// 실제로는 reviewId 로 API 호출해서 데이터 가져오기
const matchTitle = ref("삼성 롯데 경기 단체 관람");
const placeName = ref("모스키칸");
const typeName = ref("양식");

const rating = ref(0);
const reviewText = ref("");

const handleSave = () => {
  console.log("리뷰 수정 저장", {
    id: reviewId,
    rating: rating.value,
    text: reviewText.value,
  });
  router.push({ name: "ReviewList" });
};

/* ===== 1024x768 고정 캔버스 스케일 ===== */
const baseWidth = 1024;
const baseHeight = 768;
const canvasRef = ref(null);

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
      <div class="edit-page">
        <!-- 상단바 -->
        <!-- 메인 레이아웃 -->
        <div class="main-layout">
          <!-- 사이드바 -->
          <aside>
            <SidebarUser/>
          </aside>

          <!-- 오른쪽: 리뷰 수정 폼 -->
          <main class="edit-main">
            <div class ="edit-card">
            <h2 class="page-title">리뷰 수정</h2>

            <!-- 상단: 관람 내역 요약 -->
            <section class="match-summary">
              <div class="match-left">
                <div class="thumb-box">
                  <span>경기 사진</span>
                </div>
              </div>
              <div class="match-right">
                <p class="match-title">{{ matchTitle }}</p>
                <p>장소 : {{ placeName }}</p>
                <p>종류 : {{ typeName }}</p>
              </div>
            </section>

            <!-- 아래: 리뷰 입력 영역 -->
            <section class="edit-area">
              <div class="left-photo">
                <div class="big-photo">
                  <span>경기 사진</span>
                </div>

                <div class="photo-buttons">
                  <el-button size="small">사진</el-button>
                  <el-button size="small">사진 추가</el-button>
                </div>
              </div>

              <div class="right-form">
                <div class="rating-row">
                  <span class="rating-label">평점을 선택해주세요</span>
                  <el-rate v-model="rating" :max="5" />
                </div>

                <el-input
                    class="title-input"
                    placeholder="제목을 입력해주세요"
                />

                <el-input
                    v-model="reviewText"
                    type="textarea"
                    :rows="7"
                    maxlength="500"
                    show-word-limit
                    placeholder="내용을 입력해주세요. 최대 500자까지 작성할 수 있습니다."
                />
              </div>
            </section>

            <div class="submit-row">
              <el-button
                  type="primary"
                  class="btn-save"
                  @click="handleSave"
              >
                리뷰 수정
              </el-button>
            </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagerevieweidt.css";
</style>
