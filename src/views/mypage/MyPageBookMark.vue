
<script setup>
  import { ref, computed, onMounted } from "vue";
  import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

  const favorites = ref([]);
  const selectedIds = ref([]);
  
  const pageInfo = ref({
    page: 1,
    size: 10,
    totalElements: 0,
  });

  const allFavorites = ref([
    ...Array(25).keys(),
  ].map((i) => ({
    id: i + 1,
    name: `모스 키친 ${i + 1}`,
    type: "양식",
    location: "서울시 동작구",
    rating: 4.8,
  })));

  const fetchFavorites = (page = 1) => {
    const start = (page - 1) * pageInfo.value.size;
    const end = start + pageInfo.value.size;
    favorites.value = allFavorites.value.slice(start, end);
    pageInfo.value.totalElements = allFavorites.value.length;
    pageInfo.value.page = page;
  };

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

    allFavorites.value = allFavorites.value.filter(
      (f) => !selectedIds.value.includes(f.id)
    );
    fetchFavorites(pageInfo.value.page);
    selectedIds.value = [];
  };

  const handleDeleteOne = (fav) => {
    allFavorites.value = allFavorites.value.filter((f) => f.id !== fav.id);
    fetchFavorites(pageInfo.value.page);
    selectedIds.value = selectedIds.value.filter((id) => id !== fav.id);
  };

  const handleGoToStore = (fav) => {
    console.log("바로가기:", fav);
    // TODO: 상세 페이지 라우팅
  };

  const handlePageChange = (page) => {
    fetchFavorites(page);
  };

  onMounted(() => {
    fetchFavorites(1);
  });
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
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 기존 CSS 파일 내용을 여기에 붙여넣고, bottom-pagination 스타일을 추가합니다. */
@import "@/assets/mypage/mypagebookmark.css";

.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
