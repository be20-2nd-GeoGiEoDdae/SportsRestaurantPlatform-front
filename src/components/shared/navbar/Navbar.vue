<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/welcome">
        <img :src="logo" alt="logo" class="logo" style="cursor: pointer;" />
      </router-link>
    </div>

    <nav class="navbar-right">
      <!-- 메뉴 -->
      <div class="menu-group">
        <router-link
            to="/user/restaurant"
            custom
            v-slot="{ href, navigate, isActive }"
        >
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            가게
          </a>
        </router-link>

        <router-link
            to="/user/viewing"
            custom
            v-slot="{ href, navigate, isActive }"
        >
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            관람
          </a>
        </router-link>
      </div>

      <!-- 알림 -->
      <div class="notify-area">
        <button class="bell" @click="alarmConnect">🔔</button>

        <div v-if="currentNotice" class="notify-banner">
          {{ currentNotice }}
        </div>
      </div>

      <!-- 유저 정보 -->
      <div class="user-section">
        <router-link
            v-if="userId"
            to="/MyPage/ProfileEdit"
            class="user-link"
        >
          {{ userName }}님
        </router-link>

        <span v-else>로그인</span>

        <span class="divider">/</span>

        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>
    </nav>
  </header>
</template>



<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { getAuthUser } from "@/utils/auth";   // JWT decode 유틸
import { useRouter } from "vue-router";
import logo from "@/assets/logo/logo.png";

const router = useRouter();

const userName = ref("로그인 필요");
const userId = ref(null);

const notifications = ref([]);
const currentNotice = ref(null);

let es = null;
let hideTimer = null;

// ⭐ 토큰에서 사용자 정보 불러오기
onMounted(() => {
  const info = getAuthUser();
  if (info) {
    userId.value = Number(info.sub);   // "21" → 21
    userName.value = info.email;       // 이름 대신 email 사용(백엔드 구조상)
  }
});

// 🔔 알림 10초 표시
const showNotification = (text) => {
  notifications.value.unshift({ id: Date.now(), text });
  currentNotice.value = text;

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    currentNotice.value = null;
  }, 10000);
};

// 🔔 SSE 연결 (userId 자동 반영)
const alarmConnect = () => {
  if (!userId.value) {
    alert("로그인이 필요합니다.");
    return;
  }

  // 테스트 알림
  showNotification("알림 연결 중입니다...");

  if (es && es.readyState === EventSource.OPEN) return;

  es = new EventSource(
      `http://localhost:8080/api/notification/connections/${userId.value}`
  );

  es.addEventListener("sse", (event) => {
    const payload = event.data;
    console.log("알림 도착:", payload);
    showNotification(payload);
  });

  es.onerror = (err) => {
    console.error("SSE Error:", err);
  };
};

// ⭐ 로그아웃 처리
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  userId.value = null;
  userName.value = "로그인 필요";

  router.push("/welcome"); // 로그인 페이지로 이동
};

onBeforeUnmount(() => {
  if (es) es.close();
  if (hideTimer) clearTimeout(hideTimer);
});
</script>


<style scoped>
@import "@/assets/shared/navbar/navbar.css";
</style>
