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

      <!-- 키워드 초기화 -->
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

          <div v-if="showSortMenu" class="dropdown-menu">
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
              :to="{ name: 'RestaurantListDetailed', params: { id: store.restaurantCode } }">
            <img :src="getImageUrl(store.pictureUrls)" class="store-img" />
          </router-link>

          <div class="store-info">
            <p><strong></strong> {{ store.restaurantName }}</p>
            <p><strong></strong> {{ store.restaurantLocation }}</p>
            <p><strong></strong> {{ store.keywords }}</p>

            <p v-if="store.reviewAvg !== undefined && store.reviewAvg !== null">
              <strong></strong> ⭐ {{ store.reviewAvg }}
            </p>

            <p v-if="store.distance !== null">
              <strong></strong> {{ store.distance.toFixed(2) }} km
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
      <div class="pagination-box">
        <Button class="page-btn" @click="prevPage">&lt;</Button>
        <Button class="page-number active">{{ page }}</Button>
        <Button class="page-btn" @click="nextPage">&gt;</Button>
      </div>


      <!-- 등록 버튼 -->
      <div class="register-row">
        <Button type="primary" @click="$router.push('/entrepreneur/restaurant')">
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

import "@/assets/restaurant/RestaurantListView.css";

const userId = 1;

// 음식 카테고리
const foods = ["한식", "중식", "일식", "양식", "기타"];
const categoryEnumMap = {
  "한식": "KOREAN",
  "중식": "CHINESE",
  "일식": "JAPANESE",
  "양식": "WESTERN",
  "기타": "OTHER"
};
const selectedFoods = ref([]);

// 키워드
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

// ⭐ 다중 키워드
const selectedKeywords = ref([]);

// 키워드 클릭 토글
const toggleKeyword = (label) => {
  if (selectedKeywords.value.includes(label)) {
    selectedKeywords.value = selectedKeywords.value.filter(k => k !== label);
  } else {
    selectedKeywords.value.push(label);
  }
  page.value = 1;
  loadRestaurants();
};

// 키워드 초기화
const clearKeywords = () => {
  selectedKeywords.value = [];
  page.value = 1;
  loadRestaurants();
};


// 키워드 불러오기
const loadKeywords = async () => {
  const res = await axios.get("http://localhost:8080/api/keywords");
  const list = res.data.data;

  const groups = {
    TASTE: [],
    MOOD: [],
    SERVICE: [],
    PRICE: [],
    CLEANLINESS: [],
    ETC: []
  };

  list.forEach(k => {
    groups[k.keywordCategory].push({
      label: k.keywordName,
      value: k.keywordCode
    });
  });

  keywordMap.value = groups;
};


// =========================
//      목록 조회
// =========================
const restaurantList = ref([]);
const sort = ref("distance");
const page = ref(1);
const size = 5;

const userLat = ref(null);
const userLng = ref(null);

// 이미지 URL 처리
const getImageUrl = (path) =>
    path ? `http://localhost:8080${path}` : "/images/default.jpg";

// 정렬 메뉴
const showSortMenu = ref(false);

const sortLabel = computed(() => {
  switch (sort.value) {
    case "distance": return "가까운 거리순";
    case "score": return "평점순";
    case "name": return "이름순";
  }
});

// 정렬 변경
const toggleSortMenu = () => showSortMenu.value = !showSortMenu.value;

const selectSort = (type) => {
  showSortMenu.value = false;

  if (type === "distance" && (!userLat.value || !userLng.value)) {
    alert("위치 허용 후 이용 가능합니다!");
    return;
  }

  sort.value = type;
  page.value = 1;
  loadRestaurants();
};


// 음식 카테고리 선택
const toggleFood = (item) => {
  selectedFoods.value = [item];
  page.value = 1;
  loadRestaurants();
};


// 목록 요청
const loadRestaurants = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/restaurants/list", {
      params: {
        userId,
        category: selectedFoods.value[0]
            ? categoryEnumMap[selectedFoods.value[0]]
            : null,
        keywords: selectedKeywords.value.length > 0 ? selectedKeywords.value : null,
        sort: sort.value,
        page: page.value,
        size,
        userLat: userLat.value,
        userLng: userLng.value
      }
    });

    restaurantList.value = res.data.map(s => ({
      ...s,
      bookmarked:
          s.bookmarked === true || s.bookmarked === 1 || s.bookmarked === "1"
    }));

  } catch (e) {
    console.error("조회 오류:", e);
  }
};


// 즐겨찾기
const toggleBookmark = async (store) => {
  try {
    if (!store.bookmarked) {
      await axios.post(
          `http://localhost:8080/api/bookmark/${userId}/${store.restaurantCode}`
      );
      store.bookmarked = true;
    } else {
      await axios.delete(
          `http://localhost:8080/api/bookmark/${userId}/${store.restaurantCode}`
      );
      store.bookmarked = false;
    }
    loadRestaurants();
  } catch (e) {
    console.error("즐겨찾기 실패:", e);
  }
};


// 위치 갱신
const refreshLocation = () => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadRestaurants();
      },
      () => alert("위치 권한을 허용해야 거리순 정렬이 가능합니다.")
  );
};


// 페이징
const nextPage = () => {
  page.value++;
  loadRestaurants();
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadRestaurants();
  }
};


// 초기 실행
onMounted(() => {
  loadKeywords();

  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadRestaurants();
      },
      () => loadRestaurants()
  );
});
</script>
