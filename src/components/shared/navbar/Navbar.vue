<template>
  <header class="navbar">
    <!-- 왼쪽 로고 -->
    <div class="navbar-left">
      <img :src="logo" alt="logo" class="logo" />
      <h1 class="brand"></h1>
    </div>

    <!-- 오른쪽: 메뉴 / 알림 / 유저 -->
    <nav class="navbar-right">
      <!-- 가게 / 관람 메뉴 -->
      <div class="menu-group">
        <router-link to="/user/restaurant" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            가게
          </a>
        </router-link>

        <router-link to="/user/viewing" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            관람
          </a>
        </router-link>
      </div>

      <!-- 알림 영역 -->
      <div class="notify-area">
        <button class="bell" @click="alarmConnect">🔔</button>

        <!-- 여기 박스가 10초 동안만 보임 -->
        <div v-if="currentNotice" class="notify-banner">
          {{ currentNotice }}
        </div>
      </div>

      <!-- 유저 정보 -->
      <div class="user-section">
        <router-link to="/MyPage/ProfileEdit" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
        {{ userName }}님</a>
        <span class="divider">/</span>
        </router-link>
        <button class="logout-btn">로그아웃</button>
      </div>
    </nav>
  </header>
</template>


<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import logo from "@/assets/logo/logo.png";

const userName = ref("----");

// 전체 알림 로그 필요하면 유지
const notifications = ref([]);

// 화면에 잠깐 보여줄 현재 알림 메시지
const currentNotice = ref(null);

let es = null;
let hideTimer = null;

const showNotification = (text) => {
  // 히스토리용
  notifications.value.unshift({
    id: Date.now(),
    text,
  });

  // 상단 박스에 표시
  currentNotice.value = text;

  // 타이머 초기화 후 10초 뒤 숨기기
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
  hideTimer = setTimeout(() => {
    currentNotice.value = null;
  }, 10000); // 10초
};

const alarmConnect = () => {
  // 테스트용: 클릭하면 바로 박스가 뜨는지 확인
  showNotification("테스트 알림입니다.");

  if (es && es.readyState === EventSource.OPEN) return;

  es = new EventSource("http://localhost:8080/api/notification/connections/6");

  es.addEventListener("sse", (event) => {
    const payload = event.data;
    console.log("알림 도착:", payload);

    showNotification(payload);   // 일단 필터 없이 그대로 보여주기
  });

  es.onerror = (err) => {
    console.error("SSE 에러", err);
  };
};

onMounted(() => {
  // 처음부터 자동 연결하고 싶으면 여기서 alarmConnect() 호출
  // alarmConnect();
});

onBeforeUnmount(() => {
  if (es) {
    es.close();
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
});
</script>


<style scoped>
@import "@/assets/shared/navbar/navbar.css";
</style>
