<!-- PaymentList.vue -->
<script setup>
import { ref, onMounted } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import { viewingPayList } from "@/api/api.js";

const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const errorMessage = ref("");
const payments = ref([]);
const totalElements = ref(0);

const loadViewingPayLog = async () => {

  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await viewingPayList(1, {
      page: currentPage.value - 1, // ✅ Spring은 0부터, UI는 1부터라 -1
      size: pageSize.value,
    });
    const pageData = res.data.data;

    const statusLabelMap = {
      approve: "결제 완료됨",
      waiting: "결제 대기",
      cancel: "결제 취소됨",
    };

    payments.value = pageData.content.map((log, idx) => ({
      id: pageData.number * pageData.size + idx + 1,  // 전체 순번으로 만들고 싶으면
      orderNo: log.orderId,
      amount: `${log.viewingPayPrice.toLocaleString()}원`,
      desc: log.viewingTitle,
      status: statusLabelMap[log.viewingPayStatus] || log.viewingPayStatus,
      paidAt: log.createdAt.substring(0, 10),
    }));

    totalElements.value = pageData.totalElements;
    pageSize.value = pageData.size; // 서버에서 size를 바꿀 수도 있으니 동기화
  } catch (e) {
    console.error(e);
    errorMessage.value = e.message || "결제 목록 조회 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
}

const handlePageChange = (page) => {
  currentPage.value = page;
  loadViewingPayLog();
};

onMounted(() => {
  loadViewingPayLog();
});
</script>

<template>
  <div class="payment-page">
    <div class="payment-body">
      <!-- 왼쪽 사이드바 -->
      <aside class="payment-sidebar">
        <SidebarUser />
      </aside>

      <!-- 오른쪽 컨텐츠 -->
      <main class="payment-content">
        <h1 class="page-title">내 결제 목록</h1>

        <!-- 에러 / 로딩 표시 -->
        <p v-if="loading">로딩 중...</p>
        <p v-else-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <!-- 결제 테이블 -->
        <section class="table-section">
          <!-- 위에꺼처럼 테이블 래퍼 추가 (가로 스크롤용) -->
          <div class="table-wrapper">
            <el-table
                class="payment-table"
                :data="payments"
                border
                v-loading="loading"
            >
              <el-table-column
                  prop="orderNo"
                  label="주문 번호"
                  min-width="230"
              />
              <el-table-column
                  prop="amount"
                  label="금액"
                  min-width="120"
                  align="center"
              />
              <el-table-column
                  prop="desc"
                  label="결제 내용"
                  min-width="220"
              />
              <el-table-column
                  prop="status"
                  label="처리 상태"
                  min-width="140"
                  align="center"
              >
                <template #default="scope">
                  <span
                      :class="[
                      'status-text',
                      { 'status-cancel': scope.row.status === '결제 취소됨' },
                    ]"
                  >
                    {{ scope.row.status }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="paidAt"
                  label="결제일"
                  min-width="140"
                  align="center"
              />
            </el-table>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination-wrapper">
            <el-pagination
                :total="totalElements"
                :page-size="pageSize"
                :current-page="currentPage"
                layout="prev, pager, next"
                @current-change="handlePageChange"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypageviewingpaylog.css";
</style>
