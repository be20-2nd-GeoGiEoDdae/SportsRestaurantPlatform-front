<template>
  <div class="wrapper">

    <!-- ===== 왼쪽 필터 박스 ===== -->
    <aside class="filter-box">
      <Text tag="h3" class="filter-title">필터</Text>

      <!-- 📍 현재 위치 설정 -->
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
              :type="selectedFoods.includes(item) ? 'primary' : ''"
              @click="toggleFood(item)"
          >
            {{ item }}
          </Button>
        </div>
      </div>

      <!-- 키워드 -->
      <div class="filter-section">
        <Label class="filter-label">키워드</Label>

        <Button class="keyword-add-btn">키워드 추가</Button>

        <div class="keyword-list">
          <div class="keyword-tag" v-for="(k, i) in keywords" :key="i">
            {{ k }}
          </div>
        </div>
      </div>
    </aside>

    <!-- ===== 오른쪽 리스트 ===== -->
    <main class="list-box">

      <!-- 📌 오른쪽 정렬 드롭다운 -->
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

      <!-- 가게 카드 리스트 -->
      <div class="restaurant-list">
        <div class="store-card" v-for="store in restaurantList" :key="store.restaurantCode">

          <router-link :to="{ name: 'RestaurantListDetailed', params: { id: store.restaurantCode } }">
            <img :src="getImageUrl(store.pictureUrls)" class="store-img" />
          </router-link>

          <div class="store-info">
            <p><strong>가게명 :</strong> {{ store.restaurantName }}</p>
            <p><strong>위치 :</strong> {{ store.restaurantLocation }}</p>
            <p><strong>가게 키워드 :</strong> {{ store.keywords }}</p>

            <p v-if="store.distance !== null">
              <strong>거리 :</strong> {{ store.distance.toFixed(2) }} km
            </p>
          </div>

          <div class="favorite">⭐</div>
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
        <Button type="primary" @click="$router.push('/restaurant/register')">
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
import '@/assets/restaurant/RestaurantListView.css';

const foods = ["한식", "양식", "일식", "중식"];
const selectedFoods = ref([]);
const keywords = ["주차 자리가 넓어요", "주차 자리가 넓어요", "주차 자리가 넓어요"];

const restaurantList = ref([]);
const sort = ref("distance");
const page = ref(1);
const size = 5;

// ⭐ 사용자 위치
const userLat = ref(null);
const userLng = ref(null);

/* 이미지 URL 처리 */
const getImageUrl = (path) => {
  return path ? `http://localhost:8080${path}` : "/images/default.jpg";
};

/* 정렬 상태 */
const showSortMenu = ref(false);

const sortLabel = computed(() => {
  switch (sort.value) {
    case "distance": return "가까운 거리순";
    case "score": return "평점순";
    case "name": return "이름순";
  }
});

/* 드롭다운 토글 */
const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value;
};

/* 정렬 변경 */
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

/* 음식 선택 */
const toggleFood = (item) => {
  if (selectedFoods.value.includes(item)) {
    selectedFoods.value = selectedFoods.value.filter(f => f !== item);
  } else {
    selectedFoods.value.push(item);
  }
  loadRestaurants();
};

/* 레스토랑 조회 */
const loadRestaurants = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/restaurants/list", {
      params: {
        category: selectedFoods.value[0] || null,
        sort: sort.value,
        page: page.value,
        size: size,
        userLat: userLat.value,
        userLng: userLng.value
      }
    });

    restaurantList.value = res.data;

  } catch (e) {
    console.error("❌ 조회 오류:", e);
  }
};

/* 위치 재설정 */
const refreshLocation = () => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;

        if (sort.value === "distance") page.value = 1;

        loadRestaurants();
      },
      () => alert("위치 권한을 허용해야 거리순 정렬이 가능합니다.")
  );
};

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

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadRestaurants();
      },
      () => {
        loadRestaurants();
      }
  );
});
</script>
