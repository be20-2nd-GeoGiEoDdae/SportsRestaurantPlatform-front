<template>
  <div class="detail-wrapper">

    <!-- ================= Hero ================= -->
    <section class="hero-section">

      <!-- 메인 이미지 -->
      <img
          :src="images[0]"
          class="hero-main"
          @click="openLightbox(0)"
      />

      <!-- 서브 썸네일 -->
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

        <Text tag="h1" class="store-name">{{ storeName }}</Text>
        <Text tag="p" class="store-desc">{{ viewDescription }}</Text>

        <div class="info-block">
          <Label class="info-title">관람명</Label>
          <p class="info-value">{{ viewName }}</p>
        </div>

        <div class="info-block">
          <Label class="info-title">종목</Label>
          <p class="info-value">{{ sportCategory }}</p>
        </div>

        <div class="info-block">
          <Label class="info-title">팀</Label>
          <p class="info-value">{{ teamName }}</p>
        </div>

        <div class="info-block">
          <Label class="info-title">인원 현황</Label>
          <p class="info-value">
            현재 {{ currentPeople }}명 /
            신청 최소 {{ applyMin }}명 /
            가게 정원 {{ restaurantMax }}명
          </p>
        </div>

        <div class="info-block">
          <Label class="info-title">키워드</Label>
          <div class="tag-list">
            <span class="tag" v-for="(k,i) in keywords" :key="i">#{{ k }}</span>
          </div>
        </div>

        <div class="info-block">
          <Label class="info-title">위치</Label>
          <p>{{ restaurantLocation }}</p>
        </div>

      </div>

      <!-- ================= 예약 박스 ================= -->
      <div class="reserve-box">

        <p class="reserve-title">예약 인원</p>

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

    <ImageLightbox
        :images="allImages"
        :visible="lightboxVisible"
        :index="lightboxIndex"
        @close="lightboxVisible = false"
        @update:index="v => lightboxIndex = v"
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

import "@/assets/viewing/ViewingListDetailedView.css";

const route = useRoute();
const viewingId = computed(() => route.params.id);

/* ====== 기본 데이터 ====== */
const storeName = ref("");
const viewName = ref("");
const viewDescription = ref("");
const sportCategory = ref("");
const teamName = ref("");

/* ====== 인원 ====== */
const currentPeople = ref(0);
const applyMin = ref(0);
const restaurantMax = ref(0);

/* ====== 키워드 및 위치 ====== */
const keywords = ref([]);
const restaurantLocation = ref("");

/* ====== 이미지 ====== */
const images = ref([]);
const sampleReview = ref([
  "/src/assets/img/rev1.jpg",
  "/src/assets/img/rev2.jpg",
  "/src/assets/img/rev3.jpg"
]);

/* ====== Lightbox ====== */
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (i) => {
  lightboxIndex.value = i;
  lightboxVisible.value = true;
};

const getImageUrl = (path) => {
  if (!path) return "/images/default.jpg";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};

const allImages = computed(() => [...images.value, ...sampleReview.value]);

/* ====== 예약 기능 ====== */
const count = ref(1);
const pricePerPerson = 30000;

const totalPrice = computed(() => count.value * pricePerPerson);

const plus = () => count.value++;
const minus = () => count.value > 1 && count.value--;

/* ====== 서버 조회 ====== */
onMounted(async () => {
  const { data: d } = await axios.get(`http://localhost:8080/api/viewings/${viewingId.value}`);

  storeName.value = d.restaurantName;
  viewName.value = d.viewingTitle;
  viewDescription.value = d.viewingBody;
  sportCategory.value = d.sportName;
  teamName.value = d.teamName;

  currentPeople.value = d.viewingMaxNum || 0;
  applyMin.value = d.viewingMinNum || 0;
  restaurantMax.value = d.restaurantMaxNum || 0;

  keywords.value = d.keywords ? d.keywords.split(",") : [];

  restaurantLocation.value = d.restaurantLocation || "정보 없음";

  images.value = d.pictureUrls
      ? d.pictureUrls.split(",").map(path => getImageUrl(path))
      : [];
});
</script>
