<template>
  <div class="member-list-view">
    <div class="search-bar">
      <el-input v-model="searchQuery.userEmail" placeholder="이메일" class="search-input" />
      <el-input v-model="searchQuery.userName" placeholder="이름" class="search-input" />
      <el-input v-model="searchQuery.userPhoneNumber" placeholder="전화번호" class="search-input" />
      <el-select v-model="searchQuery.activationStatus" placeholder="활성화 상태" class="search-input">
        <el-option label="승인" value="APPROVED" />
        <el-option label="대기" value="WAITING" />
        <el-option label="거절" value="REJECTED" />
      </el-select>
      <el-button type="primary" @click="() => searchMembers(1)">검색</el-button>
    </div>

    <el-table :data="members" style="width: 100%">
      <el-table-column prop="userCode" label="회원번호" width="100" />
      <el-table-column prop="userEmail" label="이메일" />
      <el-table-column prop="userName" label="이름" />
      <el-table-column prop="userPhoneNumber" label="전화번호" />

      <!-- 활성화 상태 -->
      <el-table-column label="활성화 상태">
        <template #default="scope">
          {{ formatStatus(scope.row.activationStatus) }}
        </template>
      </el-table-column>

      <!-- 상세보기 -->
      <el-table-column label="상세보기">
        <template #default="scope">
          <el-button type="text" @click="viewDetails(scope.row.userCode)">보기</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="bottom-pagination">
      <el-pagination
          v-if="pageInfo"
          @current-change="(page) => fetchUsersByRoleMembers(page)"
          :current-page="pageInfo?.page"
          :page-size="pageInfo?.size"
          :total="pageInfo?.totalElements"
          layout="prev, pager, next"
      />
    </div>

    <!-- 상세보기 모달 -->
    <el-dialog v-model="isDetailVisible" title="회원 상세 정보" width="50%">
      <EntrepreneurDetailView :userDetail="userDetail" />

      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isDetailVisible = false">닫기</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/* ===========================
   관리자 권한 체크 추가됨 🔥
=========================== */
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import { fetchUsers, searchUsers, fetchEntrepreneurDetail } from '@/api/user'
import EntrepreneurDetailView from './EntrepreneurDetailView.vue'

const router = useRouter();
const authStore = useAuthStore();

/* 🔐 관리자 권한 체크 */
onMounted(async () => {
  await authStore.loadFromToken();
  console.log("현재 사용자 role =", authStore.role);

  if (authStore.role !== "ADMIN") {
    alert("관리자만 접근할 수 있습니다.");
    return router.push("/");
  }

  // 관리자 확인 후 데이터 로드
  fetchUsersByRoleMembers();
});

/* ===========================
   기존 로직
=========================== */
const members = ref([])
const userRole = 'ENTREPRENEUR'
const userDetail = ref(null)
const isDetailVisible = ref(false)

const pageInfo = ref({
  page: 1,
  size: 10,
  totalElements: 0
})

const searchQuery = ref({
  userEmail: '',
  userName: '',
  userPhoneNumber: '',
  activationStatus: ''
})

const fetchUsersByRoleMembers = async (page = 1, size = pageInfo.value.size) => {
  try {
    const response = await fetchUsers(page, size, userRole)

    const raw = response.data.data.users || []
    members.value = raw.map(u => {
      const status =
          (u.entrepreneur && u.entrepreneur.entrepreneurStatus) ||
          u.entrepreneurStatus ||
          ''
      return { ...u, activationStatus: status }
    })

    const apiInfo = response.data.data.pageInfo || {}
    pageInfo.value = {
      page: apiInfo.page || 1,
      size: apiInfo.size || 10,
      totalElements: apiInfo.totalElements || 0
    }
  } catch (error) {
    console.error('회원 목록 오류:', error)
  }
}

const formatStatus = (s) => {
  if (!s) return ''
  const norm = String(s).toUpperCase()
  if (norm === 'APPROVED') return '승인'
  if (norm === 'WAITING' || norm === 'PENDING') return '대기'
  if (norm === 'REJECTED') return '거절'
  return norm
}

const searchMembers = async (page = 1) => {
  try {
    const response = await searchUsers(page, pageInfo.value.size, searchQuery.value)

    members.value = response.data.data.users

    const apiInfo = response.data.data.pageInfo || {}
    pageInfo.value = {
      page: apiInfo.page || 1,
      size: apiInfo.size || 10,
      totalElements: apiInfo.totalElements || 0
    }
  } catch (error) {
    console.error("회원 검색 오류:", error)
  }
}

const viewDetails = async (userCode) => {
  try {
    const response = await fetchEntrepreneurDetail(userCode)
    userDetail.value = response.data.data
    isDetailVisible.value = true
  } catch (error) {
    console.error("상세보기 오류:", error)
  }
}
</script>

<style scoped>
.member-list-view {
  margin-top: 20px;
}
.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.search-input {
  width: 200px;
}
.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.dialog-footer {
  text-align: right;
}
</style>
