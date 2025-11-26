<!-- ProfileView.vue -->
<template>
  <div class="profile-layout">
    <!-- 좌측 사이드바 -->
    <aside class="sidebar">
      <SidebarUser />
    </aside>

    <!-- 메인 -->
    <main class="content">
      <!-- 본문 -->
      <section class="profile-section">
        <div class="profile-card">
          <h2 class="page-title">프로필 조회</h2>

          <div class="profile-body">
            <!-- 왼쪽 프로필 폼 -->
            <el-form
                :model="form"
                label-position="top"
                class="profile-form"
            >
              <el-form-item label="이름">
                <el-input v-model="form.name" :disabled="!isEditing" />
              </el-form-item>

              <el-form-item label="이메일">
                <el-input v-model="form.email" :disabled="!isEditing" />
              </el-form-item>

              <el-form-item label="회원 상태">
                <el-input v-model="form.status" :disabled="true" />
              </el-form-item>

              <el-form-item label="주소">
                <el-input
                    v-model="form.address"
                    type="textarea"
                    :rows="2"
                    :disabled="!isEditing"
                />
              </el-form-item>
            </el-form>

            <!-- 오른쪽 프로필 이미지 영역 -->
            <div class="profile-right">
              <div class="avatar-circle">
                <span class="avatar-text">{{ initials }}</span>
              </div>
              <el-button
                  size="small"
                  class="avatar-btn"
                  @click="onClickChangeAvatar"
              >
                이미지 변경
              </el-button>
            </div>
          </div>

          <!-- 하단 버튼 -->
          <div class="profile-footer">
            <el-button
                type="primary"
                class="submit-btn"
                :loading="isSaving"
                @click="onClickEdit"
            >
              {{ isEditing ? "저장" : "수정" }}
            </el-button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
// 실제 API 이름/경로에 맞게 수정해서 사용
import { updateUserInfo } from "@/api/api.js";
import { ElMessage } from "element-plus";

const form = ref({
  name: "박인수",
  email: "phv0218@naver.com",
  status: "회원",
  address: "서울시 강북구 보라매로\n보라매 3층",
});

const isEditing = ref(false);
const isSaving = ref(false);

/** 이름에서 마지막 2글자 정도를 원형 안에 표시 */
const initials = computed(() => {
  const name = form.value.name || "";
  if (name.length >= 2) return name.slice(-2);
  if (name.length === 1) return name;
  return "";
});

// 수정 / 저장 버튼
const onClickEdit = async () => {
  // 아직 편집 모드가 아니면 편집모드 진입만
  if (!isEditing.value) {
    isEditing.value = true;
    return;
  }

  // 여기부터는 "저장" 눌렀을 때
  const dto = {
    name: form.value.name,
    email: form.value.email,
    address: form.value.address,
    // 필요하면 userCode 같은 것도 여기서 같이 보냄
    // userCode: userStore.userCode
  };

  try {
    isSaving.value = true;
    await updateUserInfo(dto); // 백엔드에 DTO 전달

    ElMessage.success("프로필이 저장되었습니다.");
    isEditing.value = false;
  } catch (e) {
    console.error(e);
    ElMessage.error(e.message || "프로필 저장 중 오류가 발생했습니다.");
  } finally {
    isSaving.value = false;
  }
};

const onClickChangeAvatar = () => {
  // TODO: 파일 업로드/이미지 변경 로직
  console.log("이미지 변경 클릭");
};
</script>

<style scoped>
@import "@/assets/mypage/mypageprofileedit.css";
</style>
