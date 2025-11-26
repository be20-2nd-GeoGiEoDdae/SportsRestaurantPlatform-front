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

        <section class="history-section">

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
            v-for="viewing in viewingList"
            :key="'item-' + viewing.id"
        >
          <!-- 상태 라벨 -->
          <div
              class="status-label"
              :class="{ done: viewing.status === 'true', wait: viewing.status === 'false' }"
          >
            {{ viewing.status ? '관람 완료' : '관람 예약 중' }}
            <div class="date">관람일시 : {{ viewing.viewingAt }}</div>
          </div>


          <!--          <div class="card-body">
                      <div class="left-img">
                        <img src="https://via.placeholder.com/90"/>
                      </div>-->
          <div class="card-body">
            <div class="left-img"><img
                v-if="viewing.pictures && viewing.pictures.length"
                :src="viewing.pictures[0]"
                class="thumb-img"
                alt="관람 썸네일"
            />
              <span v-else>사진 없음</span>
            </div>

            <div class="center-info">
              <div class="title">{{ viewing.title }}</div>
              <div class="info">가격 : {{ viewing.amount }}</div>
              <div class="info">위치 : {{ viewing.location }}</div>
            </div>

            <div class="right-info">

              <el-button
                  type="primary" size="small" plain
                  @click="goViewingDetail(viewing)">
                관람 상세 내역
              </el-button>

              <el-button
                  v-if="!viewing.status"
                  type="info"
                  size="small"
                  plain
                  @click="goReview"
              >
                리뷰 작성
              </el-button>

              <el-button
                  v-if="!viewing.status"
                  type="danger"
                  size="small"
                  plain
                  @click="openCancelOverlay(viewing)"
              >
                예약 취소
              </el-button>

              <el-button
                  v-if="!viewing.status"
                  type="danger"
                  size="small"
                  plain
                  @click="openReportOverlay(viewing)"
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
              관람일로부터 일주일 보다 이전에 결제 시 전액 환불 되며<br/>
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
              :total="totalElements"
              :page-size="pageSize"
              :current-page="currentPage"
              layout="prev, pager, next"
              @current-change="handlePageChange"
          />
        </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {Search} from "@element-plus/icons-vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import router from "@/router/index.js";
import {cancelViewing, createReport, viewingLogList} from "@/api/api.js";

const viewingList = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const selectedViewing = ref(null);
const currentPage= ref(1);
const pageSize =ref(10);
const totalElements=ref(0);

const getImageUrl = (path) => {
  if (!path) {
    return "/images/no-image.png";
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `http://localhost:8080${path}`;
};

const REPORT_TYPE_CODE_MAP = {
  "신고 완료": 1,
  "예약 불이행": 2,
  "요금 문제": 3,
  "서비스 불만": 4,
  "기타": 5,
};

const loadingViewingLog = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await viewingLogList(1,{
      page: currentPage.value - 1, // ✅ Spring은 0부터, UI는 1부터라 -1
          size: pageSize.value,
    });
    const pageData = res.data.data;

    viewingList.value = pageData.content.map((log, idx) => {
      const pictures = log.pictureUrls ? log.pictureUrls.split(",").map(
          (u) => getImageUrl(u.trim())) : [];
      return {
        id: idx + 1,                                    // 또는 log.orderId 써도 됨
        status: !!log.viewingUserIsAttend,
        amount: `${log.viewingUserDeposit.toLocaleString()}원`, // 금액
        title: log.viewingTitle,                         // 결제 내용
        location: log.restaurantLocation,
        viewingAt: log.viewingAt.substring(0, 10), // '2025-11-25' 형태로 잘라서 사용
        viewingCode: log.viewingCode,
        restaurantCode: log.restaurantCode,
        pictures, // 🔹 카드에서 쓸 이미지 배열
      };
    });
    totalElements.value = pageData.totalElements;
    pageSize.value = pageData.size;
  } catch (e) {
    console.error(e);
    errorMessage.value = e.message || '관람 내역 조회 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

const showCancelOverlay = ref(false);

const openCancelOverlay = (viewing) => {
  selectedViewing.value = viewing;
  showCancelOverlay.value = true;
};

const closeCancelOverlay = () => {
  selectedViewing.value = null;
  showCancelOverlay.value = false;
};

const confirmCancel = async () => {
  if (!selectedViewing.value) {
    return;
  }

  try {
    // viewingCode로 취소 API 호출
    await cancelViewing(selectedViewing.value.viewingCode, 1);

    // 취소 후 목록 다시 로딩 (또는 로컬에서 상태만 변경해도 됨)
    await loadingViewingLog();

    showCancelOverlay.value = false;
    selectedViewing.value = null;
  } catch (e) {
    console.error("예약 취소 실패", e);
    // 필요하면 에러 메시지 노출
    errorMessage.value = e.message || "예약 취소 중 오류가 발생했습니다.";
  }
}

/* 검색 */
const keyword = ref("");

const showReportOverlay = ref(false);
const reportTarget = ref(null);
const reportForm = ref({
  reason: "",
  detail: "",
});

const handlePageChange = (page) => {
  currentPage.value = page;
  loadingViewingLog();
};

const openReportOverlay = (ticket) => {
  reportTarget.value = ticket;
  reportForm.value.reason = "";
  reportForm.value.detail = "";
  showReportOverlay.value = true;
};

const closeReportOverlay = () => {
  showReportOverlay.value = false;
  reportTarget.value = null;
};

const submitReport = async () => {
  if (!reportTarget.value) {
    return;
  }

  // 사유 / 내용 간단 검증
  if (!reportForm.value.reason) {
    alert("신고 사유를 선택해주세요.");
    return;
  }
  if (!reportForm.value.detail) {
    alert("신고 내용을 입력해주세요.");
    return;
  }

  // reason(라디오 값) → reportTypeCode(숫자) 변환
  const reportTypeCode = REPORT_TYPE_CODE_MAP[reportForm.value.reason];
  if (!reportTypeCode) {
    alert("알 수 없는 신고 사유입니다.");
    return;
  }

  const dto = {
    reportContents: reportForm.value.detail,                     // 신고 내용
    restaurantCode: Number(reportTarget.value.restaurantCode),   // 가게 코드
    reportTypeCode: Number(reportTypeCode),                      // 신고 타입 코드
  };

  try {
    await createReport(1, dto);   // ★ 신고 API 호출

    alert("신고가 접수되었습니다.");
    showReportOverlay.value = false;
    reportTarget.value = null;
  } catch (e) {
    console.error("신고 접수 실패", e);
    alert(e.message || "신고 접수 중 오류가 발생했습니다.");
  }
};



const goReview = () => {
  router.replace('/MyPage/Review/Edit');
}
const goViewingDetail = (viewing) => {
  router.push(`/restaurant/detailed/${viewing.viewingCode}`);
};
onMounted(() => {
  loadingViewingLog();
})
</script>

<style scoped>
/* 전체 레이아웃 동일 */
@import "@/assets/mypage/mypageviewinglog.css";
</style>
