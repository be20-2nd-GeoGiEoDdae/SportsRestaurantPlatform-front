<template>
  <div class="reservation-wrapper">

    <!-- ================= CONTENT ================= -->
    <div class="content">

      <!-- 타이틀 -->
      <h2 class="section-title">예약</h2>

      <!-- ================= 관람 정보 ================= -->
      <section class="info-box">
        <h3 class="info-title">관람 정보</h3>

        <div class="view-info">
          <img
              class="store-img"
              :src="storeImage"
              alt="store"
          />

          <div class="view-text">
            <p>가게 이름 : {{ storeName }}</p>
            <p>관람 제목 : {{ viewingTitle }}</p>
            <p>주소 : {{ address }}</p>
          </div>
        </div>
      </section>

      <!-- ================= 회원 정보 ================= -->
      <section class="info-box">
        <h3 class="info-title">회원 정보</h3>

        <div class="member-info">
          <p>이름 : {{ userName }}</p>
          <p>이메일 : {{ userEmail }}</p>
          <p>전화번호 : {{ userPhone }}</p>
        </div>
      </section>

      <!-- ================= 결제 ================= -->
      <section class="info-box pay-box">
        <h3 class="info-title">결제</h3>

        <p class="method-label">결제수단 선택</p>

        <div class="pay-flex">
          <!-- 왼쪽: Toss -->
          <div class="toss-wrap">
            <img :src="toss" class="toss-icon" />
          </div>

          <!-- 가운데: 총 결제 금액 -->
          <div class="price-wrap">
            <p class="total-price">
              총 결제 금액 :
              <strong>{{ totalPrice.toLocaleString() }} 원</strong>
            </p>
          </div>

          <!-- 오른쪽: 결제 버튼 -->
          <div class="button-wrap">
            <button class="pay-btn" @click="onPay">결제</button>
          </div>
        </div>

        <!-- 환불 안내 -->
        <p class="refund-info">
          관람일 7일 전까지는 전액 환불 가능하며, 이후에는 환불이 불가합니다.
        </p>
      </section>

    </div>
  </div>
</template>

<script>
import tossImg from "@/assets/logo/toss.jpg";

export default {
  name: "ReservationPage",

  data() {
    return {
      toss: tossImg,

      storeName: "역전할머니 맥주 1982",
      viewingTitle: "따뜻한 분위기에서 경기 보며 즐기는 로컬 맛집",
      address: "서울특별시 중구 태평로1가 31",
      storeImage:
          "/mnt/data/33c06ce3-398e-4c11-ad05-174a1eec582b.png",

      userName: "---",
      userEmail: "xxxxxx@xxxxxx.com",
      userPhone: "010-xxxx-xxxx",

      totalPrice: 30000,
    };
  },

  methods: {
    onPay() {
      alert("결제 로직 연결 예정!");
    },
  },
};
</script>

<style scoped>

.content {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 30px;
}

.info-box {
  background: #fff;
  border: 1px solid #ddd;
  padding: 25px;
  margin-bottom: 40px;
  border-radius: 8px;
}

.info-title {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 700;
}

/* 관람 정보 */
.view-info {
  display: flex;
  gap: 20px;
}

.store-img {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

/* 회원 정보 */
.member-info p {
  margin: 6px 0;
}

/* 결제 */
.method-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* ✨ 핵심: 한 줄 배치 */
.pay-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 5px;
}

/* 왼쪽 Toss */
.toss-wrap {
  flex: 1;
}
.toss-icon {
  width: 120px;
  height: auto;
}

/* 가운데 가격 */
.price-wrap {
  flex: 1;
  text-align: center;
}

/* 오른쪽 버튼 */
.button-wrap {
  flex: 1;
  text-align: right;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
}

.pay-btn {
  background: #4bb8ff;
  border: none;
  padding: 12px 36px;
  color: #fff;
  font-size: 17px;
  border-radius: 20px;
  cursor: pointer;
}

.refund-info {
  margin-top: 18px;
  font-size: 13px;
  color: #888;
  text-align: center;
}
</style>
