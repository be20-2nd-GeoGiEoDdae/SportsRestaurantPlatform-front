<!-- SubscriptionPayment.vue -->
<script setup>
import { ref, computed } from "vue";

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

const handlePay = () => {
  console.log("정기 결제 실행", {
    plan: "월 구독",
    amount: monthlyPrice,
    method: paymentMethod.value,
  });
  // TODO: 실제 결제 API 연동
};
</script>

<template>
  <div class="sub-page">

    <!-- 본문 -->
    <main class="main-area">
      <div class="main-inner">
        <h2 class="page-title">정기 결제</h2>

        <!-- 사업자 정보 -->
        <section class="section">
          <h3 class="section-title">사업자 정보</h3>
          <el-card class="biz-card" shadow="never">
            <p>이름 : {{ business.name }}</p>
            <p>이메일 : {{ business.email }}</p>
            <p>전화번호 : {{ business.phone }}</p>
          </el-card>
        </section>

        <!-- 정기 구독 선택 (월 구독 10,000원만) -->
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
    </main>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagesubscriberegister.css";
</style>
