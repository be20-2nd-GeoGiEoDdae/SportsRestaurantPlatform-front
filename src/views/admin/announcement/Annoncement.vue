<!-- src/views/admin/announcement/Announcement.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
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

// 제목 검색어
const searchTitle = ref('')

// 공지사항 더미 데이터 (내용 추가)
const notices = ref([
  { id: 1, title: '서비스 점검 안내', content: '2025년 11월 14일 새벽 2시~4시 점검이 진행됩니다.', date: '2025.11.14' },
  { id: 2, title: '제목 2', content: '공지 내용 2입니다.', date: '2025.11.14' },
  { id: 3, title: '제목 3', content: '공지 내용 3입니다.', date: '2025.11.14' },
  { id: 4, title: '제목 4', content: '공지 내용 4입니다.', date: '2025.11.14' },
  { id: 5, title: '제목 5', content: '공지 내용 5입니다.', date: '2025.11.14' },
  { id: 6, title: '제목 6', content: '공지 내용 6입니다.', date: '2025.11.14' },
  { id: 7, title: '제목 7', content: '공지 내용 7입니다.', date: '2025.11.14' }
])

// 새 공지 id용
const nextId = ref(notices.value.length + 1)

// 검색 필터 적용
const filteredNotices = computed(() => {
  const keyword = searchTitle.value.trim()
  if (!keyword) return notices.value
  return notices.value.filter((n) => n.title.includes(keyword))
})

// 오늘 날짜 포맷
const formatToday = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

// ===== 모달 관련 상태 =====
const isModalOpen = ref(false)              // 모달 열림 여부
const modalMode = ref('create')             // 'create' | 'edit'
const modalNotice = ref({
  id: null,
  title: '',
  content: '',
  date: ''
})

// 모달 열기 - 신규 작성
const openCreateModal = () => {
  modalMode.value = 'create'
  modalNotice.value = {
    id: null,
    title: '',
    content: '',
    date: formatToday()
  }
  isModalOpen.value = true
}

// 모달 열기 - 기존 공지 수정
const openEditModal = (notice) => {
  modalMode.value = 'edit'
  // 객체 복사해서 모달에서 수정
  modalNotice.value = { ...notice }
  isModalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false
}

// 저장(등록/수정)
const saveNotice = () => {
  const { id, title, content, date } = modalNotice.value
  const trimmedTitle = title.trim()
  const trimmedContent = content.trim()

  if (!trimmedTitle || !trimmedContent) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }

  if (modalMode.value === 'create') {
    // 새 공지 추가
    notices.value.push({
      id: nextId.value++,
      title: trimmedTitle,
      content: trimmedContent,
      date: date || formatToday()
    })
  } else {
    // 기존 공지 수정
    const idx = notices.value.findIndex((n) => n.id === id)
    if (idx !== -1) {
      notices.value[idx] = {
        ...notices.value[idx],
        title: trimmedTitle,
        content: trimmedContent,
        date // 수정 시 날짜 그대로 쓰거나, formatToday()로 바꿔도 됨
      }
    }
  }

  isModalOpen.value = false
}

// 공지 삭제
const removeNotice = (id) => {
  if (!confirm('해당 공지사항을 삭제하시겠습니까?')) return
  notices.value = notices.value.filter((n) => n.id !== id)
}
</script>

<template>
  <div class="admin-page">
    <!-- 헤더 아래: 사이드바 + 본문 -->
    <div class="admin-body">
      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">공지사항</h1>

        <!-- 공지 리스트 + 검색/작성 영역 -->
        <section class="notice-section">
          <!-- 상단 툴바: 왼쪽 = 작성, 오른쪽 = 제목 검색 -->
          <div class="notice-toolbar">
            <!-- ✅ 왼쪽: 공지 작성 버튼 -->
            <div class="toolbar-left">
              <button
                  type="button"
                  class="btn btn-primary btn-small write-btn"
                  @click="openCreateModal"
              >
                공지 작성
              </button>
            </div>

            <!-- 오른쪽: 검색 인풋 -->
            <div class="toolbar-right">
              <input
                  v-model="searchTitle"
                  type="text"
                  class="notice-search-input"
                  placeholder="제목을 입력하세요."
                  @keyup.enter.prevent
              />
            </div>
          </div>

          <!-- 공지사항 테이블 -->
          <table class="notice-table">
            <thead>
            <tr>
              <th class="col-title">제목</th>
              <th class="col-date">작성일</th>
              <th class="col-actions">작업</th>
            </tr>
            </thead>
            <tbody>
            <!-- ✅ 행 전체 클릭 시 모달로 상세 + 수정 -->
            <tr
                v-for="notice in filteredNotices"
                :key="notice.id"
                class="clickable-row"
                @click="openEditModal(notice)"
            >
              <td class="cell-title">
                {{ notice.title }}
              </td>
              <td class="cell-date">
                {{ notice.date }}
              </td>
              <td class="cell-actions">
                <!-- 삭제 버튼 클릭 시 행 클릭 막기 -->
                <button
                    type="button"
                    class="btn btn-small btn-danger delete-btn"
                    @click.stop="removeNotice(notice.id)"
                >
                  제거
                </button>
              </td>
            </tr>

            <!-- 공지 없을 때 -->
            <tr v-if="filteredNotices.length === 0">
              <td colspan="3" class="empty-row">
                검색 결과가 없습니다.
              </td>
            </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>

    <!-- ============= 모달 ============= -->
    <div
        v-if="isModalOpen"
        class="modal-overlay"
        @click.self="closeModal"
    >
      <div class="modal-container">
        <h2 class="modal-title">
          {{ modalMode === 'create' ? '공지사항 작성' : '공지사항 수정' }}
        </h2>

        <div class="modal-body">
          <div class="modal-field">
            <label class="modal-label">제목</label>
            <input
                v-model="modalNotice.title"
                type="text"
                class="modal-input"
                placeholder="제목을 입력하세요."
            />
          </div>

          <div class="modal-field">
            <label class="modal-label">내용</label>
            <textarea
                v-model="modalNotice.content"
                class="modal-textarea"
                placeholder="내용을 입력하세요."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-outline btn-small"
              @click="closeModal"
          >
            취소
          </button>
          <button
              type="button"
              class="btn btn-primary btn-small"
              @click="saveNotice"
          >
            {{ modalMode === 'create' ? '등록' : '수정 저장' }}
          </button>
        </div>
      </div>
    </div>
    <!-- =========== 모달 끝 =========== -->
  </div>
</template>

<style scoped>
/* 버튼 공통 스타일 */
@import "@/assets/shared/basic/buttons.css";

/* 페이지 전체 래퍼 */
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 상단 헤더 */
.admin-header {
  height: 80px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
  background-color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-png {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
}

/* 헤더 아래: 사이드바 + 컨텐츠 */
.admin-body {
  display: flex;
  flex: 1;
}

/* 사이드바 */
.admin-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e9ecef;
}

/* 컨텐츠 */
.admin-content {
  flex: 1;
  padding: 30px 40px 40px;
}

/* 페이지 타이틀 */
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* 공지 섹션 박스 */
.notice-section {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  padding: 20px 24px 24px;
}

/* 상단 툴바 */
.notice-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

/* 검색 인풋 */
.notice-search-input {
  width: 260px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #ced4da;
  padding: 0 16px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.notice-search-input:focus {
  outline: none;
  border-color: #6094c5;
  box-shadow: 0 0 0 2px rgba(96, 148, 197, 0.15);
}

/* 작성 버튼 */
.write-btn {
  min-width: 80px;
}

/* 공지 테이블 */
.notice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.notice-table thead {
  background-color: #f1f3f5;
}

.notice-table th,
.notice-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e9ecef;
}

.col-title {
  text-align: left;
}

.col-date {
  width: 120px;
  text-align: center;
}

.col-actions {
  width: 80px;
  text-align: center;
}

.cell-title {
  text-align: left;
}

.cell-date,
.cell-actions {
  text-align: center;
}

/* 행 클릭 가능 + 호버 효과 */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

/* 빨간 제거 버튼 */
.btn-danger {
  background-color: #ff4d4f;
  color: #ffffff;
  border: 1px solid #ff4d4f;
}

.btn-danger:hover:not(:disabled) {
  background-color: #e03131;
  border-color: #e03131;
}

/* 공지 없음 */
.empty-row {
  text-align: center;
  color: #868e96;
}


/* ========== 모달 스타일 ========== */

/* 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 모달 박스 (크기 키움) */
.modal-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  width: 720px;      /* 기본 너비 */
  max-width: 90vw;   /* 화면 작아지면 자동으로 줄어듦 */
  padding: 28px 32px 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* 내용 영역 */
.modal-body {
  margin-top: 16px;
  margin-bottom: 20px;
  max-height: 520px;   /* 세로도 넉넉하게 */
  overflow-y: auto;
}

.modal-field {
  margin-bottom: 16px;
}

.modal-label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #495057;
}

/* 제목 / 작성일 input */
.modal-input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
}

/* 내용 textarea – 기본 높이 크게 */
.modal-textarea {
  width: 100%;
  min-height: 240px;   /* 여기서 기본 높이 조절 */
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
  resize: vertical;
}

/* 포커스 공통 */
.modal-input:focus,
.modal-textarea:focus {
  outline: none;
  border-color: #6094c5;
  box-shadow: 0 0 0 2px rgba(96, 148, 197, 0.15);
}

/* 하단 버튼 영역 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}


</style>
