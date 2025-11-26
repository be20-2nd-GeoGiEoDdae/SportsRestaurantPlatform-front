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

      <!-- 오른쪽 예약 박스 -->
      <div class="reserve-box">
        <p class="reserve-title">인원 수</p>

        <div class="count-box">
          <Button class="count-btn" @click="minus">-</Button>
          <Input type="text" class="count-input" v-model="count" readonly />
          <Button class="count-btn" @click="plus">+</Button>
        </div>

        <div class="total-row">
          <p>총 금액</p>
          <p class="total-price">{{ totalPrice.toLocaleString() }} 원</p>
        </div>

        <Button type="primary" class="reserve-btn">예약</Button>
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
    <div class="pagination-area">
      <Button class="page-btn" @click="prevPage" :disabled="page===1">&lt;</Button>

      <Button
          class="page"
          v-for="n in totalPages"
          :key="n"
          :class="{ active: page === n }"
          @click="goPage(n)"
      >
        {{ n }}
      </Button>

      <Button class="page-btn" @click="nextPage" :disabled="page===totalPages">&gt;</Button>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
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

import "@/assets/restaurant/RestaurantListDetailedView.css";


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


/* -----------------------------
    라이트박스
----------------------------- */
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const lightboxImages = ref([]);

const openLightbox = (i) => {
  lightboxImages.value = images.value;
  lightboxIndex.value = i;
  lightboxVisible.value = true;
};

const openLightboxReview = (review) => {
  lightboxImages.value = [getImageUrl(review.pictures)];
  lightboxIndex.value = 0;
  lightboxVisible.value = true;
};


/* -----------------------------
    예약 박스
----------------------------- */
const count = ref(1);
const pricePerPerson = 30000;

const totalPrice = computed(() => count.value * pricePerPerson);
const plus = () => count.value++;
const minus = () => count.value > 1 && count.value--;


/* -----------------------------
    리뷰 페이징
----------------------------- */
const page = ref(1);
const size = 2;

const totalPages = computed(() =>
    Math.ceil(reviews.value.length / size)
);

const pagedReviews = computed(() =>
    reviews.value.slice((page.value - 1) * size, page.value * size)
);

const nextPage = () => page.value < totalPages.value && page.value++;
const prevPage = () => page.value > 1 && page.value--;
const goPage = (n) => page.value = n;


/* -----------------------------
    리뷰 정렬
----------------------------- */
const sortByScore = () => {
  reviews.value.sort((a, b) => b.reviewScore - a.reviewScore);
  page.value = 1;
};


/* -----------------------------
    평균 평점
----------------------------- */
const avgScore = computed(() => {
  if (reviews.value.length === 0) return "-";
  const sum = reviews.value.reduce((acc, r) => acc + r.reviewScore, 0);
  return (sum / reviews.value.length).toFixed(1);
});


/* -----------------------------
    상세 조회 + 리뷰 조회
----------------------------- */
onMounted(async () => {
  const id = route.params.id;

  try {
    /* ⭐ Restaurant 상세 */
    const { data } = await axios.get(`http://localhost:8080/api/restaurants/${id}`);
    restaurant.value = data;

    /* 키워드 */
    if (data.keywords) {
      tags.value = data.keywords
          .split(",")
          .map(v => v.trim())
          .filter(v => v.length > 0);
    }

    /* 사진 */
    if (data.pictureUrls) {
      images.value = data.pictureUrls
          .split(",")
          .map(p => getImageUrl(p.trim()));
    }

    /* ⭐ 리뷰 조회 */
    const res = await axios.get(`http://localhost:8080/api/reviews/restaurant/${id}`);
    reviews.value = res.data;

  } catch (err) {
    console.error("상세 조회 실패", err);
  }
});
</script>
