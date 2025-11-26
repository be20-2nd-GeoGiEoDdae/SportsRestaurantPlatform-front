<!-- SubscriptionPayment.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { getSubscribeBillingInfo } from "@/api/api.js"; // 아까 만든 API 래퍼

// 사업자 정보 (필요하면 API로 같이 가져와도 되고)
const business = ref({
  name: "---",
  email: "xxxxxx@xxxxxx.com",
  phone: "010-xxxx-xxxx",
});

const monthlyPrice = 10000;
const paymentMethod = ref("toss");

const formattedPrice = computed(
    () => monthlyPrice.toLocaleString("ko-KR") + "원"
);

// ==== Toss 관련 상태 ====
const clientKey = ref("test_ck_BX7zk2yd8yJKq5wYZkJX3x9POLqK");
const customerKey = ref("");
const customerName = ref("");
const customerEmail = ref("");

const tossPayments = ref(null);
const payment = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// 페이지 진입 시 서버에서 결제/billing 정보 가져오기 + Toss 초기화
onMounted(async () => {
  try {
    loading.value = true;

    // 1) 서버에서 billing info 가져오기
    customerKey.value = '9ab22c97-2aee-4b23-8714-7561289f3efc';

    // 2) TossPayments 전역 객체 확인
    if (!window.TossPayments) {
      throw new Error("TossPayments SDK가 로드되지 않았습니다.");
    }

    // 3) TossPayments 인스턴스 생성
    tossPayments.value = window.TossPayments(clientKey.value);

    // 4) billing 전용 payment 인스턴스
    payment.value = tossPayments.value.payment({ customerKey: customerKey.value });
  } catch (e) {
    console.error(e);
    errorMessage.value =
        e.message || "결제 정보를 불러오는 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
});

// 결제 버튼 클릭
const handlePay = async () => {
  console.log("origin:", window.location.origin);
  const successUrl = window.location.origin + "/api/subscribe/billingKey/success";
  console.log("successUrl:", successUrl);
  if (paymentMethod.value !== "toss") {
    // 다른 결제수단 추가되면 분기
    return;
  }

  if (!payment.value) {
    alert("결제 초기화가 아직 완료되지 않았습니다.");
    return;
  }

  try {
    loading.value = true;
    await payment.value.requestBillingAuth({
      method: "CARD",
      successUrl: window.location.origin + "/api/subscribe/billingKey/success",
      failUrl: window.location.origin + "/api/subscribe/fail",
      // 여기 이름/이메일은 Toss에서 보여주는 정보
      customerName: customerName.value,
      customerEmail: customerEmail.value,
    });
    // 주의: 여기 아래 코드는 거의 실행 안 될 수도 있음.
    // Toss 결제창으로 넘어갔다가 성공/실패 시 successUrl/failUrl로 리디렉트되기 때문.
  } catch (error) {
    // Toss SDK 에러 처리
    console.error(error);

    // 예: 사용자가 결제창 닫은 경우 등
    if (error.code === "USER_CANCEL") {
      // 사용자가 창 닫은 경우
      return;
    }
    alert(error.message || "결제 요청 중 오류가 발생했습니다.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="sub-page">
    <main class="main-area">
      <div class="main-inner">
        <div class="sub-card">
          <h2 class="page-title">정기 결제</h2>

          <!-- 에러 표시 -->
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <!-- 사업자 정보 -->
          <section class="section">
            <h3 class="section-title">사업자 정보</h3>
            <el-card class="biz-card" shadow="never">
              <p>이름 : {{ business.name }}</p>
              <p>이메일 : {{ business.email }}</p>
              <p>전화번호 : {{ business.phone }}</p>
            </el-card>
          </section>

          <!-- 정기 구독 선택 -->
          <section class="section">
            <div class="plan-wrapper">
              <div class="plan-card plan-card--active">
                <div class="plan-label">월 구독</div>
                <div class="plan-price">
                  <span>{{ formattedPrice }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 결제 수단 + 결제 금액 -->
          <section class="section">
            <h3 class="section-title">결제</h3>

            <div class="pay-method-box">
              <p class="pay-method-label">결제수단 선택</p>

              <el-radio-group v-model="paymentMethod" class="method-group">
                <el-radio label="toss">
                  <span class="method-pill">toss</span>
                </el-radio>
              </el-radio-group>
            </div>

            <div class="pay-footer">
              <span class="pay-amount">
                결제 금액 : <strong>{{ formattedPrice }}</strong>
              </span>
              <el-button
                  type="primary"
                  class="pay-button"
                  :loading="loading"
                  @click="handlePay"
              >
                결제
              </el-button>
            </div>

            <p class="notice-text">
              월 구독 상품은 언제든지 해지 가능하며, 해지 시 익월 결제부터 중단됩니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  </div>

</template>

<style scoped>
@import "@/assets/mypage/mypagesubscriberegister.css";

.error-text {
  color: #ff4d4f;
  margin-bottom: 8px;
}
</style>
