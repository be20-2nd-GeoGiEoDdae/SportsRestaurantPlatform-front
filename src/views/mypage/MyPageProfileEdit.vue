<!-- ProfileView.vue -->
<template>
  <div class="profile-layout">
    <!-- 좌측 사이드바 -->
    <aside class="sidebar">
      <SidebarUser />
    </aside>

    <!-- 메인 -->
    <main class="content">
      <section class="profile-section">
        <div class="profile-card">
          <h2 class="page-title">프로필 조회</h2>

          <div class="profile-body">
            <!-- 왼쪽 폼 -->
            <el-form :model="form" label-position="top" class="profile-form">
              <el-form-item label="이름">
                <el-input v-model="form.name" :disabled="!isEditing" />
              </el-form-item>

              <el-form-item label="이메일">
                <el-input v-model="form.email" :disabled="true" />
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

            <!-- 오른쪽 프로필 이미지 -->
            <div class="profile-right">
              <div class="avatar-circle">
                <span class="avatar-text">{{ initials }}</span>
              </div>
              <el-button size="small" class="avatar-btn" @click="onClickChangeAvatar">
                이미지 변경
              </el-button>
            </div>
          </div>

          <!-- 버튼 -->
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
import { ref, computed, onMounted } from "vue";
import SidebarUser from "@/components/shared/sidebar/user/SidebarUser.vue";
import { ElMessage } from "element-plus";

import { getAuthUser } from "@/utils/auth";
import { getUserDetail, updateUserInfo } from "@/api/api.js";

/* -------------------------
   상태
------------------------- */
const userId = ref(null);

const form = ref({
  name: "",
  email: "",
  status: "",
  address: "",
});

const isEditing = ref(false);
const isSaving = ref(false);

/* -------------------------
   이름 이니셜
------------------------- */
const initials = computed(() => {
  const name = form.value.name || "";
  return name.length >= 2 ? name.slice(-2) : name;
});

/* -------------------------
   mount 시 프로필 로딩
------------------------- */
onMounted(async () => {
  const auth = getAuthUser();

  if (!auth) {
    ElMessage.error("로그인이 필요합니다.");
    return;
  }

  // JWT에서 userCode (= sub)
  userId.value = auth.sub;

  try {
    const user = await getUserDetail(userId.value);

    form.value.name = user.userName;
    form.value.email = user.userEmail;
    form.value.status = user.userRole;
    form.value.address = user.userAddress;
  } catch (e) {
    console.error(e);
    ElMessage.error("프로필 정보를 불러올 수 없습니다.");
  }
});

/* -------------------------
   수정 및 저장
------------------------- */
const onClickEdit = async () => {
  if (!isEditing.value) {
    isEditing.value = true;
    return;
  }

  const dto = {
    userCode: userId.value,
    userName: form.value.name,
    userEmail: form.value.email,
    userAddress: form.value.address,
  };

  try {
    isSaving.value = true;
    await updateUserInfo(dto);

    ElMessage.success("프로필이 저장되었습니다.");
    isEditing.value = false;
  } catch (e) {
    console.error(e);
    ElMessage.error("프로필 저장 중 오류가 발생했습니다.");
  } finally {
    isSaving.value = false;
  }
};

const onClickChangeAvatar = () => {
  console.log("이미지 변경 클릭");
};
</script>


<style scoped>
@import "@/assets/mypage/mypageprofileedit.css";
</style>
