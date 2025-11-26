<script setup>
import {onMounted, ref} from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import axios from "axios";

const reviews = ref([]);
const pageInfo = ref({
  page: 1,
  size: 5,
  totalElements: 0,
});

// 로그인 유저 (나중에 store/useUser로 교체 가능)
const userId = 1;

// ===============================
// 이미지 URL 변환 (리뷰등록 페이지와 동일 로직)
// ===============================
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};

const loading = ref(false);
const errorMessage = ref("");

// ===============================
// 리뷰 목록 API 호출
// ===============================
const loadReviews = async (page = 1) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await axios.get(
        `http://localhost:8080/api/reviews/users/${userId}?page=${page}&size=${pageInfo.value.size}`
    );

    const data = res.data.data;
    reviews.value = data.reviews.map((r) => {
      let image = "/images/no-image.png";
      if (r.pictureUrls) {
        const first = r.pictureUrls.split(",")[0].trim();
        image = getImageUrl(first);
      }

      return {
        id: r.reviewCode || r.id,
        title: r.reviewTitle,
        place: r.restaurantName,
        rating: r.reviewScore,
        watchedAt: r.viewingAt,
        desc: r.reviewBody,
        image,
      };
    });
    
    pageInfo.value = {
      page: data.pageInfo.page,
      size: data.pageInfo.size,
      totalElements: data.pageInfo.totalElements,
    };

  } catch (e) {
    console.error("리뷰 목록 조회 실패", e);
    errorMessage.value = e.message || "리뷰 목록 조회 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

const handleEdit = (row) => {
  console.log("리뷰 수정:", row);
  // TODO: 수정 페이지로 이동 or 다이얼로그 오픈
};

const handleDelete = (row) => {
  console.log("리뷰 삭제:", row);
  // TODO: 삭제 확인 후 삭제 API 호출
};

const handlePageChange = (page) => {
  loadReviews(page);
};

// 컴포넌트 마운트 시 최초 1회 로딩
onMounted(() => {
  loadReviews(1);
});
</script>

<template>
  <div class="review-page">
    <div class="review-body">
      <!-- 왼쪽 사이드바 (사이드바 css 건드리지 않음) -->
      <aside class="review-sidebar">
        <SidebarUser />
      </aside>

      <!-- 오른쪽 컨텐츠 -->
      <main class="review-content">
        <h1 class="page-title">내 리뷰 목록</h1>

        <!-- 관리자 페이지의 table-section 느낌으로 감싸는 영역 -->
        <section class="list-section">
          <div class="review-list">
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

                <div class="review-content-inner">
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
          </div>

          <!-- 페이지네이션 -->
          <div class="bottom-pagination">
            <el-pagination
                v-if="pageInfo"
                :current-page="pageInfo?.page"
                :page-size="pageInfo?.size"
                :total="pageInfo?.totalElements"
                layout="prev, pager, next"
                @current-change="handlePageChange"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagereviewlog.css";

.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>