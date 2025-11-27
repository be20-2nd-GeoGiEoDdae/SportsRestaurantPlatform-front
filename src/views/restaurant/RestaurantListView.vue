<template>
  <div class="wrapper">

    <!-- ============ 왼쪽 필터 ============ -->
    <aside class="filter-box">
      <Text tag="h3" class="filter-title">필터</Text>

      <!-- 위치 -->
      <div class="filter-section">
        <Label class="filter-label">현재 위치</Label>
        <Button class="location-set-btn" @click="refreshLocation">
          📍 내 위치 가져오기
        </Button>
      </div>

      <!-- 음식 카테고리 -->
      <div class="filter-section">
        <Label class="filter-label">음식</Label>
        <div class="category-buttons">
          <Button
              v-for="item in foods"
              :key="item"
              class="food-btn"
              :class="{ active: selectedFoods.includes(item) }"
              @click="toggleFood(item)"
          >
            {{ item }}
          </Button>
        </div>
      </div>

      <!-- 키워드 카테고리 -->
      <div class="filter-section" v-for="(list, cat) in keywordMap" :key="cat">
        <Label class="filter-label">{{ categoryNames[cat] }}</Label>

        <div class="keyword-list">
          <div
              class="keyword-tag"
              v-for="item in list"
              :key="item.value"
              :class="{ active: selectedKeywords.includes(item.label) }"
              @click="toggleKeyword(item.label)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <Button class="keyword-clear-btn" @click="clearKeywords">
        키워드 초기화
      </Button>
    </aside>

    <!-- ============ 오른쪽 리스트 ============ -->
    <main class="list-box">

      <!-- 정렬 -->
      <div class="right-sort">
        <div class="sort-wrapper">
          <button class="sort-btn" @click="toggleSortMenu">
            {{ sortLabel }} ▼
          </button>

          <!-- v-if ➜ v-show 로 변경 -->
          <div v-show="showSortMenu" class="dropdown-menu">
            <div class="dropdown-item" @click="selectSort('distance')">가까운 거리순</div>
            <div class="dropdown-item" @click="selectSort('score')">평점순</div>
            <div class="dropdown-item" @click="selectSort('name')">이름순</div>
          </div>
        </div>
      </div>

      <!-- 가게 목록 -->
      <div class="restaurant-list">
        <div
            class="store-card"
            v-for="store in restaurantList"
            :key="store.restaurantCode"
        >
          <router-link
              :to="{ name: 'RestaurantListDetailed', params: { id: store.restaurantCode } }"
          >
            <img
                :src="getImageUrl(store.pictureUrls)"
                class="store-img"
                alt="가게 이미지"
            />
          </router-link>

          <div class="store-info">
            <p>{{ store.restaurantName }}</p>
            <p>{{ store.restaurantLocation }}</p>
            <p>{{ store.keywords }}</p>

            <p v-if="store.reviewAvg !== undefined">
              ⭐ {{ store.reviewAvg }}
            </p>

            <p v-if="store.distance !== null">
              {{ store.distance.toFixed(2) }} km
            </p>
          </div>

          <!-- 즐겨찾기 -->
          <div
              class="favorite"
              :class="{ active: store.bookmarked }"
              @click="toggleBookmark(store)"
          >
            <svg class="star-icon" viewBox="0 0 24 24">
              <path d="M12 2l3 6 6 .9-4.5 4.4L17.9 20 12 17l-5.9 3 1.4-6.7L3 8.9 9 8z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="bottom-pagination">
        <!-- v-if → v-show 로 변경 -->
        <el-pagination
            v-show="pageInfo"
            :current-page="pageInfo?.page"
            :page-size="pageInfo?.size"
            :total="pageInfo?.totalElements"
            layout="prev, pager, next"
            @current-change="handlePageChange"
        />
      </div>

      <!-- 등록 버튼 -->
      <div class="register-row" v-if="userRole === 'ENTREPRENEUR'">
        <Button type="primary" @click="$router.push('/entrepreneur/restaurant/register')">
          가게 등록하기
        </Button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

import Button from "@/components/shared/basic/Button.vue";
import Text from "@/components/shared/basic/Text.vue";
import Label from "@/components/shared/basic/Label.vue";
import { ElPagination } from "element-plus";

import { useAuthStore } from "@/stores/authStore.js";

/* ---------------------------
   Auth Store
---------------------------- */
const authStore = useAuthStore();
const userId = computed(() => authStore.userId);
const userRole = computed(() => authStore.role);

/* ---------------------------
   mount
---------------------------- */
onMounted(async () => {
  await authStore.loadFromToken();
  await loadKeywords();
  await loadWithLocation();
});

/* ---------------------------
   음식 카테고리
---------------------------- */
const foods = ["한식", "중식", "일식", "양식", "기타"];
const categoryEnumMap = {
  "한식": "KOREAN",
  "중식": "CHINESE",
  "일식": "JAPANESE",
  "양식": "WESTERN",
  "기타": "OTHER"
};
const selectedFoods = ref([]);

/* ---------------------------
   키워드
---------------------------- */
const keywordMap = ref({
  TASTE: [],
  MOOD: [],
  SERVICE: [],
  PRICE: [],
  CLEANLINESS: [],
  ETC: []
});
const categoryNames = {
  TASTE: "맛",
  MOOD: "분위기",
  SERVICE: "서비스",
  PRICE: "가격",
  CLEANLINESS: "청결",
  ETC: "기타"
};

const selectedKeywords = ref([]);

const toggleKeyword = (label) => {
  selectedKeywords.value = selectedKeywords.value.includes(label)
      ? selectedKeywords.value.filter(v => v !== label)
      : [...selectedKeywords.value, label];

  pageInfo.value.page = 1;
  loadRestaurants();
};

const clearKeywords = () => {
  selectedKeywords.value = [];
  pageInfo.value.page = 1;
  loadRestaurants();
};

const loadKeywords = async () => {
  const res = await axios.get("http://localhost:8080/api/keywords");

  const groups = {
    TASTE: [],
    MOOD: [],
    SERVICE: [],
    PRICE: [],
    CLEANLINESS: [],
    ETC: []
  };

  res.data.data.forEach(k => {
    groups[k.keywordCategory].push({
      label: k.keywordName,
      value: k.keywordCode
    });
  });

  keywordMap.value = groups;
};

/* ---------------------------
   목록 조회
---------------------------- */
const restaurantList = ref([]);
const sort = ref("distance");
const pageInfo = ref({
  page: 1,
  size: 5,
  totalElements: 0
});

const userLat = ref(null);
const userLng = ref(null);

const getImageUrl = (paths) => {
  if (!paths) return "/images/default.jpg";
  if (Array.isArray(paths)) return `http://localhost:8080${paths[0]}`;
  return `http://localhost:8080${paths}`;
};

/* 정렬 */
const showSortMenu = ref(false);
const sortLabel = computed(() => ({
  distance: "가까운 거리순",
  score: "평점순",
  name: "이름순"
}[sort.value]));

const toggleSortMenu = () => (showSortMenu.value = !showSortMenu.value);

const selectSort = (type) => {
  if (type === "distance" && (!userLat.value || !userLng.value)) {
    alert("위치 권한이 필요합니다");
    return;
  }

  sort.value = type;
  showSortMenu.value = false;
  pageInfo.value.page = 1;
  loadRestaurants();
};

/* 음식 선택 */
const toggleFood = (item) => {
  selectedFoods.value = [item];
  pageInfo.value.page = 1;
  loadRestaurants();
};

/* 목록 요청 */
const loadRestaurants = async (page = 1) => {
  if (!userId.value) {
    console.warn("❌ userId 없음 → 목록 중단");
    return;
  }

  try {
    const res = await axios.get("http://localhost:8080/api/restaurants/list", {
      params: {
        userId: Number(userId.value),
        category: selectedFoods.value[0]
            ? categoryEnumMap[selectedFoods.value[0]]
            : null,
        keywords: selectedKeywords.value.length > 0 ? selectedKeywords.value : null,
        sort: sort.value,
        page: page,
        size: pageInfo.value.size,
        userLat: userLat.value,
        userLng: userLng.value
      }
    });

    restaurantList.value = res.data.map(s => ({
      ...s,
      bookmarked:
          s.bookmarked === true ||
          s.bookmarked === 1 ||
          s.bookmarked === "1"
    }));

    pageInfo.value.page = page;

  } catch (e) {
    console.error("❌ 조회 오류:", e);
  }
};

/* 페이징 */
const handlePageChange = (page) => {
  loadRestaurants(page);
};

/* 즐겨찾기 */
const toggleBookmark = async (store) => {
  if (!userId.value) {
    alert("로그인이 필요합니다");
    return;
  }

  const uid = Number(userId.value);

  try {
    if (!store.bookmarked) {
      await axios.post(
          `http://localhost:8080/api/bookmark/${uid}/${store.restaurantCode}`
      );
    } else {
      await axios.delete(
          `http://localhost:8080/api/bookmark/${uid}/${store.restaurantCode}`
      );
    }

    loadRestaurants(pageInfo.value.page);
  } catch (e) {
    console.error("❌ 즐겨찾기 실패:", e);
  }
};

/* 위치 */
const refreshLocation = () => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadRestaurants();
      },
      () => alert("위치 권한이 필요합니다.")
  );
};

const loadWithLocation = async () => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadRestaurants();
      },
      () => loadRestaurants()
  );
};
</script>

<style scoped>
@import "@/assets/restaurant/RestaurantListView.css";

.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
