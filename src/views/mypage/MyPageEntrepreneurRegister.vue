<!-- BusinessRegister.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";

const businessNo = ref("");
const accountNumber = ref("");
const selectedBank = ref("");
const isBankPanelOpen = ref(false);

const bankList = ref([
  { code: "kb", name: "국민은행" },
  { code: "shinhan", name: "신한은행" },
  { code: "woori", name: "우리은행" },
  { code: "hana", name: "하나은행" },
  { code: "nh", name: "농협은행" },
  { code: "ibk", name: "기업은행" },
  { code: "sc", name: "SC제일은행" },
  { code: "citi", name: "씨티은행" },
  { code: "kakao", name: "카카오뱅크" },
  { code: "toss", name: "토스뱅크" },
]);

const toggleBankPanel = () => {
  isBankPanelOpen.value = !isBankPanelOpen.value;
};

const selectBank = (bank) => {
  selectedBank.value = bank.name;
  isBankPanelOpen.value = false;
};

const handleSubmit = () => {
  console.log("신청", {
    businessNo: businessNo.value,
    bank: selectedBank.value,
    accountNumber: accountNumber.value,
  });
};

/* ===== 고정 캔버스 스케일링 ===== */
const baseWidth = 1024;
const baseHeight = 768;
const canvasRef = ref(null);

const updateScale = () => {
  const el = canvasRef.value;
  if (!el) return;

  const scale = Math.min(
      window.innerWidth / baseWidth,
      window.innerHeight / baseHeight
  );
  el.style.transform = `scale(${scale})`;
};

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScale);
});
</script>

<template>
  <div class="viewport">
    <div class="canvas" ref="canvasRef">
      <div class="biz-page">

        <!-- 메인 레이아웃 -->
        <div class="main-layout">
          <!-- 왼쪽 사이드 메뉴 -->
            <SidebarUser/>

          <!-- 오른쪽 폼 영역 -->
          <main class="form-main">
            <div class="form-container">
              <h2 class="form-title">사업자 등록증 신청</h2>

              <!-- 사업자 등록증 번호 -->
              <div class="form-row">
                <label class="form-label">사업자 등록증 번호</label>
                <el-input
                    v-model="businessNo"
                    placeholder="사업자 등록증 번호를 입력해주세요"
                />
              </div>

              <!-- 계좌 선택 / 계좌번호 -->
              <div class="form-row bank-row">
                <label class="form-label">계좌 선택</label>
                <div class="bank-select-wrapper">
                  <div class="bank-display" @click="toggleBankPanel">
                    <span v-if="selectedBank">{{ selectedBank }}</span>
                    <span v-else class="placeholder">은행 선택</span>
                    <span class="arrow">▼</span>
                  </div>

                  <!-- 오른쪽 은행 선택 패널 -->
                  <div v-if="isBankPanelOpen" class="bank-panel">
                    <button class="scroll-arrow">▲</button>
                    <div class="bank-grid">
                      <button
                          v-for="bank in bankList"
                          :key="bank.code"
                          class="bank-item"
                          @click="selectBank(bank)"
                      >
                        <!-- 아이콘 자리는 원형 배경 + 이니셜로 처리 -->
                        <span class="bank-icon">
                          {{ bank.name.slice(0, 1) }}
                        </span>
                        <span class="bank-name">{{ bank.name }}</span>
                      </button>
                    </div>
                    <button class="scroll-arrow">▼</button>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">계좌 번호</label>
                <el-input
                    v-model="accountNumber"
                    placeholder="123-456789-10"
                />
              </div>

              <!-- 사업자 등록증 업로드 박스 -->
              <div class="form-row">
                <label class="form-label">사업자 등록증</label>
                <div class="upload-wrapper">
                  <div class="upload-box">
                    <span class="upload-preview">사진</span>
                  </div>
                  <el-button size="small" class="upload-btn">
                    파일 선택
                  </el-button>
                </div>
              </div>

              <!-- 신청 버튼 -->
              <div class="form-row submit-row">
                <el-button
                    type="primary"
                    class="submit-btn"
                    @click="handleSubmit"
                >
                  신청
                </el-button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 캔버스/뷰포트 ===== */
@import '@/assets/mypage/mypageentrepreneuregister.css';
</style>
