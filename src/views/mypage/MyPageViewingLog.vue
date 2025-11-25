<template>
  <div class="view-history-layout">
    <!-- 좌측 사이드바 -->
    <aside class="sidebar">
      <SidebarUser/>
    </aside>

    <!-- 메인 -->
    <main class="content">

      <!-- 본문 -->
      <section class="main-section">

        <h2 class="page-title">관람 내역</h2>

        <!-- 검색창 -->
        <el-input
            v-model="keyword"
            placeholder="관람 키워드를 입력해주세요"
            class="search-box"
            :prefix-icon="Search"
        />

        <!-- 카드 리스트 (상태별 묶음 없음) -->
        <div
            class="history-card"
            v-for="(item, idx) in paginated"
            :key="'item-' + idx"
        >
          <!-- 상태 라벨 -->
          <div
              class="status-label"
              :class="{ done: item.status === 'done', wait: item.status === 'wait' }"
          >
            {{ item.status === 'done' ? '관람 완료' : '관람 예약 중' }}
            <div class="date">관람일시 : {{ item.date }}</div>
          </div>


          <div class="card-body">
            <div class="left-img">
              <img src="https://via.placeholder.com/90" />
            </div>

            <div class="center-info">
              <div class="title">{{ item.title }}</div>
              <div class="info">카테고리 : {{ item.category }}</div>
              <div class="info">위치 : {{ item.address }}</div>
            </div>

            <div class="right-info">

              <el-button type="primary" size="small" plain>
                관람 상세 내역
              </el-button>

              <el-button
                  v-if="item.status === 'done'"
                  type="info"
                  size="small"
                  plain
                  @click="goReview"
              >
                리뷰 작성
              </el-button>

              <el-button
                  v-if="item.status === 'wait'"
                  type="danger"
                  size="small"
                  plain
                  @click="openCancelOverlay"
              >
                예약 취소
              </el-button>

              <el-button
                  v-if="item.status === 'done'"
                  type="danger"
                  size="small"
                  plain
                  @click="openReportOverlay(item)"
              >
                가게 신고
              </el-button>
            </div>
          </div>
        </div>


        <div v-if="showCancelOverlay" class="cancel-overlay">
          <div class="cancel-dialog">
            <h3 class="cancel-title">결제를 취소 하시겠습니까?</h3>

            <p class="cancel-text">
              관람일로부터 일주일 보다 이전에 결제 시 전액 환불 되며<br />
              관람일 하루 전부터 3일 이내에 환불 시 결제 금액의 50%만 환불 됩니다.
            </p>

            <p class="cancel-text cancel-text--strong">
              그래도 취소 하시겠습니까?
            </p>

            <div class="cancel-buttons">
              <el-button class="btn-keep" @click="closeCancelOverlay">
                결제 유지
              </el-button>
              <el-button class="btn-cancel-final" @click="confirmCancel">
                예약 취소
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="showReportOverlay" class="report-overlay">
          <div class="report-dialog">
            <h3 class="report-title">가게 신고</h3>

            <div class="report-section">
              <p class="report-label">신고 사유</p>
              <el-radio-group
                  v-model="reportForm.reason"
                  class="report-radio-group"
              >
                <el-radio label="신고 완료">신고 완료</el-radio>
                <el-radio label="예약 불이행">예약 불이행</el-radio>
                <el-radio label="요금 문제">요금 문제</el-radio>
                <el-radio label="서비스 불만">서비스 불만</el-radio>
                <el-radio label="기타">기타</el-radio>
              </el-radio-group>
            </div>

            <div class="report-section">
              <p class="report-label">상세 내용</p>
              <el-input
                  v-model="reportForm.detail"
                  type="textarea"
                  :rows="3"
                  placeholder="신고 내용을 입력해주세요."
              />
            </div>

            <div class="report-buttons">
              <el-button class="btn-cancel" @click="closeReportOverlay">
                취소
              </el-button>
              <el-button
                  type="primary"
                  class="btn-submit"
                  @click="submitReport"
              >
                신고 접수
              </el-button>
            </div>
          </div>
        </div>

        <div class="pagination-wrapper">
          <el-pagination
              :total="100"
              :page-size="10"
              :current-page="currentPage"
              layout="prev, pager, next"
              @current-change="handlePageChange"
          />
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import router from "@/router/index.js";

/* 전체 데이터 */
const items = ref([
  { status: "done", title: "삼성 롯데 경기 단체 관람", category: "오스테이", address: "서울시 동작구...", date: "25-11-13 / 13:30" },
  { status: "wait", title: "기아 LG 경기 관람", category: "스테이", address: "서울 송파구...", date: "25-11-14 / 11:00" },
  { status: "done", title: "롯데 SSG 경기", category: "오스테이", address: "서울 강남구...", date: "25-10-02 / 18:00" },
  { status: "wait", title: "삼성 KT 경기", category: "경기관람", address: "서울 강동구...", date: "25-11-01 / 14:00" },
  { status: "done", title: "두산 NC 경기", category: "관람권", address: "부산 해운대...", date: "25-09-20 / 10:00" },
  { status: "wait", title: "한화 KIA 경기", category: "오스테이", address: "대전 중구...", date: "25-08-11 / 15:20" }
]);

const showCancelOverlay = ref(false);

const openCancelOverlay = () => {
  showCancelOverlay.value = true;
};

const closeCancelOverlay = () => {
  showCancelOverlay.value = false;
};

const confirmCancel = () => {
  console.log("예약 취소 실행");
  showCancelOverlay.value = false;
};







/* 검색 */
const keyword = ref("");

/* 페이지 */

const showReportOverlay = ref(false);
const reportTarget = ref(null);
const reportForm = ref({
  reason: "",
  detail: "",
});

const openReportOverlay = (ticket) => {
  reportTarget.value = ticket;
  reportForm.value.reason = "";
  reportForm.value.detail = "";
  showReportOverlay.value = true;
};

const closeReportOverlay = () => {
  showReportOverlay.value = false;
};

const submitReport = () => {
  console.log("가게 신고", {
    target: reportTarget.value,
    ...reportForm.value,
  });
  // TODO: 신고 API 호출
  showReportOverlay.value = false;
};

/* 페이지당 3개 */
const page = ref(1);
const paginated = computed(() => {
  const start = (page.value - 1) * 3;
  return items.value.slice(start, start + 3);
});

const goReview = ()=>{
  router.replace('/MyPage/Review/Edit');
}
</script>

<style scoped>
/* 전체 레이아웃 동일 */
@import "@/assets/mypage/mypageviewinglog.css";
</style>
