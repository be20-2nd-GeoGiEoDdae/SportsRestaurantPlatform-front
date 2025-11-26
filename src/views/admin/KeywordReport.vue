<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import SidebarAdmin from '@/components/shared/sidebar/admin/SidebarAdmin.vue'

const router = useRouter();
const authStore = useAuthStore();

/* ============================
    🔥 관리자 권한 체크
=============================== */
onMounted(async () => {
  // JWT에서 사용자 정보 로드
  await authStore.loadFromToken();

  console.log("🔐 현재 사용자 role =", authStore.role);


  if (authStore.role !== "ROLE_ADMIN") {
    alert("관리자만 접근할 수 있습니다.");
    return router.push("/");
  }
});

const newKeyword = ref('');
const keywords = ref(['불친절', '사기', '위생 불량']);

const addKeyword = () => {
  const value = newKeyword.value.trim();
  if (!value) return;

  if (keywords.value.includes(value)) {
    newKeyword.value = '';
    return;
  }
  keywords.value.push(value);
  newKeyword.value = '';
};

const removeKeyword = (index) => {
  keywords.value.splice(index, 1);
};
</script>


<template>
  <div class="admin-page">
    <!-- 헤더 아래: 사이드바 + 본문 -->
    <div class="admin-body">
      <aside class="admin-sidebar">
        <SidebarAdmin />
      </aside>

      <main class="admin-content">
        <h1 class="page-title">키워드 관리 - 신고</h1>

        <!-- 키워드 입력 영역 -->
        <section class="keyword-section">
          <h2 class="section-title">키워드 입력</h2>

          <div class="keyword-input-row">
            <input
                v-model="newKeyword"
                type="text"
                class="keyword-input"
                placeholder="키워드를 입력하세요."
                @keyup.enter="addKeyword"
            />
            <button
                type="button"
                class="btn btn-primary btn-medium keyword-add-btn"
                @click="addKeyword"
            >
              추가
            </button>
          </div>
        </section>

        <!-- 키워드 내역 영역 -->
        <section class="keyword-section keyword-list-section">
          <h2 class="section-title">키워드 내역</h2>

          <!-- 키워드 태그들 -->
          <div class="keyword-chips">
            <div
                v-for="(keyword, index) in keywords"
                :key="keyword"
                class="keyword-chip"
            >
              <span class="keyword-text">{{ keyword }}</span>
              <button
                  type="button"
                  class="keyword-remove"
                  @click="removeKeyword(index)"
              >
                ✕
              </button>
            </div>

            <!-- 키워드가 하나도 없을 때 -->
            <p v-if="keywords.length === 0" class="keyword-empty">
              등록된 키워드가 없습니다. 상단에서 키워드를 추가해주세요.
            </p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 버튼 공통 스타일 (.btn, .btn-primary 등) */
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

/* 공통 섹션 박스 */
.keyword-section {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 키워드 입력 줄 */
.keyword-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.keyword-input {
  flex: 1;
  height: 40px;
  border-radius: 999px;
  border: 1px solid #ced4da;
  padding: 0 18px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.keyword-input:focus {
  outline: none;
  border-color: #6094c5;
  box-shadow: 0 0 0 2px rgba(96, 148, 197, 0.15);
}

/* 추가 버튼은 버튼 시스템 디자인 사용 */
.keyword-add-btn {
  min-width: 80px;
}

/* 키워드 내역 섹션 */
.keyword-list-section {
  margin-top: 8px;
}

/* 키워드 칩 리스트 */
.keyword-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  margin-bottom: 16px;
}

.keyword-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px 6px 14px;
  border-radius: 999px;
  background-color: #e8f4fd;
  color: #1c7ed6;
  font-size: 13px;
  border: 1px solid #c5e4ff;
}

.keyword-text {
  margin-right: 6px;
}

.keyword-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  color: #1c7ed6;
  padding: 0 2px;
}

.keyword-remove:hover {
  color: #1864ab;
}

/* 키워드 없을 때 */
.keyword-empty {
  font-size: 13px;
  color: #868e96;
}

/* 반응형 약간만 */
@media (max-width: 1024px) {
  .admin-content {
    padding: 20px;
  }

  .keyword-input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .keyword-add-btn {
    align-self: flex-end;
  }
}
</style>
