<!-- src/views/entrepreneur/SubscriptionHistory.vue -->
<script setup>
import { ref, onMounted } from "vue";
import SidebarEntrepreneur from "@/components/shared/sidebar/entrepreneur/SidebarEntrepreneur.vue";
import router from "@/router/index.js";
import { subscribeLogList } from "@/api/api.js";

const tableData = ref([]);
const currentRow = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalElements = ref(0);
const loading = ref(false);
const errorMessage = ref("");

/** 구독 결제 내역 조회 */
const loadingSubscribeLog = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await subscribeLogList(5,{
      page:currentPage.value-1,
      size:pageSize.value
    });
    const pageData=res.data.data;

    tableData.value = pageData.content.map((log, idx) => ({
      id: idx + 1, // 또는 log.entrepreneurSubscribeOrderId 사용
      orderId: log.entrepreneurSubscribeOrderId,
      amount: `${log.entrepreneurSubscribePayment.toLocaleString()}원`,
      createAt: log.entrepreneurSubscribeUpdatedAt.substring(0, 10),
      endAt: log.entrepreneurSubscribeEndAt.substring(0, 10),

    }));
    totalElements.value = pageData.totalElements;
    pageSize.value = pageData.size;
  } catch (e) {
    console.error(e);
    errorMessage.value = e.message || "구독 결제 내역 조회 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

const handleCurrentChange = (row) => {
  currentRow.value = row;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadingSubscribeLog();
};

const editPaymentInfo = () => {
  router.push({ name: "MyPage-SubscribeCancel" });
};

onMounted(() => {
  loadingSubscribeLog();
});
</script>

<template>
  <div class="sublog-page">
    <div class="sublog-body">
      <!-- 왼쪽 사이드바 -->
      <aside class="sublog-sidebar">
        <SidebarEntrepreneur />
      </aside>

      <!-- 오른쪽 컨텐츠 -->
      <main class="sublog-content">
        <h1 class="page-title">내 구독 결제 내역</h1>

        <!-- 상단 안내 카드 -->
        <section class="header-section">
          <div class="header-card">
            <p class="next-billing">
              다음 정기 결제 예정일은
              <strong>2025년 1월 03일</strong>
              입니다.
            </p>
          </div>
        </section>

        <!-- 에러 / 로딩 -->
        <p v-if="loading">로딩 중...</p>
        <p v-else-if="errorMessage" class="error-text">
          {{ errorMessage }}
        </p>

        <!-- 테이블 영역 -->
        <section class="table-section">
          <div class="table-header">
            <el-button
                size="small"
                class="edit-pay-btn"
                @click="editPaymentInfo"
            >
              구독 결제 해지
            </el-button>
          </div>

          <div class="table-wrapper">
            <el-table
                class="history-table"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                @current-change="handleCurrentChange"
            >
              <el-table-column
                  prop="orderId"
                  label="주문 번호"
                  min-width="220"
              />
              <el-table-column
                  prop="amount"
                  label="결제 금액"
                  min-width="120"
                  align="center"
              />
              <el-table-column
                  prop="createAt"
                  label="결제일"
                  min-width="140"
                  align="center"
              />
              <el-table-column
                  prop="endAt"
                  label="구독 종료일"
                  min-width="140"
                  align="center"
              />
            </el-table>
          </div>

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
@import "@/assets/mypage/mypagesubscribelog.css";
</style>
