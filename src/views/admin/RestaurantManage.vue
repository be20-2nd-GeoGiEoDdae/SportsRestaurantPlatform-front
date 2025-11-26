<!-- src/views/admin/RestaurantManage.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import SidebarAdmin from '@/components/shared/sidebar/admin/SidebarAdmin.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.loadFromToken()
  if (authStore.role !== 'ROLE_ADMIN') {
    alert('관리자만 접근할 수 있습니다.')
    router.push('/')
  }
})

/* ================= 필터 상태 ================= */

// 1) 음식 종류
const categoryOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'JAPANESE', label: '일식' }
]

// 4) 평점
const ratingOptions = [
  { value: 'ALL', label: '전체' },
  { value: '1', label: '1점' },
  { value: '2', label: '2점' },
  { value: '3', label: '3점' },
  { value: '4', label: '4점' },
  { value: '5', label: '5점' }
]

// 5) 블랙리스트 여부
const blacklistOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'APPROVED', label: '승인' },
  { value: 'REJECTED', label: '거부' }
]

const selectedCategory = ref(categoryOptions[0])
const selectedRating = ref(ratingOptions[0])
const selectedBlacklist = ref(blacklistOptions[0])

const storeName = ref('')
const ownerName = ref('')

const isCategoryOpen = ref(false)
const isRatingOpen = ref(false)
const isBlacklistOpen = ref(false)

const selectCategory = (opt) => { selectedCategory.value = opt; isCategoryOpen.value = false }
const selectRating = (opt) => { selectedRating.value = opt; isRatingOpen.value = false }
const selectBlacklist = (opt) => { selectedBlacklist.value = opt; isBlacklistOpen.value = false }

/* ================= 더미 데이터 ================= */
const stores = ref([
  { id: 1, name: '오스카펍', owner: '김사장', capacity: 120, usageCount: 1422, reportCount: 5 },
  { id: 2, name: '동까스집', owner: '박사장', capacity: 80, usageCount: 323, reportCount: 2 },
  { id: 3, name: '황제집', owner: '이사장', capacity: 60, usageCount: 12351, reportCount: 9 }
])

/* ================= 페이지 정보 ================= */
const pageInfo = ref({
  page: 1,
  size: 10,
  totalElements: 30   // 예시 숫자
})

/* ================= 페이지 변경 ================= */
const fetchStores = (page) => {
  pageInfo.value.page = page
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-body">
      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">가게 관리</h1>

        <!-- 필터 영역 -->
        <section class="filter-section">
          <div class="filter-row">

            <!-- 음식 종류 -->
            <div class="filter-item">
              <label class="filter-label">음식 종류</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isCategoryOpen = !isCategoryOpen">
                  <span class="dropdown-text">{{ selectedCategory.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isCategoryOpen }">▼</span>
                </button>

                <div v-if="isCategoryOpen" class="dropdown-menu">
                  <div class="dropdown-options">
                    <button
                        v-for="opt in categoryOptions"
                        :key="opt.value"
                        type="button"
                        class="dropdown-option"
                        @click="selectCategory(opt)"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 가게 이름 -->
            <div class="filter-item">
              <label class="filter-label">가게 이름</label>
              <input v-model="storeName" type="text" class="filter-text-input" placeholder="가게 이름 입력" />
            </div>

            <!-- 사업자 이름 -->
            <div class="filter-item">
              <label class="filter-label">사업자 이름</label>
              <input v-model="ownerName" type="text" class="filter-text-input" placeholder="사업자 이름 입력" />
            </div>

            <!-- 평점 -->
            <div class="filter-item">
              <label class="filter-label">평점</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isRatingOpen = !isRatingOpen">
                  <span class="dropdown-text">{{ selectedRating.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isRatingOpen }">▼</span>
                </button>

                <div v-if="isRatingOpen" class="dropdown-menu">
                  <button
                      v-for="opt in ratingOptions"
                      :key="opt.value"
                      type="button"
                      class="dropdown-option"
                      @click="selectRating(opt)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 블랙리스트 여부 -->
            <div class="filter-item">
              <label class="filter-label">블랙리스트 여부</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isBlacklistOpen = !isBlacklistOpen">
                  <span class="dropdown-text">{{ selectedBlacklist.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isBlacklistOpen }">▼</span>
                </button>

                <div v-if="isBlacklistOpen" class="dropdown-menu">
                  <button
                      v-for="opt in blacklistOptions"
                      :key="opt.value"
                      type="button"
                      class="dropdown-option"
                      @click="selectBlacklist(opt)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <button class="btn btn-primary btn-medium search-btn">검색</button>
          </div>
        </section>

        <!-- 테이블 영역 -->
        <section class="table-section">
          <table class="review-table">
            <thead>
            <tr>
              <th>가게 번호</th>
              <th>가게 이름</th>
              <th>사업자 이름</th>
              <th>수용 인원</th>
              <th>이용 횟수</th>
              <th>누적 신고 횟수</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="store in stores" :key="store.id">
              <td>{{ store.id }}</td>
              <td>{{ store.name }}</td>
              <td>{{ store.owner }}</td>
              <td>{{ store.capacity }}</td>
              <td>{{ store.usageCount }}</td>
              <td>{{ store.reportCount }}</td>
            </tr>

            <tr v-for="n in 7" :key="'empty-' + n" class="empty-row">
              <td colspan="7">&nbsp;</td>
            </tr>
            </tbody>
          </table>

          <!-- 🔥 Admin 스타일 Element Plus Pagination -->
          <div class="bottom-pagination">
            <el-pagination
                :current-page="pageInfo.page"
                :page-size="pageInfo.size"
                :total="pageInfo.totalElements"
                @current-change="fetchStores"
                layout="prev, pager, next"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/shared/form/dropdowns.css";
@import "@/assets/shared/basic/buttons.css";

/************* 전체 레이아웃 (Viewing 기준) *************/
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.admin-body {
  display: flex;
}
.admin-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e9ecef;
}
.admin-content {
  flex: 1;
  padding: 30px 40px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

/************* 필터 영역 — Viewing 스타일로 통일 *************/
.filter-section {
  background: #f1f3f5;
  padding: 16px 20px;
  border-radius: 8px 8px 0 0;
  border: 1px solid #dee2e6;
  border-bottom: none;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;        /* 👉 Viewing 스타일 */
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 150px;
}

.filter-label {
  font-size: 12px;
  color: #555;
}

.filter-text-input {
  width: 160px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  padding: 0 8px;
  background-color: #fff;
  font-size: 13px;
}

/************* 테이블 영역 — Viewing 스타일로 통일 *************/
.table-section {
  background: #fff;
  border: 1px solid #dee2e6;
  border-top: none;
  padding-bottom: 24px;
}

.review-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;            /* 👉 Viewing 스타일 */
}

.review-table thead {
  background: #f1f3f5;
}

.review-table th,
.review-table td {
  padding: 10px 12px;         /* 👉 Viewing과 동일 */
  border-bottom: 1px solid #e9ecef;
  text-align: left;
}

.review-table th {
  font-weight: 600;
}

.review-table tbody tr:nth-child(odd):not(.empty-row) {
  background-color: #f8f9fa;
}

.empty-row td {
  background-color: #f8f9fa;
}

/************* Pagination — Viewing 스타일 그대로 *************/
.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.bottom-pagination .el-pagination {
  --el-pagination-button-width: 34px;
  --el-pagination-button-height: 34px;
}

.bottom-pagination .el-pagination .btn-prev,
.bottom-pagination .el-pagination .btn-next,
.bottom-pagination .el-pagination .number {
  background: #f1f3f5;
  border-radius: 8px;
  margin: 0 4px;
  border: 1px solid #dee2e6;
  transition: all 0.15s ease;
}

.bottom-pagination .el-pagination .number.is-active {
  background: #6094c5;
  color: white;
  border-color: #6094c5;
}

.bottom-pagination .el-pagination .btn-prev:hover,
.bottom-pagination .el-pagination .btn-next:hover,
.bottom-pagination .el-pagination .number:hover {
  background: #e9ecef;
}

</style>
