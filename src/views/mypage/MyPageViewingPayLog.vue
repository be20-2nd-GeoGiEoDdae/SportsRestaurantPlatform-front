<!-- PaymentList.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import Label from "@/components/shared/basic/Label.vue";
import Checkbox from "@/components/shared/form/Checkbox.vue";
import {viewingPayList} from "@/api/api.js";

const payments = ref([
  {
    id: 1,
    orderNo: "log.viewingPayPrice",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 완료됨",
    paidAt: "2025/12/03",
  },
  {
    id: 2,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 완료됨",
    paidAt: "2025/12/03",
  },
  {
    id: 3,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 완료됨",
    paidAt: "2025/12/03",
  },
  {
    id: 4,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 완료됨",
    paidAt: "2025/12/03",
  },
  {
    id: 5,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 완료됨",
    paidAt: "2025/12/03",
  },
  {
    id: 6,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "결제 취소됨",
    paidAt: "2025/12/03",
  },
  {
    id: 7,
    orderNo: "SEF123_1232EFAS",
    amount: "12300원",
    desc: "12/11 미분당 참가",
    status: "예치금 반환됨",
    paidAt: "2025/12/03",
  },
]);

const currentPage = ref(1);
const canvasRef = ref(null);
const loading= ref(false);
const errorMessage= ref('');
const viewingLog=ref(null);

const loadViewingPayLog = async()=>{
  loading.value =true;
  errorMessage.value='';

  try{
    const result=await viewingPayList(1);
    viewingLog.value=result;
  } catch(e) {
    console.error(e);
    errorMessage.value = e.message || '상세 조회 중 오류가 발생했습니다'
  } finally {
    loading.value = false;  // api 호출 종료
  }

};

const handlePageChange = (page) => {
  currentPage.value = page;
  // TODO: 서버 페이징 연동
};

const baseWidth = 1024;
const baseHeight = 768;

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
loadViewingPayLog()
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
      <div class="payment-page">
        <!-- 상단 바 -->

        <!-- 메인 레이아웃 -->
        <div class="main-layout">
          <!-- 왼쪽 사이드 메뉴 -->
          <aside class="side-menu">
            <SidebarUser/>
          </aside>

          <!-- 오른쪽 컨텐츠 -->
          <main class="payment-main">
            <h2 class="page-title">내 결제 목록</h2>
            <div class="title-divider"></div>
<!--            <div v-if="viewingLog">
              <p>{{viewingLog.viewingPayPrice}}</p>
            </div>-->

            <section class="table-section">
              <el-table
                  class="payment-table"
                  :data="payments"
                  border
              >
                <el-table-column
                    prop="orderNo"
                    label="주문 번호"
                    width="230"
                />
                <el-table-column
                    prop="amount"
                    label="금액"
                    width="120"
                    align="center"
                />
                <el-table-column
                    prop="desc"
                    label="결제 내용"
                />
                <el-table-column
                    prop="status"
                    label="처리 상태"
                    width="140"
                    align="center"
                >
                  <template #default="scope">
                    <span
                        :class="[
                        'status-text',
                        {
                          'status-cancel': scope.row.status === '결제 취소됨',
                          'status-refund': scope.row.status === '예치금 반환됨',
                        },
                      ]"
                    >
                      {{ scope.row.status }}
                    </span>
                  </template>

                </el-table-column>
                <el-table-column
                    prop="paidAt"
                    label="결제일"
                    width="140"
                    align="center"
                />
              </el-table>
            </section>

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
@import "@/assets/mypage/mypageviewingpaylog.css";
</style>
