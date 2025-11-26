<template>
  <div class="notice-wrapper">
    <h2 class="page-title">공지사항</h2>

    <div class="notice-box">
      <!-- 테이블 헤더 -->
      <div class="table-header">
        <span class="th title">제목</span>
        <span class="th date">작성일</span>
      </div>

      <!-- 공지 리스트 -->
      <div
          class="table-row row-click"
          v-for="n in notices"
          :key="n.announcementCode"
          @click="goDetail(n.announcementCode)"
      >
        <span class="td title">{{ n.announcementTitle }}</span>
        <span class="td date">{{ formatDate(n.createdAt) }}</span>
      </div>

      <!-- 데이터 없을 때 -->
      <div v-if="notices.length === 0" class="empty">
        등록된 공지사항이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const notices = ref([]);

// 날짜 포맷터
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return dateStr.substring(0, 10); // yyyy-MM-dd
};

// 공지 목록 불러오기
const loadNotices = async () => {
  try {
    const res = await axios.get("/api/announcements");
    notices.value = res.data.data; // ApiResponse.data
  } catch (err) {
    console.error("공지 목록 불러오기 실패:", err);
  }
};

// 상세 이동
const goDetail = (code) => {
  window.location.href = `/announcement/${code}`;
};

onMounted(() => {
  loadNotices();
});
</script>

<style scoped>
.notice-wrapper {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
}

.notice-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
}

/* 테이블 스타일 */
.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 150px;
  padding: 14px 5px;
}

.table-header {
  background: #f4f6fa;
  font-weight: 600;
  border-radius: 6px;
  margin-bottom: 4px;
}

.table-row {
  border-bottom: 1px solid #eee;
  align-items: center;
}

.row-click {
  cursor: pointer;
}

.empty {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

.td,
.th {
  display: flex;
  align-items: center;
}
</style>
