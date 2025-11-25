<!-- SubscriptionHistory.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SidebarEntrepreneur from "@/components/shared/sidebar/entrepreneur/SidebarEntrepreneur.vue";

const tableData = ref([
  {
    id: 1,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/12/03",
  },
  {
    id: 2,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/11/03",
  },
  {
    id: 3,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/10/03",
  },
  {
    id: 4,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/09/03",
  },
  {
    id: 5,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/08/03",
  },
  {
    id: 6,
    productCode: "SEFP33_1322FA5",
    amount: "123,000원",
    planName: "서빙형 정기 결제",
    paidAt: "2025/07/03",
  },
]);

const currentRow = ref(null);
const currentPage = ref(1);

const handleCurrentChange = (row) => {
  currentRow.value = row;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // TODO: 서버에서 해당 페이지 데이터 가져오기
};

const goMain = () => {
  // TODO: 메인 페이지로 이동 (vue-router 사용 시)
  console.log("메인 페이지로 이동");
};

const editPaymentInfo = () => {
  // TODO: 결제 정보 수정 화면 이동
  console.log("결제 정보 수정");
};

/* ===== 고정 캔버스 스케일링 ===== */
const baseWidth = 1024;
const baseHeight = 768;
const canvasRef = ref(null);

const updateScale = () => {
  const el = canvasRef.value;
  if (!el) return;

  const scale = Math.min(
      window.innerWidth / baseWidth,
      window.innerHeight / baseHeight
  );
  el.style.transform = `scale(${scale})`;
};

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScale);
});
</script>

<template>
  <div class="viewport">
    <div class="canvas" ref="canvasRef">
      <div class="history-page">

        <!-- 본문 -->
        <div class="main-layout">
          <aside class="side-menu">
            <sidebar-entrepreneur/>
          </aside>
          <!-- 왼쪽 메뉴 -->


          <!-- 오른쪽 내용 -->
          <main class="history-main">
            <div class="history-header">
              <h2 class="history-title">내 구독 결제 내역</h2>
              <p class="next-billing">
                다음 정기 결제 예정일은 <strong>2025년 1월 03일</strong> 입니다.
              </p>
            </div>

            <div class="table-header">
              <div class="table-header-spacer" />
              <el-button
                  size="small"
                  class="edit-pay-btn"
                  @click="editPaymentInfo"
              >
                결제 정보 수정
              </el-button>
            </div>

            <el-table
                class="history-table"
                :data="tableData"
                border
                highlight-current-row
                @current-change="handleCurrentChange"
            >
              <el-table-column
                  prop="productCode"
                  label="상품 번호"
                  width="220"
              />
              <el-table-column prop="amount" label="금액" width="120" />
              <el-table-column prop="planName" label="상품 내용" />
              <el-table-column
                  prop="paidAt"
                  label="결제일"
                  width="140"
                  align="center"
              />
            </el-table>

            <div class="pagination-wrapper">
              <el-pagination
                  :total="100"
                  :page-size="10"
                  :current-page="currentPage"
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagesubscribelog.css";
</style>
