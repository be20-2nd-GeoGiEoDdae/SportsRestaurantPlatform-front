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

        <!-- 관람명 -->
        <div class="info-block">
          <Label class="info-title">관람명</Label>
          <p class="info-value">{{ viewName }}</p>
        </div>

        <!-- 종목 -->
        <div class="info-block">
          <Label class="info-title">종목</Label>
          <p class="info-value">{{ sportCategory }}</p>
        </div>

        <!-- 팀 -->
        <div class="info-block">
          <Label class="info-title">팀</Label>
          <p class="info-value">{{ teamName }}</p>
        </div>

        <!-- 인원 -->
        <div class="info-block">
          <Label class="info-title">인원 현황</Label>
          <p class="info-value">
            현재 {{ currentPeople }}명 /
            신청 최소 {{ applyMin }}명 /
            가게 정원 {{ restaurantMax }}명
          </p>
        </div>

        <!-- 키워드 -->
        <div class="info-block">
          <Label class="info-title">키워드</Label>
          <div class="tag-list">
            <span class="tag" v-for="(k,i) in keywords" :key="i">#{{ k }}</span>
          </div>
        </div>

        <!-- 위치 -->
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

        <Button type="primary" class="reserve-btn" @click="handleReserve">예약</Button>

        <div v-if="showPaymentWidget" class="toss-widget-area">
          <div id="payment-method"></div>
          <div id="agreement"></div>
          <button class="toss-pay-btn" @click="requestPayment">
            결제하기
          </button>
        </div>
      </div>

    </section>

    <!-- ================= Lightbox ================= -->
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
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import Button from "@/components/shared/basic/Button.vue";
import Input from "@/components/shared/basic/Input.vue";
import Text from "@/components/shared/basic/Text.vue";
import Label from "@/components/shared/basic/Label.vue";
import ImageLightbox from "@/components/shared/imagebox/ImageLightbox.vue";

import "@/assets/viewing/ViewingListDetailedView.css";
import {userViewingReservation} from "@/api/api.js";

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
const pricePerPerson = 30000; // 1인당 가격 (백엔드에서 내려주는게 제일 좋음)

const totalPrice = computed(() => count.value * pricePerPerson);

const plus = () => count.value++;
const minus = () => { if (count.value > 1) count.value--; };

/* ====== Toss 결제 위젯 관련 ====== */

// 실제 ck 키로 교체 (test_ck... 또는 live_ck...)
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "024caaaa-a8f2-4cab-9b8b-7502d6ff21c8"; // 유저 PK 등 고유키로 교체

const showPaymentWidget = ref(false);
const tossWidgets = ref(null);

/** Toss SDK 로딩 */
const loadTossScript = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 재사용
    if (window.TossPayments) {
      try {
        const tossPayments = window.TossPayments(clientKey);
        resolve(tossPayments);
      } catch (e) {
        reject(e);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.onload = () => {
      try {
        const tossPayments = window.TossPayments(clientKey);
        resolve(tossPayments);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/** 위젯 초기화 (한 번만) */
const initTossWidget = async () => {
  // 이미 만들어져 있으면 금액만 업데이트하고 끝
  if (tossWidgets.value) {
    await tossWidgets.value.setAmount({
      value: totalPrice.value,
      currency: "KRW",
    });
    return;
  }

  const tossPayments = await loadTossScript();
  const widgets = tossPayments.widgets({ customerKey });

  // 금액 설정
  await widgets.setAmount({
    value: totalPrice.value,
    currency: "KRW",
  });

  // 결제수단 영역 렌더
  await widgets.renderPaymentMethods({
    selector: "#payment-method",
  });

  // 약관 영역 렌더
  await widgets.renderAgreement({
    selector: "#agreement",
  });

  tossWidgets.value = widgets;
};

/** 1단계: 예약 버튼 — 위젯 영역 열기 + 위젯 초기화 */
const handleReserve = async () => {
  showPaymentWidget.value = true;

  // DOM 에 #payment-method / #agreement 가 생긴 이후에 렌더해야 함
  await nextTick();

  try {
    await initTossWidget();
  } catch (e) {
    console.error("[Toss widget init error]", e);
    alert("결제 위젯 초기화 중 오류가 발생했습니다.");
  }
};

/** 2단계: 결제하기 버튼 — 실제 requestPayment 호출 */
const requestPayment = async () => {
  if (!tossWidgets.value) return;

  try {

    const reservationDto = {
      viewingCode: 3,          // 또는 route.params.viewingCode
      userCode: 6,                       // TODO: 실제 로그인 유저 코드로 대체       // 예약 인원
      viewingPayPrice: totalPrice.value,          // 총 금액
    };

    const result= await userViewingReservation(reservationDto);

    // 혹시 인원/금액이 변경되었을 수 있으니 다시 한 번 금액 세팅
    await tossWidgets.value.setAmount({
      value: totalPrice.value,
      currency: "KRW",
    });

    await tossWidgets.value.requestPayment({
      orderId:result,        // 실제로는 서버에서 받은 주문번호 사용 권장
      orderName: viewName.value || "관람 예약",
      successUrl: window.location.origin + "/api/viewingPay/success",
      failUrl: window.location.origin + "/pay/fail",
      // 필요하면 customerEmail, customerName 등 추가
    });
  } catch (e) {
    if (e?.code === "USER_CANCEL") {
      console.log("사용자가 결제를 취소했습니다.", e);
      return;
    }
    console.error("[requestPayment error]", e);
    alert("결제 호출 중 오류가 발생했습니다.");
  }
};

/* ====== 서버 요청 ====== */
/* ====== 서버 조회 ====== */
onMounted(async () => {
  const viewingId = 3; // 실제 라우터 파라미터 등으로 교체
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
