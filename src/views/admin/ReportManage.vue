<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SidebarAdmin from '@/components/shared/sidebar/admin/SidebarAdmin.vue'

// Axios 클라이언트 (8080 하드코딩)
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
})

// 검색어 (신고 유형/내용)
const searchTitle = ref('')

// 상태 라벨 매핑
const STATUS_LABEL = {
  PENDING: '보류',
  APPROVED: '승인',
  REJECTED: '거절'
}

const STATUS_ORDER = ['PENDING', 'APPROVED', 'REJECTED']

// 신고 리스트
const reports = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// 블랙리스트
const blacklistItems = ref([])
const isBlacklistLoading = ref(false)
const blacklistError = ref('')

// 검색 필터
const filteredReports = computed(() => {
  const keyword = searchTitle.value.trim()
  if (!keyword) return reports.value
  return reports.value.filter(
      (report) =>
          report.title.includes(keyword) ||
          report.content.includes(keyword)
  )
})

// 상태 뱃지 class
const getStatusClass = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'status-approved'
    case 'REJECTED':
      return 'status-rejected'
    default:
      return 'status-pending'
  }
}

// 날짜 포맷
const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

const mapReportResponse = (dto) => ({
  id: dto.reportCode,
  title: dto.reportTypeType || '신고',
  keyword: dto.reportTypeType || '-',
  content: dto.reportContents || '-',
  storeName: dto.restaurantName || '-',
  storeCode: dto.restaurantCode,
  reporterName: dto.userName || '-',
  reporterCode: dto.userCode,
  date: formatDate(dto.reportCreatedAt || dto.reportCompletedAt),
  status: dto.reportStatus || 'PENDING',
  reportCount: dto.reportCount ?? 0
})

const fetchReports = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await apiClient.get('/api/admin/reports')
    const payload = data?.data || []
    reports.value = payload
        .map(mapReportResponse)
        .sort((a, b) => {
          const statusDiff =
              STATUS_ORDER.indexOf(a.status) -
              STATUS_ORDER.indexOf(b.status)
          if (statusDiff !== 0) return statusDiff
          return (b.id || 0) - (a.id || 0)
        })
  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        '신고 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const fetchBlacklist = async () => {
  isBlacklistLoading.value = true
  blacklistError.value = ''
  try {
    const { data } = await apiClient.get('/api/admin/reports/blackList')
    const payload = data?.data || []
    blacklistItems.value = payload.map((item, index) => ({
      id: index + 1,
      storeName: item.restaurantName || '-',
      restaurantCode: item.restaurantCode,
      totalReports: item.reportCount ?? 0
    }))
  } catch (error) {
    blacklistError.value =
        error.response?.data?.message ||
        '블랙리스트를 불러오지 못했습니다.'
  } finally {
    isBlacklistLoading.value = false
  }
}

/* ================= 신고 상세 모달 ================= */

const isModalOpen = ref(false)
const modalReport = ref({
  id: null,
  title: '',
  keyword: '',
  content: '',
  storeName: '',
  reporterName: '',
  date: '',
  status: 'PENDING',
  reportCount: 0
})

// 행 클릭 → 상세 모달 열기
const openDetailModal = async (report) => {
  errorMessage.value = ''
  try {
    const { data } = await apiClient.get(
        `/api/admin/reports/${report.id}`
    )
    const detail = mapReportResponse(data?.data || report)
    modalReport.value = detail
    isModalOpen.value = true
  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        '신고 상세를 불러오지 못했습니다.'
  }
}

// 상세 모달 닫기
const closeModal = () => {
  isModalOpen.value = false
}

// 상태 변경 (승인 / 보류 / 거절)
const updateReportStatus = async (newStatus) => {
  if (!modalReport.value.id) return
  try {
    await apiClient.patch(
        `/api/reports/${modalReport.value.id}/status`,
        {
          reportStatus: newStatus
        }
    )
    modalReport.value.status = newStatus
    await fetchReports()
  } catch (error) {
    errorMessage.value =
        error.response?.data?.message ||
        '신고 상태를 변경하지 못했습니다.'
  } finally {
    isModalOpen.value = false
  }
}

/* ================= 블랙리스트 모달 ================= */

const isBlacklistModalOpen = ref(false)

// 상단 툴바의 블랙리스트 버튼 클릭
const openBlacklistModal = async () => {
  await fetchBlacklist()
  isBlacklistModalOpen.value = true
}

const closeBlacklistModal = () => {
  isBlacklistModalOpen.value = false
}

// 행 끝의 "블랙리스트 등록" 버튼
const addToBlacklist = async (report) => {
  blacklistError.value = ''
  try {
    await apiClient.post('/api/reports/blackList', {
      reportCode: report.id,
      restaurantCode: report.storeCode
    })
    await fetchBlacklist()
  } catch (error) {
    blacklistError.value =
        error.response?.data?.message ||
        '블랙리스트 등록에 실패했습니다.'
  }
}

// 블랙리스트 행 삭제 버튼
const removeBlacklistItem = async (restaurantCode) => {
  blacklistError.value = ''
  try {
    await apiClient.delete(
        `/api/reports/blackList/${restaurantCode}`
    )
    await fetchBlacklist()
  } catch (error) {
    blacklistError.value =
        error.response?.data?.message ||
        '블랙리스트 삭제에 실패했습니다.'
  }
}

onMounted(() => {
  fetchReports()
})
</script>


<template>
  <div class="admin-page">
    <div class="admin-body">
      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">신고 관리</h1>

        <section class="report-section">
          <div class="report-toolbar">
            <div class="toolbar-spacer"></div>
            <div class="toolbar-right">
              <button
                  type="button"
                  class="btn btn-outline btn-small blacklist-list-btn"
                  @click="openBlacklistModal"
              >
                블랙리스트
              </button>

              <input
                  v-model="searchTitle"
                  type="text"
                  class="report-search-input"
                  placeholder="신고 유형 또는 내용을 입력하세요."
                  @keyup.enter.prevent
              />
            </div>
          </div>

          <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>

          <table class="report-table">
            <thead>
            <tr>
              <th class="col-title">신고 유형</th>
              <th class="col-writer">작성자</th>
              <th class="col-store">신고된 가게</th>
              <th class="col-count">누적 신고 수</th>
              <th class="col-date">작성일</th>
              <th class="col-status">신고 상태</th>
              <th class="col-blacklist">블랙리스트</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="empty-row">신고 목록을 불러오는 중입니다...</td>
            </tr>
            <tr
                v-for="report in filteredReports"
                :key="report.id"
                class="clickable-row"
                @click="openDetailModal(report)"
            >
              <td class="cell-title">
                {{ report.title }}
              </td>
              <td class="cell-writer">
                {{ report.reporterName }}
              </td>
              <td class="cell-store">
                {{ report.storeName }}
              </td>
              <td class="cell-count">
                {{ report.reportCount }}
              </td>
              <td class="cell-date">
                {{ report.date }}
              </td>
              <td class="cell-status">
                  <span
                      class="status-badge"
                      :class="getStatusClass(report.status)"
                  >
                    {{ STATUS_LABEL[report.status] }}
                  </span>
              </td>
              <td class="cell-blacklist">
                <button
                    type="button"
                    class="btn btn-small btn-outline btn-blacklist-add"
                    @click.stop="addToBlacklist(report)"
                >
                  블랙리스트 등록
                </button>
              </td>
            </tr>

            <tr v-if="!isLoading && filteredReports.length === 0">
              <td colspan="7" class="empty-row">
                검색 결과가 없습니다.
              </td>
            </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>

    <!-- ================= 신고 상세 모달 ================= -->
    <div
        v-if="isModalOpen"
        class="modal-overlay"
        @click.self="closeModal"
    >
      <div class="modal-container">
        <h2 class="modal-title">신고 상세</h2>

        <div class="modal-body">
          <div class="modal-field">
            <label class="modal-label">신고 유형</label>
            <div class="modal-value">
              {{ modalReport.title }}
            </div>
          </div>

          <div class="modal-field">
            <label class="modal-label">신고 내용</label>
            <div class="modal-value multiline">
              {{ modalReport.content }}
            </div>
          </div>

          <div class="modal-field">
            <label class="modal-label">가게 이름</label>
            <div class="modal-value">
              {{ modalReport.storeName }}
            </div>
          </div>

          <div class="modal-field">
            <label class="modal-label">신고한 유저 이름</label>
            <div class="modal-value">
              {{ modalReport.reporterName }}
            </div>
          </div>

          <div class="modal-field">
            <label class="modal-label">신고 날짜</label>
            <div class="modal-value">
              {{ modalReport.date }}
            </div>
          </div>

          <div class="modal-field">
            <label class="modal-label">누적 신고 수</label>
            <div class="modal-value">
              {{ modalReport.reportCount }}
            </div>
          </div>

          <div class="modal-current-status">
            현재 상태 :
            <span
                class="status-badge"
                :class="getStatusClass(modalReport.status)"
            >
              {{ STATUS_LABEL[modalReport.status] }}
            </span>
          </div>
        </div>

        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-outline btn-small"
              @click="updateReportStatus('REJECTED')"
          >
            거절
          </button>
          <button
              type="button"
              class="btn btn-outline btn-small"
              @click="updateReportStatus('PENDING')"
          >
            보류
          </button>
          <button
              type="button"
              class="btn btn-primary btn-small"
              @click="updateReportStatus('APPROVED')"
          >
            승인
          </button>
        </div>
      </div>
    </div>

    <!-- ================= 블랙리스트 모달 ================= -->
    <div
        v-if="isBlacklistModalOpen"
        class="modal-overlay"
        @click.self="closeBlacklistModal"
    >
      <div class="modal-container">
        <h2 class="modal-title">블랙리스트 목록</h2>

        <div class="modal-body">
          <div v-if="blacklistError" class="error-box">{{ blacklistError }}</div>
          <table class="blacklist-table">
            <thead>
            <tr>
              <th class="bl-col-store">가게 이름</th>
              <th class="bl-col-count">누적 신고 수</th>
              <th class="bl-col-actions">작업</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="isBlacklistLoading">
              <td colspan="3" class="empty-row">블랙리스트를 불러오는 중입니다...</td>
            </tr>
            <tr
                v-for="item in blacklistItems"
                :key="item.id"
            >
              <td class="bl-cell-store">
                {{ item.storeName }}
              </td>
              <td class="bl-cell-count">
                {{ item.totalReports }}
              </td>
              <td class="bl-cell-actions">
                <button
                    type="button"
                    class="btn btn-small btn-danger"
                    :disabled="!item.restaurantCode"
                    @click="removeBlacklistItem(item.restaurantCode)"
                >
                  삭제
                </button>
              </td>
            </tr>

            <tr v-if="!isBlacklistLoading && blacklistItems.length === 0">
              <td colspan="3" class="empty-row">
                등록된 블랙리스트가 없습니다.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-primary btn-small"
              @click="closeBlacklistModal"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/shared/basic/buttons.css";

/* 페이지 전체 */
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.admin-body {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e9ecef;
}

.admin-content {
  flex: 1;
  padding: 30px 40px 40px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* 신고 섹션 */
.report-section {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  padding: 20px 24px 24px;
}

/* 상단 바 */
.report-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar-spacer {
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 블랙리스트 버튼 (상단) */
.blacklist-list-btn {
  min-width: 96px;
}

/* 검색 인풋 */
.report-search-input {
  width: 260px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #ced4da;
  padding: 0 16px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.report-search-input:focus {
  outline: none;
  border-color: #6094c5;
  box-shadow: 0 0 0 2px rgba(96, 148, 197, 0.15);
}

.error-box {
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid #f1aeb5;
  background: #fff5f5;
  color: #c92a2a;
  border-radius: 8px;
  font-size: 13px;
}

/* 테이블 */
.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.report-table thead {
  background-color: #f1f3f5;
}

.report-table th,
.report-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e9ecef;
}

.col-title {
  text-align: left;
}

.col-writer {
  width: 100px;
  text-align: center;
}

.col-store {
  width: 180px;
  text-align: center;
}

.col-count {
  width: 110px;
  text-align: center;
}

.col-date {
  width: 110px;
  text-align: center;
}

.col-status {
  width: 110px;
  text-align: center;
}

.col-blacklist {
  width: 140px;
  text-align: center;
}

.cell-title {
  text-align: left;
}

.cell-writer,
.cell-store,
.cell-count,
.cell-date,
.cell-status,
.cell-blacklist {
  text-align: center;
}

/* 행 hover */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

/* 신고 없음 */
.empty-row {
  text-align: center;
  color: #868e96;
}

/* 상태 뱃지 */
.status-badge {
  display: inline-block;
  min-width: 56px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.status-pending {
  background-color: #fff4e6;
  color: #f08c00;
}

.status-approved {
  background-color: #e6fcf5;
  color: #0ca678;
}

.status-rejected {
  background-color: #ffe3e3;
  color: #e03131;
}

/* 행 끝 블랙리스트 등록 버튼 */
.btn-blacklist-add {
  min-width: 110px;
}

/* 모달 공통 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  width: 720px;
  max-width: 90vw;
  padding: 28px 32px 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-body {
  margin-top: 16px;
  margin-bottom: 20px;
  max-height: 520px;
  overflow-y: auto;
}

.modal-field {
  margin-bottom: 14px;
}

.modal-label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #495057;
}

.modal-value {
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  white-space: pre-wrap;
}

.modal-value.multiline {
  min-height: 120px;
}

.modal-current-status {
  margin-top: 10px;
  font-size: 13px;
  color: #495057;
}

/* 모달 버튼 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

/* 블랙리스트 테이블 */
.blacklist-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.blacklist-table thead {
  background-color: #f1f3f5;
}

.blacklist-table th,
.blacklist-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e9ecef;
}

.bl-col-store {
  text-align: left;
}

.bl-col-count {
  width: 140px;
  text-align: center;
}

.bl-col-actions {
  width: 100px;
  text-align: center;
}

.bl-cell-store {
  text-align: left;
}

.bl-cell-count,
.bl-cell-actions {
  text-align: center;
}
</style>