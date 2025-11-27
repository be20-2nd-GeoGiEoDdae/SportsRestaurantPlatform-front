<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Navbar from "@/components/shared/navbar/Navbar.vue";
import Button from "@/components/shared/basic/Button.vue";

const router = useRouter();
const route = useRoute();

// 로그인 처리
const isLoggedIn = ref(false);

const saveTokenIfExists = () => {
  const access = route.query.accessToken;
  const refresh = route.query.refreshToken;

  if (access) {
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    router.replace({ path: route.path });
    isLoggedIn.value = true;
  }
};

const checkLoginStatus = () =>
    (isLoggedIn.value = !!localStorage.getItem("accessToken"));

const startSocialLogin = () =>
    (window.location.href = "http://localhost:8080/oauth2/authorization/kakao");

const goToService = () => router.push("/restaurant");

// ===================================================
// ⭐ 이미지 URL 변환 (리뷰 페이지와 동일)
// ===================================================
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
};

// ===================================================
// Viewing API 연동
// ===================================================
const viewingList = ref([]);
const isLoading = ref(false);

// 한글 → 코드 변환
const sportMap = {
  축구: "SOCCER",
  야구: "BASEBALL",
  농구: "BASKETBALL",
};

const loadViewings = async () => {
  try {
    isLoading.value = true;

    const res = await axios.get("http://localhost:8080/api/viewings", {
      params: {
        lat: 37.5665,
        lng: 126.9780,
        page: 0,
        size: 20,
        sort: "distance",
      },
    });

    const page = res.data;

    viewingList.value = page.content.map(v => ({
      id: v.viewingCode,
      sport: sportMap[v.sportName] ?? "ETC",
      sportLabel: v.sportName,
      name: v.restaurantName,
      area: v.teamName,
      distance: (v.distance ?? 0).toFixed(2) + "km",
      rating: 4.7,
      tablesAvailable: v.viewingMaxNum ?? 3,
      status: "BOOKING",
      themeColor: "blue",
      badge: v.viewingTitle,
      highlight: v.viewingBody,
      pictureUrl: getImageUrl(v.pictureUrl),    // ⭐ 여기!!
    }));
  } catch (e) {
    console.error("관람 조회 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

// ===================================================
// 카테고리
// ===================================================
const categories = [
  { id: "ALL", label: "전체" },
  { id: "SOCCER", label: "축구" },
  { id: "BASEBALL", label: "야구" },
  { id: "BASKETBALL", label: "농구" },
];

const selectedCategory = ref("ALL");

const filteredViewings = computed(() => {
  if (selectedCategory.value === "ALL") return viewingList.value;
  return viewingList.value.filter(v => v.sport === selectedCategory.value);
});

const sportEmojiMap = {
  SOCCER: "⚽",
  BASEBALL: "⚾",
  BASKETBALL: "🏀",
};

// ===================================================
// 모달
// ===================================================
const isModalOpen = ref(false);
const selectedRestaurant = ref(null);
const modalStep = ref(1);

const openReservationModal = (restaurant) => {
  selectedRestaurant.value = restaurant;
  modalStep.value = 1;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const confirmReservation = () => (modalStep.value = 2);

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
  setTimeout(() => (selectedRestaurant.value = null), 300);
};

// ===================================================
// 실행
// ===================================================
onMounted(() => {
  saveTokenIfExists();
  checkLoginStatus();
  loadViewings();
});
</script>

<template>
  <div class="review-page">

    <!-- 좌측 사이드바 -->
    <aside class="review-sidebar">
      <SidebarUser />
    </aside>

    <!-- 오른쪽 컨텐츠 -->
    <div class="review-content-wrapper">

      <!-- 제목 (박스 밖) -->
      <h1 class="page-title">리뷰 등록</h1>

      <!-- 하얀 박스 본문 -->
      <section class="review-content-box">

        <!-- 상단 요약 박스 -->
        <section class="match-summary">
          <div class="thumb-box">
            <img
                v-if="pictureUrls.length > 0"
                :src="pictureUrls[0]"
                class="thumb-img"
            />
            <span v-else>사진 없음</span>
          </div>

          <div class="match-right">
            <p class="match-title">{{ matchTitle }}</p>
            <p>장소 : {{ placeName }}</p>
            <p>종류 : {{ typeName }}</p>
          </div>
        </section>

        <!-- 리뷰 작성 영역 -->
        <section class="review-edit-area">
          <div class="left-photo">
            <div class="big-photo">
              <img v-if="uploadedPhoto" :src="uploadedPhoto" class="big-photo-img" />
              <span v-else>대표 사진 없음</span>
            </div>

            <div class="photo-buttons">
              <el-button size="small" @click="fileInput.click()">
                사진 추가
              </el-button>

              <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display:none"
                  @change="onFileChange"
              />
            </div>
          </div>

          <div class="right-form">
            <div class="rating-row">
              <span class="rating-label">평점을 선택해주세요</span>
              <el-rate v-model="rating" :max="5" />
            </div>

            <el-input
                v-model="reviewTitle"
                class="title-input"
                placeholder="제목을 입력해주세요"
            />

            <el-input
                v-model="reviewText"
                type="textarea"
                :rows="7"
                maxlength="500"
                show-word-limit
                placeholder="내용을 입력해주세요. 최대 500자까지 작성 가능합니다."
            />
          </div>
        </section>

        <!-- 등록 버튼 -->
        <div class="submit-row">
          <el-button type="primary" class="btn-save" @click="handleSave">
            리뷰 등록
          </el-button>
        </div>

        <!-- 성공 메시지 -->
        <p v-if="successMessage" class="success-text">
          {{ successMessage }}
        </p>

      </section>
    </div>
  </div>
</template>


<style scoped>
@import "@/assets/mypage/mypagerevieweidt.css";

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.big-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 성공 문구 스타일 */
.success-text {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: #2ecc71;
}
</style>
