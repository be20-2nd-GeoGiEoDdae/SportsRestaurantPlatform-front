<!-- src/views/admin/ViewingManageView.vue -->
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

const sportOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'SOCCER', label: '축구' },
  { value: 'BASKETBALL', label: '농구' },
  { value: 'BASEBALL', label: '야구' }
]

const priceOptions = [
  { value: 'ALL', label: '전체' },
  { value: '100000', label: '100,000원 이하' },
  { value: '300000', label: '300,000원 이하' },
  { value: '500000', label: '500,000원 이하' }
]

const peopleOptions = [
  { value: 'ALL', label: '전체' },
  { value: '10', label: '10명 이하' },
  { value: '30', label: '30명 이하' },
  { value: '50', label: '50명 이하' }
]

const selectedSport = ref(sportOptions[1])
const selectedPrice = ref(priceOptions[1])
const selectedPeople = ref(peopleOptions[1])
const selectedDate = ref('')

const dateInputRef = ref(null)
const openDatePicker = () => {
  if (dateInputRef.value?.showPicker) dateInputRef.value.showPicker()
  else {
    dateInputRef.value?.focus()
    dateInputRef.value?.click()
  }
}

const isSportOpen = ref(false)
const isPriceOpen = ref(false)
const isPeopleOpen = ref(false)

const selectSport = (opt) => { selectedSport.value = opt; isSportOpen.value = false }
const selectPrice = (opt) => { selectedPrice.value = opt; isPriceOpen.value = false }
const selectPeople = (opt) => { selectedPeople.value = opt; isPeopleOpen.value = false }

/* ================= 더미 데이터 ================= */
const reviews = ref([
  { id: 1, title: '수업 대비 직관오면서 같이 봅시다!', date: '2025.10.10', price: '500,000', people: 30 },
  { id: 2, title: '월수 밤 축-수업 이전 점심 직관 같이 하실분', date: '2025.12.10', price: '300,000', people: 40 },
  { id: 3, title: '집에서 축소에서 직관 겸수 직관하실분 !!!', date: '2025.10.10', price: '1,000,000', people: 50 },
])

/* ================= 페이지 상태 ================= */
const pageInfo = ref({
  page: 1,
  size: 10,
  totalElements: 30
})

const fetchPage = (page) => {
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
        <h1 class="page-title">관람 관리</h1>

        <!-- 필터 영역 -->
        <section class="filter-section">
          <div class="filter-row">

            <!-- 종목 -->
            <div class="filter-item">
              <label class="filter-label">종목</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isSportOpen = !isSportOpen">
                  <span class="dropdown-text">{{ selectedSport.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isSportOpen }">▼</span>
                </button>

                <div v-if="isSportOpen" class="dropdown-menu">
                  <button
                      v-for="opt in sportOptions"
                      :key="opt.value"
                      class="dropdown-option"
                      @click="selectSport(opt)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 날짜 -->
            <div class="filter-item">
              <label class="filter-label">관람 날짜</label>
              <div class="dropdown dropdown-small dropdown-full-width date-dropdown">
                <button type="button" class="dropdown-trigger date-trigger" @click="openDatePicker">
                  <span class="dropdown-text">{{ selectedDate || '날짜를 선택하세요' }}</span>
                  <span class="dropdown-arrow">📅</span>
                </button>

<!--                <input ref="dateInputRef" type="date" v-model="selectedDate" class="date-hidden-input" />-->
              </div>
            </div>

            <!-- 예치금 -->
            <div class="filter-item">
              <label class="filter-label">관람 예치금</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isPriceOpen = !isPriceOpen">
                  <span class="dropdown-text">{{ selectedPrice.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isPriceOpen }">▼</span>
                </button>

                <div v-if="isPriceOpen" class="dropdown-menu">
                  <button
                      v-for="opt in priceOptions"
                      :key="opt.value"
                      class="dropdown-option"
                      @click="selectPrice(opt)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 인원 -->
            <div class="filter-item">
              <label class="filter-label">관람 인원</label>
              <div class="dropdown dropdown-small dropdown-full-width">
                <button type="button" class="dropdown-trigger" @click="isPeopleOpen = !isPeopleOpen">
                  <span class="dropdown-text">{{ selectedPeople.label }}</span>
                  <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isPeopleOpen }">▼</span>
                </button>

                <div v-if="isPeopleOpen" class="dropdown-menu">
                  <button
                      v-for="opt in peopleOptions"
                      :key="opt.value"
                      class="dropdown-option"
                      @click="selectPeople(opt)"
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
              <th>관람번호</th>
              <th>관람제목</th>
              <th>관람 날짜</th>
              <th>관람 예치금</th>
              <th>관람 인원</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="review in reviews" :key="review.id">
              <td>{{ review.id }}</td>
              <td>{{ review.title }}</td>
              <td>{{ review.date }}</td>
              <td>{{ review.price }}</td>
              <td>{{ review.people }}</td>
            </tr>
            <tr v-for="n in 7" :key="'empty-' + n" class="empty-row">
              <td colspan="6">&nbsp;</td>
            </tr>
            </tbody>
          </table>

          <!-- 🔥 Element Plus Pagination 적용 -->
          <div class="bottom-pagination">
            <el-pagination
                :current-page="pageInfo.page"
                :page-size="pageInfo.size"
                :total="pageInfo.totalElements"
                @current-change="fetchPage"
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

/************* 전체 레이아웃 *************/
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

/************* 필터 영역 *************/
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
  align-items: center;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-label {
  font-size: 12px;
  color: #555;
}

/************* 테이블 영역 *************/
.table-section {
  border: 1px solid #dee2e6;
  border-top: none;
  background: #fff;
  padding-bottom: 24px;
}
.review-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.review-table thead {
  background: #f1f3f5;
}
.review-table th,
.review-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e9ecef;
}
.review-table tbody tr:nth-child(odd):not(.empty-row) {
  background: #f8f9fa;
}
.empty-row td {
  background: #f8f9fa;
}

/************* Admin 스타일 Pagination *************/
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
