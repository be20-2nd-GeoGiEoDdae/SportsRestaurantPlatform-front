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
            to="restaurant"
            custom
            v-slot="{ href, navigate, isActive }"
        >
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            가게
          </a>
        </router-link>

        <router-link
            to="viewing"
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

      <!-- =========================
            ⭐ 유저 정보 영역
         ========================= -->
      <div class="user-section">

        <!-- 로그인 상태 -->
        <template v-if="userId">
          <router-link
              to="/MyPage/ProfileEdit"
              class="user-link"
          >
            {{ userName }}님
          </router-link>

          <span class="divider">/</span>

          <button class="logout-btn" @click="logout">로그아웃</button>
        </template>

        <!-- 로그아웃 상태 -->
        <template v-else>
          <!-- 아무것도 표시하지 않음 -->
        </template>

      </div>

    </nav>
  </header>
</template>



<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { getAuthUser } from "@/utils/auth";
import { useRouter } from "vue-router";
import logo from "@/assets/logo/logo.png";

const router = useRouter();

const userName = ref("로그인 필요");
const userId = ref(null);

const notifications = ref([]);
const currentNotice = ref(null);

let es = null;
let hideTimer = null;

/* ============================
   ⭐ 토큰에서 사용자 정보 로드
=============================== */
onMounted(() => {
  const info = getAuthUser();

  if (info) {
    userId.value = Number(info.sub);
    userName.value = info.email;
  }
});

/* ============================
   🔔 알림 배너 표시
=============================== */
const showNotification = (text) => {
  notifications.value.unshift({ id: Date.now(), text });
  currentNotice.value = text;

  if (hideTimer) clearTimeout(hideTimer);

  hideTimer = setTimeout(() => {
    currentNotice.value = null;
  }, 10000);
};

/* ============================
   🔔 SSE 알림 연결
=============================== */
const alarmConnect = () => {
  if (!userId.value) {
    alert("로그인이 필요합니다.");
    return;
  }

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

/* ============================
   ⭐ 로그아웃
=============================== */
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  userId.value = null;
  userName.value = "로그인 필요";

  router.push("/welcome");
};

/* ============================
   언마운트 처리
=============================== */
onBeforeUnmount(() => {
  if (es) es.close();
  if (hideTimer) clearTimeout(hideTimer);
});
</script>


<style scoped>
@import "@/assets/shared/navbar/navbar.css";
</style>
