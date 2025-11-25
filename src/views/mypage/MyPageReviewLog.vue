<!-- ReviewList.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

const reviews = ref([
  {
    id: 1,
    title: "삼성 롯데 경기 단체 관람",
    place: "모스키칸",
    rating: 4.0,
    watchedAt: "25-11-13 / 13 : 30",
    desc: "삼성팀이 나온 롯데와의 홈 경기, 응원도 열정적이었고 거기에 경기를 보며 먹는 음식까지 있어서 굉장히 알차게 보낸 경기 관람, 다음에도 또 관람하고 싶다.",
    image:
        "https://via.placeholder.com/120x90.png?text=이미지", // 실제 이미지로 교체
  },
  {
    id: 2,
    title: "삼성 롯데 경기 단체 관람",
    place: "모스키칸",
    rating: 4.5,
    watchedAt: "25-11-13 / 13 : 30",
    desc: "친구들이랑 단체로 가서 즐겁게 응원하고 왔습니다. 좌석도 좋았고, 현장 분위기가 정말 최고였습니다.",
    image:
        "https://via.placeholder.com/120x90.png?text=이미지",
  },
]);

const currentPage = ref(1);

const handleEdit = (row) => {
  console.log("리뷰 수정:", row);
  // TODO: 수정 페이지로 이동 or 다이얼로그 오픈
};

const handleDelete = (row) => {
  console.log("리뷰 삭제:", row);
  // TODO: 삭제 확인 후 API 호출
};

const handlePageChange = (page) => {
  currentPage.value = page;
  console.log("페이지 변경:", page);
  // TODO: 서버 페이징 연동
};

/** ====== 고정 캔버스 스케일링 ====== */
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
      <div class="review-page">
        <!-- 메인 레이아웃 -->
        <div class="main-layout">
          <aside class="side-menu">
            <SidebarUser/>
          </aside>

          <!-- 오른쪽 컨텐츠 -->
          <main class="review-main">
            <h2 class="page-title">내 리뷰 목록</h2>
            <div class="title-divider"></div>

            <section class="review-list">
              <article
                  v-for="review in reviews"
                  :key="review.id"
                  class="review-card"
              >
                <div class="review-card-header">
                  <h3 class="review-title">{{ review.title }}</h3>
                  <p class="review-date">
                    관람일시 : {{ review.watchedAt }}
                  </p>
                </div>

                <div class="review-card-body">
                  <div class="review-image">
                    <img :src="review.image" alt="관람 이미지" />
                  </div>

                  <div class="review-content">
                    <div class="review-info-top">
                      <span class="place">{{ review.place }}</span>
                      <span class="rating-pill">
                        {{ review.rating.toFixed(1) }}
                      </span>
                    </div>
                    <p class="review-desc">
                      {{ review.desc }}
                    </p>
                  </div>

                  <div class="review-actions">
                    <el-button
                        size="small"
                        class="btn-edit"
                        @click="handleEdit(review)"
                    >
                      리뷰 수정
                    </el-button>
                    <el-button
                        size="small"
                        class="btn-delete"
                        @click="handleDelete(review)"
                    >
                      리뷰 삭제
                    </el-button>
                  </div>
                </div>
              </article>
            </section>

            <div class="pagination-wrapper">
              <el-pagination
                  :total="100"
                  :page-size="10"
                  :current-page="currentPage"
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagereviewlog.css";
</style>
