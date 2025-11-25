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
        <p class="review-score">4.5</p>
        <p class="sort-btn">최신순</p>
      </div>

      <!-- 봄 리뷰 -->
      <div class="season">봄</div>
      <div class="review-gallery">
        <img
            v-for="(img, n) in sampleReview"
            :key="'spring' + n"
            :src="img"
            class="review-img"
            @click="openLightboxReview(n)"
        />
      </div>
      <p class="review-text">너무 재밌게 즐겼습니다~~!</p>

      <hr />

      <!-- 여름 리뷰 -->
      <div class="season">여름</div>
      <div class="review-gallery">
        <img
            v-for="(img, n) in sampleReview"
            :key="'summer' + n"
            :src="img"
            class="review-img"
            @click="openLightboxReview(n)"
        />
      </div>
      <p class="review-text">너무 재밌게 즐겼습니다~~!</p>

    </section>

    <!-- 페이지네이션 -->
    <div class="pagination-area">
      <Button class="page-btn">&lt;</Button>
      <Button class="page active">1</Button>
      <Button class="page">2</Button>
      <Button class="page">3</Button>
      <Button class="page">4</Button>
      <Button class="page">5</Button>
      <Button class="page-btn">&gt;</Button>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <Button class="delete-btn">삭제</Button>
      <Button class="edit-btn" type="primary">수정</Button>
    </div>

    <!-- Lightbox -->
    <ImageLightbox
        :images="allImages"
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

import "@/assets/restaurant/RestaurantListDetailedView.css"

/* -----------------------------
    Restaurant 데이터 구조
----------------------------- */
const restaurant = ref({
  restaurantName: "",
  restaurantContents: "",
  restaurantCategory: "",
  restaurantLocation: ""
});

/* 2) 키워드 */
const tags = ref([]);

/* 3) 이미지 */
const images = ref([]);
const sampleReview = ref([
  "/src/assets/img/rev1.jpg",
  "/src/assets/img/rev2.jpg",
  "/src/assets/img/rev3.jpg"
]);

/* Lightbox */
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

const getImageUrl = (path) => {
  return path ? `http://localhost:8080${path}` : "/images/default.jpg";
};

const openLightbox = (i) => {
  lightboxIndex.value = i;
  lightboxVisible.value = true;
};

const openLightboxReview = (i) => {
  lightboxIndex.value = images.value.length + i;
  lightboxVisible.value = true;
};

const allImages = computed(() => [...images.value, ...sampleReview.value]);

/* 예약 */
const count = ref(1);
const pricePerPerson = 30000;
const totalPrice = computed(() => count.value * pricePerPerson);
const plus = () => count.value++;
const minus = () => count.value > 1 && count.value--;

/* -----------------------------
    백엔드 Restaurant 상세 조회
----------------------------- */
const route = useRoute();

onMounted(async () => {
  const id = route.params.id;

  try {
    const { data } = await axios.get(
        `http://localhost:8080/api/restaurants/${id}`
    );

    /* Restaurant 매핑 */
    restaurant.value = {
      restaurantName: data.restaurantName,
      restaurantContents: data.restaurantContents,
      restaurantCategory: data.restaurantCategory,
      restaurantLocation: data.restaurantLocation
    };

    /* # 키워드 처리 (문자열 → 배열) */
    if (typeof data.keywords === "string") {
      tags.value = data.keywords
          .split(",")        // 오직 쉼표만 split
          .map(v => v.trim())
          .filter(v => v.length > 0);
    }
    console.log("RAW keywords:", data.keywords);
    console.log("PARSED tags:", tags.value);
    /* 이미지 처리 */
    if (typeof data.pictureUrls === "string") {
      images.value = data.pictureUrls
          .split(",")
          .map(path => getImageUrl(path.trim()));
    }
  } catch (err) {
    console.error("가게 상세 조회 실패:", err);
  }
});
</script>
