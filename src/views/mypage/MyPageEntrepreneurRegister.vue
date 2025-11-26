<!-- BusinessRegister.vue -->
<script setup>
import { ref } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
// 실제 API 이름/경로에 맞게 수정해서 사용
import {entrepreneurChangeUserRole, entrepreneurRegister} from "@/api/api.js";
import { ElMessage } from "element-plus";

const businessNo = ref("");
const accountNumber = ref("");
const selectedBank = ref("");
const isBankPanelOpen = ref(false);
const isSubmitting = ref(false); // 신청 버튼 로딩 상태

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
  selectedBank.value = bank.name; // 화면 표시용
  isBankPanelOpen.value = false;
};

const handleSubmit = async () => {
  // DTO 구성
  const dto = {
    entrepreneurId:Number(businessNo.value),
    //bank: selectedBank.value,      // 필요하면 code 로 변경해서 전송

    entrepreneurCertificateUrl:"qwer1234",
    entrepreneurBankAccount:Number(accountNumber.value),//문자로 변경 필요 엔티티
    userCode:6,
    // TODO: 사업자 등록증 파일도 업로드하면 여기서 같이 붙이기
  };

  try {
    isSubmitting.value = true;
    await entrepreneurRegister(dto);

    ElMessage.success("사업자 등록증 신청이 완료되었습니다.");
    await entrepreneurChangeUserRole(6,"ENTREPRENEUR")// 백엔드로 DTO 전송

    // 성공 후 초기화가 필요하면 여기서 초기화
    // businessNo.value = "";
    // accountNumber.value = "";
    // selectedBank.value = "";
  } catch (e) {
    console.error(e);
    ElMessage.error(e.message || "신청 중 오류가 발생했습니다.");
    ElMessage.error(e.response.data);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="biz-page">
    <!-- 사이드바 + 본문 -->
    <div class="biz-body">
      <!-- 왼쪽 사이드 메뉴 -->
      <aside class="biz-sidebar">
        <SidebarUser />
      </aside>

      <!-- 오른쪽 폼 영역 -->
      <main class="biz-content">
        <section class="form-section">
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
                  :loading="isSubmitting"
                  @click="handleSubmit"
              >
                신청
              </el-button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/mypage/mypageentrepreneuregister.css";
</style>
