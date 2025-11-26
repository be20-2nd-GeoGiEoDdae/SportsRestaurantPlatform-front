<template>
  <div class="notice-wrapper">
    <h2 class="page-title">공지사항</h2>

    <div class="notice-box" v-if="notice">

      <!-- 제목 + 날짜 -->
      <div class="top-row">
        <h3 class="title">{{ notice.announcementTitle }}</h3>
        <p class="date">{{ formatDate(notice.createdAt) }}</p>
      </div>

      <hr class="line" />

      <!-- 내용 -->
      <p class="content">
        {{ notice.announcementContent }}
      </p>

    </div>

    <!-- 로딩 or 데이터 없음 -->
    <div v-else class="empty">불러오는 중...</div>

    <!-- 목록 버튼 -->
    <div class="btn-area">
      <button class="list-btn" @click="goBack">목록</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const notice = ref(null);

// 날짜 포맷
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return dateStr.substring(0, 10); // yyyy-MM-dd
};

// 상세 조회
const loadDetail = async () => {
  try {
    const code = route.params.id;
    const res = await axios.get(`/api/announcements/${code}`);

    notice.value = res.data.data;
  } catch (err) {
    console.error("공지 상세 조회 실패:", err);
  }
};

const goBack = () => {
  router.push("/announcement");
};

onMounted(loadDetail);
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
  margin-bottom: 25px;
}

/* 제목 + 날짜 */
.top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: 700;
}

.date {
  font-size: 15px;
  color: #666;
}

/* 내용 */
.content {
  font-size: 17px;
  line-height: 1.6;
  margin-top: 25px;
}

/* 목록 버튼 */
.btn-area {
  text-align: center;
}

.list-btn {
  background: #4bb8ff;
  padding: 12px 36px;
  font-size: 18px;
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 40px 0;
  color: #888;
}
</style>
