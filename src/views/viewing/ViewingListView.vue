<template>
  <div class="wrapper">

    <!-- 왼쪽 필터 -->
    <aside class="filter-box">
      <Text tag="h3" class="filter-title">필터</Text>

      <div class="filter-section">
        <Label class="filter-label">금액</Label>

        <div class="price-row">
          <span>0원</span>
          <span>50000원</span>
        </div>

        <Slider v-model="price" :max="50000" range />
      </div>

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

    <!-- 오른쪽 리스트 -->
    <main class="list-box">

      <div class="top-row">
        <Button class="near-btn" @click="sortByDistance">가까운 거리순</Button>
      </div>

      <!-- 카드 리스트 -->
      <div class="restaurant-list">
        <div class="store-card" v-for="v in viewingList" :key="v.viewingCode">

          <!-- 이미지 -->
          <img :src="v.pictureUrl" class="store-img" />

          <!-- 중앙 정보 -->
          <div class="store-info">
            <p><strong>관람명 :</strong> {{ v.viewingTitle }}</p>
            <p><strong>가게명 :</strong> {{ v.restaurantName }}</p>
            <p><strong>종목 :</strong> {{ v.sportName }}</p>
            <p><strong>팀 :</strong> {{ v.teamName }}</p>
            <p v-if="v.distance"><strong>거리 :</strong> {{ v.distance.toFixed(2) }} km</p>
          </div>

          <!-- 오른쪽 상단 -->
          <div class="favorite">⭐</div>

          <!-- 오른쪽 하단 -->
          <div class="deposit-right">10,000원</div>

        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination-box">
        <Button class="page-btn" @click="prevPage" :disabled="page===0">&lt;</Button>

        <Button
            class="page-number"
            :class="{ active: page === p }"
            v-for="p in totalPages"
            :key="p"
            @click="movePage(p)"
        >
          {{ p + 1 }}
        </Button>

        <Button class="page-btn" @click="nextPage" :disabled="page===totalPages-1">&gt;</Button>
      </div>

      <div class="register-row">
        <Button type="primary" @click="$router.push('/viewing/register')">관람 등록하기</Button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import Slider from "@/components/shared/form/Slider.vue";
import Button from "@/components/shared/basic/Button.vue";
import Text from "@/components/shared/basic/Text.vue";
import Label from "@/components/shared/basic/Label.vue";

import "@/assets/viewing/ViewingListView.css";

const price = ref([0, 50000]);
const foods = ["한식", "양식", "일식", "중식"];
const selectedFoods = ref([]);

const toggleFood = (f) => {
  if (selectedFoods.value.includes(f))
    selectedFoods.value = selectedFoods.value.filter(x => x !== f);
  else selectedFoods.value.push(f);
};

const keywords = ["주차 자리가 넓어요", "TV 화면이 커요", "조용히 보기 좋아요"];

const viewingList = ref([]);
const page = ref(0);
const size = ref(5);
const totalPages = ref(1);

const movePage = (p) => {
  page.value = p;
  fetchViewings();
};

const prevPage = () => {
  if (page.value > 0) page.value--;
  fetchViewings();
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value++;
  fetchViewings();
};

const getImageUrl = (path) => {
  return path ? `http://localhost:8080${path}` : "/images/no-image.png";
};

const fetchViewings = async () => {
  try {
    const pos = await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
          p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve({ lat: null, lng: null })
      );
    });

    const res = await axios.get("http://localhost:8080/api/viewings", {
      params: {
        page: page.value,
        size: size.value,
        lat: pos.lat,
        lng: pos.lng
      }
    });

    const data = res.data;

    viewingList.value = data.content.map(v => ({
      ...v,
      pictureUrl: getImageUrl(v.pictureUrl),
    }));

    totalPages.value = data.totalPages;

  } catch (err) {
    console.error("관람 리스트 불러오기 실패:", err);
  }
};

const sortByDistance = () => {
  viewingList.value.sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

onMounted(() => {
  fetchViewings();
});
</script>
