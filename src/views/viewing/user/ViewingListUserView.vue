<template>
  <div class="wrapper">

    <!-- ===================== 왼쪽 필터 ===================== -->
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

      <!-- 키워드 -->
      <div class="filter-section" v-for="(list, cat) in keywordMap" :key="cat">
        <Label class="filter-label">{{ categoryNames[cat] }}</Label>

        <div class="keyword-list">
          <div
              class="keyword-tag"
              v-for="item in list"
              :key="item.value"
              :class="{ active: selectedKeywords.includes(item.value) }"
              @click="toggleKeyword(item.value)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <Button class="keyword-clear-btn" @click="clearKeywords">
        키워드 초기화
      </Button>
    </aside>



    <!-- ===================== 오른쪽 리스트 ===================== -->
    <main class="list-box">

      <!-- 정렬 -->
      <div class="right-sort">
        <div class="sort-wrapper">
          <button class="sort-btn" @click="toggleSortMenu">
            {{ sortLabel }} ▼
          </button>

          <div
              v-if="showSortMenu"
              class="dropdown-menu"
          >
            <div class="dropdown-item" @click="selectSort('distance')">가까운 거리순</div>
            <div class="dropdown-item" @click="selectSort('score')">평점순</div>
            <div class="dropdown-item" @click="selectSort('name')">이름순</div>
          </div>
        </div>
      </div>

      <!-- 카드 리스트 -->
      <div class="restaurant-list">
        <div class="store-card" v-for="v in viewingList" :key="v.viewingCode">

          <img
              :src="v.pictureUrl"
              class="store-img"
              @click.stop="$router.push(`/viewing/detailed/${v.viewingCode}`)"
          />

          <div class="store-info">
            <p class="store-name">{{ v.viewingTitle }}</p>

            <p class="location">{{ v.restaurantName }}</p>

            <div class="info-inline">
              <div class="rating-item" v-if="v.reviewAvg">
                ⭐ {{ v.reviewAvg }}
              </div>

              <div class="distance-item" v-if="v.distance">
                {{ v.distance.toFixed(2) }} km
              </div>
            </div>

            <p><strong>종목 :</strong> {{ v.sportName }}</p>
            <p><strong>팀 :</strong> {{ v.teamName }}</p>
          </div>

          <!-- 즐겨찾기(옵션) -->
          <div class="favorite">⭐</div>

          <div class="deposit-right">
            {{ v.viewingTotalDeposit ? v.viewingTotalDeposit + '원' : '' }}
          </div>
        </div>
      </div>


      <!-- 페이지 -->
      <div class="bottom-pagination">
        <el-pagination
            v-if="pageInfo"
            :current-page="pageInfo?.page"
            :page-size="pageInfo?.size"
            :total="pageInfo?.totalElements"
            layout="prev, pager, next"
            @current-change="handlePageChange"
        />
      </div>


    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

import Slider from "@/components/shared/form/Slider.vue";
import Button from "@/components/shared/basic/Button.vue";
import Text from "@/components/shared/basic/Text.vue";
import Label from "@/components/shared/basic/Label.vue";
import { ElPagination } from "element-plus";

import "@/assets/viewing/ViewingListView.css";

/* ====================== 상태 ======================= */

const userId = 1;

/* 음식 카테고리 */
const foods = ["한식", "중식", "일식", "양식", "기타"];
const categoryEnumMap = {
  "한식": "KOREAN",
  "중식": "CHINESE",
  "일식": "JAPANESE",
  "양식": "WESTERN",
  "기타": "OTHER"
};
const selectedFoods = ref([]);

/* 키워드 */
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

/* 키워드 선택 */
const toggleKeyword = (val) => {
  if (selectedKeywords.value.includes(val)) {
    selectedKeywords.value = selectedKeywords.value.filter(k => k !== val);
  } else {
    selectedKeywords.value.push(val);
  }
  pageInfo.value.page = 1;
  loadViewings();
};

const clearKeywords = () => {
  selectedKeywords.value = [];
  pageInfo.value.page = 1;
  loadViewings();
};

/* 키워드 불러오기 */
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


/* ====================== 목록 조회 ======================= */

const viewingList = ref([]);
const sort = ref("distance");
const pageInfo = ref({
  page: 1,
  size: 5,
  totalElements: 0,
});

const userLat = ref(null);
const userLng = ref(null);

const getImageUrl = (path) =>
    path ? `http://localhost:8080${path}` : "/images/no-image.png";

const showSortMenu = ref(false);

const sortLabel = computed(() => {
  switch (sort.value) {
    case "distance": return "가까운 거리순";
    case "score": return "평점순";
    case "name": return "이름순";
  }
});

const toggleSortMenu = () => (showSortMenu.value = !showSortMenu.value);

const selectSort = (type) => {
  showSortMenu.value = false;
  sort.value = type;
  pageInfo.value.page = 1;
  loadViewings();
};

/* 음식 */
const toggleFood = (item) => {
  selectedFoods.value = [item];
  pageInfo.value.page = 1;
  loadViewings();
};

/* 메인 API */
const loadViewings = async (page = 1) => {
  try {
    const res = await axios.get("http://localhost:8080/api/viewings", {
      params: {
        userId,
        category: selectedFoods.value[0]
            ? categoryEnumMap[selectedFoods.value[0]]
            : null,
        keywords:
            selectedKeywords.value.length > 0 ? selectedKeywords.value : null,
        sort: sort.value,
        page: page - 1,
        size: pageInfo.value.size,
        lat: userLat.value,
        lng: userLng.value
      }
    });

    viewingList.value = res.data.content.map(v => ({
      ...v,
      pictureUrl: getImageUrl(v.pictureUrl)
    }));
    pageInfo.value.totalElements = res.data.totalElements;
    pageInfo.value.page = page;

  } catch (e) {
    console.error("조회 실패:", e);
  }
};

/* 페이징 */
const handlePageChange = (page) => {
  loadViewings(page);
};

/* 위치 갱신 */
const refreshLocation = () => {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadViewings();
      },
      () => alert("위치 권한이 필요합니다!")
  );
};

/* 초기 실행 */
onMounted(() => {
  loadKeywords();
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        loadViewings();
      },
      () => loadViewings()
  );
});
</script>

<style scoped>
@import "@/assets/viewing/ViewingListView.css";
.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>