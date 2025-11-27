<template>
  <div class="home-page">
    <!-- ★ Navbar -->
    <Navbar />

    <!-- ===================== 히어로 ===================== -->
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-text">
          <span class="hero-chip">🍻 Sports Restaurant Platform</span>
          <h1 class="hero-title">
            경기 보면서 먹고 마실 곳,
            <span class="hero-title-accent">거기어때?</span>
          </h1>
          <p class="hero-subtitle">
            축구 · 야구 · 농구까지,<br />
            종목 선택만 하면 해당 경기를 보여주는 가게들을 한 번에 볼 수 있습니다.
          </p>

          <!-- ★ 로그인 상태 -->
          <div class="action-buttons">
            <template v-if="!isLoggedIn">
              <Button
                  type="button"
                  @click="startSocialLogin"
                  variant="primary"
                  class="btn-primary"
              >
                카카오 로그인
              </Button>
            </template>

            <template v-else>
              <Button
                  type="button"
                  @click="goToService"
                  variant="primary"
                  class="btn-primary"
              >
                서비스 이용하기
              </Button>
            </template>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-circle"></div>
          <div class="hero-card">
            <div class="hero-card-inner">
              <span class="hero-card-emoji">📍</span>
              <div>
                <div class="hero-card-title">내 주변 가게</div>
                <div class="hero-card-sub">스포츠 중계 가게를 한 번에</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== 메인 ===================== -->
    <main class="main">
      <!-- 카테고리 -->
      <section class="category-section">
        <h2 class="category-title">
          <span class="category-emoji">🍽️</span> 스포츠 종목별 레스토랑
        </h2>

        <div class="category-chips">
          <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="category-chip"
              :class="{ 'category-chip--active': selectedCategory === cat.id }"
          >
            {{ cat.label }}
          </button>
        </div>
      </section>

      <!-- ===================== 카드 리스트 ===================== -->
      <section class="cards-section">
        <div
            v-for="restaurant in filteredViewings"
            :key="restaurant.id"
            class="restaurant-card"
        >
          <div class="restaurant-card-header">
            <div>
              <span class="badge" :class="`badge--${restaurant.themeColor}`">
                {{ restaurant.badge }}
              </span>
              <div class="meta-line">
                <span class="meta-icon">📍</span>
                {{ restaurant.area }} · {{ restaurant.distance }}
              </div>
            </div>

            <span
                v-if="restaurant.status === 'SOLD_OUT'"
                class="status status--soldout"
            >
              예약 마감
            </span>
            <span v-else class="status status--open">
              <span class="status-dot"></span>
              예약 가능
            </span>
          </div>

          <div class="restaurant-card-body">
            <div class="thumb">
              <img
                  v-if="restaurant.pictureUrl"
                  :src="restaurant.pictureUrl"
                  class="thumb-img"
              />
              <span v-else>사진 없음</span>
            </div>

            <div class="card-main">
              <div class="info-row">
                <div class="info-left">
                  <div class="info-name-row">

                    <div class="sport-icon">{{ sportEmojiMap[restaurant.sport] }}</div>
                    <h3 class="restaurant-name">{{ restaurant.name }}</h3>
                  </div>
                  <p class="restaurant-sub">
                    {{ restaurant.sportLabel }} · {{ restaurant.highlight }}
                  </p>
                </div>

                <div class="rating-pill">★ {{ restaurant.rating.toFixed(1) }}</div>
              </div>
            </div>

            <div class="card-footer">
              <button
                  v-if="restaurant.status !== 'SOLD_OUT'"
                  @click="openReservationModal(restaurant)"
                  class="btn btn-primary btn-large btn-full-width reserve-btn"
              >
                가게 예약하기 →
              </button>

              <button
                  v-else
                  disabled
                  class="btn btn-large btn-full-width reserve-btn reserve-btn--disabled"
              >
                예약 마감
              </button>

              <div class="tables-info">
                <span class="tables-icon">👥</span>
                예약 가능 테이블:
                <b class="tables-strong">{{ restaurant.tablesAvailable }}</b>개
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredViewings.length === 0" class="empty-state">
          <div class="empty-emoji">🧐</div>
          <h3 class="empty-title">일치하는 가게가 없습니다.</h3>
          <p class="empty-sub">다른 종목을 선택해보세요.</p>
        </div>
      </section>
    </main>

    <!-- ===================== 모달 ===================== -->
    <Transition name="slide-up">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ modalStep === 1 ? "🏟️ 가게 예약하기" : "✅ 예약 완료" }}
            </h3>
            <button @click="closeModal" class="modal-close">✕</button>
          </div>

          <div class="modal-body">
            <div v-if="modalStep === 1">
              <div class="modal-shop">
                <div class="modal-shop-distance">
                  <div class="modal-shop-distance-label">거리</div>
                  <div class="modal-shop-distance-text">
                    {{ selectedRestaurant?.distance }}
                  </div>
                </div>

                <div class="modal-shop-text">
                  <div class="modal-shop-tag">
                    {{ selectedRestaurant?.sportLabel }} ·
                    {{ selectedRestaurant?.highlight }}
                  </div>
                  <div class="modal-shop-name">{{ selectedRestaurant?.name }}</div>
                  <div class="modal-shop-area">{{ selectedRestaurant?.area }}</div>
                </div>
              </div>

              <button
                  @click="confirmReservation"
                  class="btn btn-primary btn-large btn-full-width modal-submit"
              >
                가게 예약 확정하기
              </button>
            </div>

            <div v-else class="modal-complete">
              <div class="complete-icon">✅</div>
              <h4 class="complete-title">예약이 완료되었습니다!</h4>
              <p class="complete-sub">가게에서 뵙겠습니다.</p>
              <button
                  @click="closeModal"
                  class="btn btn-large btn-full-width complete-close"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Navbar from "@/components/shared/navbar/Navbar.vue";
import Button from "@/components/shared/basic/Button.vue";

const router = useRouter();
const route = useRoute();

/* ===================== 로그인 ===================== */
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

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem("accessToken");
};

const startSocialLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
};

const goToService = () => {
  router.push("/restaurant");
};

/* ===================== 이미지 경로 변환 (완전 디버그) ===================== */
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";

  console.log("🎯 RAW:", path);

  // 이미 http로 시작하는 경우
  if (path.startsWith("http")) return path;

  // 서버에서 '/images/xxx.jpg' 로 보내는 경우
  if (path.startsWith("/images")) {
    const url = `http://localhost:8080${path}`;
    console.log("➡️ returned (/images):", url);
    return url;
  }

  // uploads/images 형태도 처리 가능 (혹시 다른 API에도 대비)
  if (path.startsWith("/uploads/images")) {
    const url = `http://localhost:8080${path}`;
    console.log("➡️ returned (/uploads/images):", url);
    return url;
  }

  if (path.startsWith("uploads/images")) {
    const url = `http://localhost:8080/${path}`;
    console.log("➡️ returned (uploads/images):", url);
    return url;
  }

  // 예상치 못한 경우: 파일명만 왔을 때
  const fallback = `http://localhost:8080${path}`;
  console.log("➡️ fallback:", fallback);
  return fallback;
};

/* ===================== Viewing 불러오기 ===================== */
const viewingList = ref([]);
const isLoading = ref(false);

const sportMap = {
  축구: "SOCCER",
  야구: "BASEBALL",
  농구: "BASKETBALL",
};

const loadViewings = async () => {
  try {
    isLoading.value = true;

    console.log("📡 Viewing API 호출 시작");

    const res = await axios.get("http://localhost:8080/api/viewings", {
      params: {
        lat: 37.5665,
        lng: 126.978,
        page: 0,
        size: 20,
        sort: "distance",
      },
    });

    const page = res.data;
    console.log("📥 API 응답:", page);

    viewingList.value = page.content.map((v, idx) => {
      console.log("============== [VIEW ITEM] ==============");
      console.log(`index ${idx}`);
      console.log("🔥 raw pictureUrl from server:", v.pictureUrl);
      console.log("전체 v:", v);

      const converted = getImageUrl(v.pictureUrl);

      console.log("➡️ 최종 적용 URL:", converted);
      console.log("=========================================");

      return {
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
        pictureUrl: converted,
      };
    });
  } catch (e) {
    console.error("❌ 관람 조회 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

/* ===================== 카테고리 필터 ===================== */
const categories = [
  { id: "ALL", label: "전체" },
  { id: "SOCCER", label: "축구" },
  { id: "BASEBALL", label: "야구" },
  { id: "BASKETBALL", label: "농구" },
];

const selectedCategory = ref("ALL");

const filteredViewings = computed(() => {
  if (selectedCategory.value === "ALL") return viewingList.value;
  return viewingList.value.filter((v) => v.sport === selectedCategory.value);
});

const sportEmojiMap = {
  SOCCER: "⚽",
  BASEBALL: "⚾",
  BASKETBALL: "🏀",
};

/* ===================== 모달 ===================== */
const isModalOpen = ref(false);
const selectedRestaurant = ref(null);
const modalStep = ref(1);

const openReservationModal = (restaurant) => {
  selectedRestaurant.value = restaurant;
  modalStep.value = 1;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const confirmReservation = () => {
  modalStep.value = 2;
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
  setTimeout(() => (selectedRestaurant.value = null), 300);
};

/* ===================== 최초 실행 ===================== */
onMounted(() => {
  console.log("🌐 Home.vue Mounted");
  saveTokenIfExists();
  checkLoginStatus();
  loadViewings();
});
</script>

  <style scoped>
@import "@/assets/shared/basic/buttons.css";

:root {
  --primary-color: #6094c5;
  --primary-hover: #4b7db0;
  --border-color: #e2e8f0;
}

.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4fb 0%, #ffffff 40%);
  color: #212529;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 히어로: 화면을 더 크게 차지 */
.hero-section {
  background: #ffffff;
  border-bottom: 1px solid #edf2ff;
}

.hero-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 24px 64px;      /* ↑↑ 높이 키움 */
  min-height: 320px;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 40px;
  align-items: center;
}

.hero-chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e7f5ff;
  color: #1c7ed6;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
  white-space: nowrap;
}

.hero-title {
  font-size: 40px;
  line-height: 1.25;
  font-weight: 800;
  color: #1b2430;
  margin: 0 0 12px;
}

.hero-title-accent {
  background: linear-gradient(90deg, #6094c5, #ff922b);
  -webkit-background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 15px;
  color: #495057;
  max-width: 480px;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.hero-circle {
  position: absolute;
  inset: 0 10px 10px 40px;
  border-radius: 999px;
  background: radial-gradient(circle, #d0ebff, #ffe8cc);
  filter: blur(14px);
  opacity: 0.6;
}

.hero-card {
  position: relative;
  background: #ffffff;
  border-radius: 26px;
  padding: 30px;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.16);
  border: 1px solid #f1f3f5;
  transform: rotate(-6deg);
}

.hero-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-card-emoji {
  font-size: 40px;
}

.hero-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1b2430;
  white-space: nowrap;
}

.hero-card-sub {
  font-size: 14px;
  color: #495057;
}

/* 메인 */
.main {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* 카테고리 */
.category-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.category-title {
  font-size: 24px;
  font-weight: 700;
  color: #1b2430;
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-emoji {
  font-size: 26px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #edf2ff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.category-chip {
  border: none;
  background: transparent;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  color: #6c757d;
  white-space: nowrap;
}

.category-chip--active {
  background: #6094c5;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(96, 148, 197, 0.35);
}

/* 카드 섹션: 가로 폭 조금 더 넓게 */
.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 260 → 280 */
  gap: 20px;
  align-items: stretch;
}

/* 레스토랑 카드: flex column으로 통일 */
.restaurant-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #edf2ff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.restaurant-card-header {
  padding: 16px 18px 12px;
  border-bottom: 1px dashed #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

/* 배지 / 상태 줄바꿈 방지 */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
  white-space: nowrap;
}

.badge--blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge--red {
  background: #fee2e2;
  color: #b91c1c;
}

.badge--indigo {
  background: #e0e7ff;
  color: #4338ca;
}

.badge--orange {
  background: #ffedd5;
  color: #ea580c;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-icon {
  color: var(--primary-color);
}

.status {
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.status--soldout {
  background: #f1f3f5;
  color: #868e96;
}

.status--open {
  background: #d1fae5;
  color: #047857;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #16a34a;
}

/* 카드 바디: flex column */
.restaurant-card-body {
  padding: 14px 18px 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.thumb {
  height: 140px;
  border-radius: 18px;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 14px;
  margin-bottom: 10px;
}

/* 가운데 내용 */
.card-main {
  flex: 1; /* 남는 높이 채움 → footer는 항상 아래 */
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.info-left {
  flex: 1;
  min-width: 0;
}

.info-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sport-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.restaurant-name {
  font-size: 16px;
  font-weight: 700;
  color: #1b2430;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.restaurant-sub {
  font-size: 13px;
  color: #6c757d;
  margin-top: 2px;

  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffd43b;
  font-size: 11px;
  font-weight: 800;
  color: #343a40;
  white-space: nowrap;
}

/* 아래 영역 */
.card-footer {
  margin-top: 12px;
}

.reserve-btn {
  margin-bottom: 8px;
  white-space: nowrap; /* 버튼 두 줄 방지 */
}

.reserve-btn--disabled {
  background: #f1f3f5;
  color: #adb5bd;
}

.tables-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6c757d;
}

.tables-icon {
  color: var(--primary-color);
}

.tables-strong {
  color: var(--primary-color);
}

/* empty state */
.empty-state {
  grid-column: 1 / -1;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid #edf2ff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.04);
}

.empty-emoji {
  font-size: 40px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #1b2430;
  margin-bottom: 6px;
}

.empty-sub {
  font-size: 14px;
  color: #6c757d;
}

/* 모달 (아래부턴 기존 그대로) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 0;
  }
}

.modal {
  background: #ffffff;
  width: 100%;
  max-width: 520px;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

@media (min-width: 768px) {
  .modal {
    border-radius: 24px;
  }
}

.modal-header {
  padding: 16px 20px;
  background: #e7f5ff;
  border-bottom: 1px solid #d0ebff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1b2430;
}

.modal-sub {
  font-size: 13px;
  color: #1c7ed6;
}

.modal-close {
  border: none;
  background: #ffffff;
  border-radius: 999px;
  padding: 6px 8px;
  color: #adb5bd;
  cursor: pointer;
}

.modal-close:hover {
  background: #dbe4ff;
  color: #1c7ed6;
}

.modal-body {
  padding: 24px 24px 28px;
}

/* 모달 가게 정보 */
.modal-shop {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 18px;
  border: 2px solid #d0ebff;
  margin-bottom: 24px;
}

.modal-shop-distance {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #4dabf7, #1864ab);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 12px 26px rgba(24, 100, 171, 0.45);
}

.modal-shop-distance-label {
  font-size: 10px;
  opacity: 0.85;
}

.modal-shop-distance-text {
  font-size: 16px;
  font-weight: 700;
}

.modal-shop-text {
  flex: 1;
}

.modal-shop-tag {
  font-size: 12px;
  font-weight: 700;
  color: #1c7ed6;
  margin-bottom: 4px;
}

.modal-shop-name {
  font-size: 18px;
  font-weight: 800;
  color: #1b2430;
}

.modal-shop-area {
  font-size: 13px;
  color: #6c757d;
}

/* 폼 */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 700;
  color: #495057;
}

.form-select,
.form-input {
  border-radius: 14px;
  border: 2px solid #e9ecef;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: #f8f9fa;
}

.form-select:focus,
.form-input:focus {
  border-color: var(--primary-color);
  background: #ffffff;
}

.modal-submit {
  margin-top: 20px;
}

/* 완료 화면 */
.modal-complete {
  text-align: center;
  padding: 24px 0 4px;
}

.complete-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 20px;
  border-radius: 999px;
  background: #d3f9d8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #2b8a3e;
  box-shadow: 0 18px 40px rgba(34, 197, 94, 0.35);
}

.complete-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1b2430;
}

.complete-sub {
  font-size: 15px;
  color: #495057;
  margin-bottom: 26px;
}

.complete-close {
  background: #f1f3f5;
  color: #343a40;
}

.complete-close:hover {
  background: #e9ecef;
}

/* 모달 트랜지션 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
}

/* 애니메이션 */
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-6%);
  }
  50% {
    transform: translateY(0);
  }
}

/* 반응형 */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .hero-inner,
  .main {
    padding-inline: 16px;
  }

  .category-section {
    align-items: flex-start;
  }

  .category-title {
    font-size: 20px;
  }
}
</style>
