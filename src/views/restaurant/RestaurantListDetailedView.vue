<template>
  <div class="detail-wrapper">

    <!-- ================= Hero ================= -->
    <section class="hero-section">
      <img
          v-if="images.length"
          :src="images[0]"
          class="hero-main"
          @click="openLightbox(0)"
      />

      <div class="hero-thumbs">
        <img
            v-for="(img, i) in images.slice(1,4)"
            :key="i"
            :src="img"
            class="thumb"
            @click="openLightbox(i+1)"
        />

        <div
            v-if="images.length > 4"
            class="thumb more-thumb"
            @click="openLightbox(0)"
        >
          <img :src="images[4]" class="thumb-img" />
          <div class="more-overlay">
            <div class="more-icon">📷</div>
            <span class="more-text">+ 더보기</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 상세 정보 ================= -->
    <section class="content-section">

      <div class="left-info">
        <Text tag="h1" class="store-name">
          {{ restaurant.restaurantName }}
        </Text>

        <Text tag="p" class="store-desc">
          {{ restaurant.restaurantContents }}
        </Text>

        <div class="info-block">
          <Label class="info-title">음식 카테고리</Label>
          <p class="tag-blue">{{ restaurant.restaurantCategory }}</p>
        </div>

        <div class="info-block">
          <Label class="info-title">키워드</Label>
          <div class="tag-list">
            <span class="tag" v-for="(t,i) in tags" :key="i">#{{ t }}</span>
          </div>
        </div>

        <div class="info-block">
          <Label class="info-title">위치</Label>
          <p>{{ restaurant.restaurantLocation }}</p>
        </div>
      </div>


    </section>

    <!-- ================= 리뷰 ================= -->
    <section class="review-section">

      <div class="review-header">
        <p class="review-title">⭐ 가게 리뷰</p>
        <p class="review-score">{{ avgScore }}</p>
        <p class="sort-btn" @click="sortByScore">평점순</p>
      </div>

      <!-- 리뷰 아이템 -->
      <div
          v-for="review in pagedReviews"
          :key="review.reviewCode"
          class="review-item"
      >
        <div class="review-gallery" v-if="review.pictures">
          <img
              :src="getImageUrl(review.pictures)"
              class="review-img"
              @click="openLightboxReview(review)"
          />
        </div>

        <p class="review-user">{{ review.userName }} 님</p>
        <p class="review-text">{{ review.reviewBody }}</p>

        <hr />
      </div>

    </section>

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

    <!-- 하단 버튼 -->
    <div class="bottom-actions" v-if="userRole === 'ENTREPRENEUR'">
      <Button class="delete-btn">삭제</Button>
      <Button class="edit-btn" type="primary">수정</Button>
    </div>

    <!-- Lightbox -->
    <ImageLightbox
        :images="lightboxImages"
        :visible="lightboxVisible"
        :index="lightboxIndex"
        @close="lightboxVisible = false"
        @update:index="(v)=> lightboxIndex = v"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import Button from "@/components/shared/basic/Button.vue";
import Input from "@/components/shared/basic/Input.vue";
import Text from "@/components/shared/basic/Text.vue";
import Label from "@/components/shared/basic/Label.vue";
import ImageLightbox from "@/components/shared/imagebox/ImageLightbox.vue";
import { ElPagination } from "element-plus";

import "@/assets/restaurant/RestaurantListDetailedView.css";

/* ============================
   ⭐ JWT Role 불러오기
=============================== */
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

let userRole = ref(null);

(async () => {
  try {
    await authStore.loadFromToken();
    userRole.value = authStore.role;
  } catch (e) {
    console.error("JWT 로드 실패:", e);
  }
})();

/* -----------------------------
    상태값
----------------------------- */
const restaurant = ref({});
const tags = ref([]);
const images = ref([]);
const reviews = ref([]);

const route = useRoute();

/* -----------------------------
    백엔드 이미지 URL
----------------------------- */
const getImageUrl = (path) =>
    path ? `http://localhost:8080${path}` : "/images/default.jpg";

/* 라이트박스 */
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const lightboxImages = ref([]);

/* 예약 박스 */
const count = ref(1);
const pricePerPerson = 30000;
const totalPrice = computed(() => count.value * pricePerPerson);

const plus = () => count.value++;
const minus = () => count.value > 1 && count.value--;

/* 페이징 */
const pageInfo = ref({
  page: 1,
  size: 2,
  totalElements: 0,
});

const pagedReviews = computed(() => {
  const start = (pageInfo.value.page - 1) * pageInfo.value.size;
  const end = start + pageInfo.value.size;
  return reviews.value.slice(start, end);
});

const handlePageChange = (page) => {
  pageInfo.value.page = page;
};

/* 정렬 */
const sortByScore = () => {
  reviews.value.sort((a, b) => b.reviewScore - a.reviewScore);
  pageInfo.value.page = 1;
};

/* 평균 평점 */
const avgScore = computed(() => {
  if (reviews.value.length === 0) return "-";
  const sum = reviews.value.reduce((acc, r) => acc + r.reviewScore, 0);
  return (sum / reviews.value.length).toFixed(1);
});

/* 상세 조회 */
onMounted(async () => {
  const id = route.params.id;

  try {
    const { data } = await axios.get(`http://localhost:8080/api/restaurants/${id}`);
    restaurant.value = data;

    if (data.keywords) {
      tags.value = data.keywords.split(",").map(v => v.trim()).filter(Boolean);
    }

    if (data.pictureUrls) {
      images.value = data.pictureUrls.split(",").map(p => getImageUrl(p.trim()));
    }

    const res = await axios.get(`http://localhost:8080/api/reviews/restaurant/${id}`);
    reviews.value = res.data;
    pageInfo.value.totalElements = reviews.value.length;

  } catch (err) {
    console.error("상세 조회 실패", err);
  }
});
</script>


<style scoped>
.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>