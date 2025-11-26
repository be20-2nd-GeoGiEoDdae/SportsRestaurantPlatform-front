
<script setup>
  import { ref, computed } from "vue";
  import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

  const favorites = ref([
  {
    id: 1,
    name: "모스 키친",
    type: "양식",
    location: "서울시 동작구",
    rating: 4.8,
  },
  {
    id: 2,
    name: "모스 키친",
    type: "양식",
    location: "서울시 동작구",
    rating: 4.8,
  },
  {
    id: 3,
    name: "모스 키친",
    type: "양식",
    location: "서울시 동작구",
    rating: 4.8,
  },
  ]);

  // 그냥 ref([])만
  const selectedIds = ref([]);
  const currentPage = ref(1);

  /** 전체 체크 / 해제 */
  const allChecked = computed({
  get() {
  return (
  favorites.value.length > 0 &&
  selectedIds.value.length === favorites.value.length
  );
},
  set(val) {
  selectedIds.value = val ? favorites.value.map((f) => f.id) : [];
},
});

  const handleDeleteSelected = () => {
  if (!selectedIds.value.length) return;

  favorites.value = favorites.value.filter(
  (f) => !selectedIds.value.includes(f.id)
  );
  selectedIds.value = [];
};

  const handleDeleteOne = (fav) => {
  favorites.value = favorites.value.filter((f) => f.id !== fav.id);
  selectedIds.value = selectedIds.value.filter((id) => id !== fav.id);
};

  const handleGoToStore = (fav) => {
  console.log("바로가기:", fav);
  // TODO: 상세 페이지 라우팅
};

  const handlePageChange = (page) => {
  currentPage.value = page;
  console.log("페이지 변경:", page);
  // TODO: 서버 페이징 연동
};
</script>

<template>
  <div class="bookmark-page">
    <div class="bookmark-body">
      <!-- 왼쪽 사이드바 -->
      <aside class="bookmark-sidebar">
        <SidebarUser />
      </aside>

      <!-- 오른쪽 컨텐츠 -->
      <main class="bookmark-content">
        <h1 class="page-title">즐겨찾기 목록</h1>

        <!-- 위쪽 툴바 영역 (관리자 페이지의 필터영역 느낌) -->
        <section class="toolbar-section">
          <div class="toolbar-row">
            <div class="select-all-row">
              <el-checkbox v-model="allChecked" />
              <span class="select-label">전체 선택</span>

              <el-button
                  size="small"
                  class="btn-delete-all"
                  @click="handleDeleteSelected"
              >
                전체 삭제
              </el-button>
            </div>
          </div>
        </section>

        <!-- 카드 리스트 + 페이지네이션 영역 (관리자 테이블 영역 느낌) -->
        <section class="list-section">
          <div class="favorite-list">
            <article
                v-for="fav in favorites"
                :key="fav.id"
                class="favorite-row"
            >
              <div class="row-checkbox">
                <el-checkbox v-model="selectedIds" :label="fav.id" />
              </div>

              <div class="favorite-card">
                <div class="store-photo">
                  <div class="photo-box">
                    <img src="https://via.placeholder.com/90" />
                  </div>
                </div>

                <div class="store-info">
                  <div class="info-top">
                    <span class="store-name">{{ fav.name }}</span>
                  </div>
                  <div class="info-detail">
                    <p>종류 : {{ fav.type }}</p>
                    <p>위치 : {{ fav.location }}</p>
                  </div>
                </div>

                <div class="store-actions">
                  <div class="rating-wrapper">
                    <span class="rating-pill">
                      ⭐ {{ fav.rating.toFixed(1) }}
                    </span>
                  </div>

                  <el-button
                      size="small"
                      class="btn-delete"
                      @click="handleDeleteOne(fav)"
                  >
                    즐겨찾기 삭제
                  </el-button>
                  <el-button
                      size="small"
                      class="btn-go"
                      @click="handleGoToStore(fav)"
                  >
                    바로가기
                  </el-button>
                </div>
              </div>
            </article>
          </div>

          <div class="pagination-wrapper">
            <el-pagination
                :total="100"
                :page-size="10"
                :current-page="currentPage"
                layout="prev, pager, next"
                @current-change="handlePageChange"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypagebookmark.css";
</style>
