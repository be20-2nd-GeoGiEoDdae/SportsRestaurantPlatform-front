<template>
  <div class="admin-page">
    <!-- 헤더 아래: 사이드바 + 본문 -->
    <div class="admin-body">
      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">회원관리 - 사업자</h1>

        <!-- 공지 리스트 + 검색/작성 영역 -->
        <section class="notice-section">
          <EntrepreneurListView />
        </section>
      </main>
    </div>

  </div>
</template>

<script setup>
import SidebarAdmin from '@/components/shared/sidebar/admin/SidebarAdmin.vue';
import EntrepreneurListView from './EntrepreneurListView.vue';

</script>

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

</style>