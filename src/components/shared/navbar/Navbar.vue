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
            to="/restaurant"
            custom
            v-slot="{ href, navigate, isActive }"
        >
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            가게
          </a>
        </router-link>

        <router-link
            to="/viewing"
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
        <button class="bell" @click="handleBellClick">
          🔔
          <!-- 알림 개수 뱃지 -->
          <span v-if="notifications.length" class="badge">
      {{ notifications.length }}
    </span>
        </button>

        <!-- 최신 알림 말풍선 (원래 쓰던 거) -->
        <div v-if="currentNotice" class="notify-banner">
          {{ currentNotice }}
        </div>

        <!-- 🔽 알림 목록 드롭다운 -->
        <div v-if="showList" class="notify-dropdown">
          <p v-if="!notifications.length" class="empty-text">
            알림이 없습니다.
          </p>
          <ul v-else class="notify-list">
            <li
                v-for="n in notifications"
                :key="n.id"
                class="notification-item"
            >
              {{ n.text }}
            </li>
          </ul>
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
import {getNotification} from "@/api/api.js";

const router = useRouter();

const userName = ref("로그인 필요");
const userId = ref(null);

const notifications = ref([]);
const currentNotice = ref(null);
const showList = ref(false);

let es = null;
let hideTimer = null;





const loadNotificationList = async () => {
  if (!userId.value) return;

  try {
    const res = await getNotification(userId.value);

    // 백엔드 공통 응답 형식에 맞춰서 꺼내기
    // 예: CommonResponse { success, data: [ ... ], ... } 라면:
    const list = res.data.data ?? res.data;  // 상황에 맞게 골라 쓰면 됨

    notifications.value = (list || []).map((n) => ({
      id: n.notificationCode,
      text: n.notificationContent,      // ⭐ 여기만 쓰겠다 했던 부분
      checked: n.notificationChecked,   // 필요하면 사용
      type: n.notificationTypeType,     // 필요하면 사용
    }));
  } catch (e) {
    console.error("알림 목록 조회 실패", e);
  }
};
/* ============================
   ⭐ 토큰에서 사용자 정보 로드
=============================== */
onMounted(() => {
  const info = getAuthUser();
  loadNotificationList();
  if (info) {
    userId.value = Number(info.sub);
    userName.value = info.email;
  }
});

/* ============================
   🔔 알림 배너 표시
=============================== */
const showNotification = (text) => {
  notifications.value.unshift({
    id: Date.now(),  // SSE에서 코드 안 받으면 일단 시간으로 키
    text,
  });

  currentNotice.value = text;

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    currentNotice.value = null;
  }, 10000);
};

/* ============================
   🔔 SSE 알림 연결
=============================== */
const connectSse = () => {
  if (!userId.value) return;

  if (es && es.readyState === EventSource.OPEN) return;

  es = new EventSource(
      `http://localhost:8080/api/notification/connections/${userId.value}`
  );

  es.addEventListener("sse", (event) => {
    const payload = event.data;
    console.log("알림 도착:", payload);

    // 연결 메시지라면 건너뛰기
    if (payload.startsWith("EventStream Created")) return;

    // 지금은 SSE에서 순수 문자열만 보내고 있으니까 그대로 사용
    // 나중에 NotificationQueryResponse JSON을 보내게 되면:
    // const dto = JSON.parse(payload);
    // showNotification(dto.notificationContent);
    showNotification(payload);
  });

  es.onerror = (err) => {
    console.error("SSE Error:", err);
  };
};
const handleBellClick = async () => {
  // if (!userId.value) {
  //   alert("로그인이 필요합니다.");
  //   return;
  // }

  await loadNotificationList();  // 🔥 클릭할 때마다 전체 재요청
  connectSse();                  // 필요하면 SSE도 유지
  showList.value = !showList.value;
};


/* ============================
   ⭐ 로그아웃
=============================== */
/* 로그아웃 */
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  userId.value = null;
  userName.value = "로그인 필요";

  if (es) es.close();
  es = null;
  notifications.value = [];
  currentNotice.value = null;
  showList.value = false;

  router.push("/welcome");
};

onBeforeUnmount(() => {
  if (es) es.close();
  if (hideTimer) clearTimeout(hideTimer);
});
</script>


<style scoped>
@import "@/assets/shared/navbar/navbar.css";
</style>
