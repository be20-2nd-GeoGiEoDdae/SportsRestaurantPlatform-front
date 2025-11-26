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
            <!-- <el-table-column prop="activationStatus" label="활성화 상태" /> -->
            <el-table-column label="활성화 상태">
                <template #default="scope">
                    {{ formatStatus(scope.row.activationStatus) }}
                </template>
            </el-table-column>
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
        <!-- 회원 상세보기 -->
        <el-dialog
            v-model="isDetailVisible"
            title="회원 상세 정보"
            width="50%"
        >
            <!--  EntrepreneurDetailView 컴포넌트 -->
            <EntrepreneurDetailView :userDetail="userDetail" />

            <!-- 모달 하단 버튼 -->
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="isDetailVisible = false">닫기</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchUsers, searchUsers, fetchEntrepreneurDetail } from '@/api/user'
import EntrepreneurDetailView from './EntrepreneurDetailView.vue'

const members = ref([])             // 전체 회원 정보 
const userRole = 'ENTREPRENEUR'; // hardcoded role for entrepreneur view
const userDetail = ref(null);       // 회원 상세 정보 상태
const isDetailVisible = ref(false); // 상세보기 모달 가시성 상태

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

// const fetchUsersByRoleMembers = async (page = 1, size = pageInfo.value.size) => {
//   try {
//     const role = userRole
//     const response = await fetchUsers(page, size, role)
//     members.value = response.data.data.users || []
//     console.log('members : ', members.value)

//     const apiPageInfo = response.data.data.pageInfo || {}
//     pageInfo.value = {
//         page: apiPageInfo.page || 1,
//         size: apiPageInfo.size || 10,
//         totalElements: apiPageInfo.totalElements || 0
//     }
//     console.log('pageInfo : ', pageInfo.value)
//   } catch (error) {
//     console.error('회원 목록을 가져오는 중 오류 발생:', error)
//   }
// }

const fetchUsersByRoleMembers = async (page = 1, size = pageInfo.value.size) => {
    try {
        const role = userRole
        const response = await fetchUsers(page, size, role)
        //members.value = response.data.data.users || []
        const raw = response.data.data.users || []
        members.value = raw.map(u => {
            // 우선순위: nested entrepreneur 엔터티의 entrepreneurStatus -> top-level entrepreneurStatus -> 빈값
            const status = (u.entrepreneur && u.entrepreneur.entrepreneurStatus)
                            || u.entrepreneurStatus
                            || ''
            return {
                ...u,
                activationStatus: status // 실제 원시 상태값 저장 (화면 표시 시 formatStatus 사용)
            }
        })

        const apiPageInfo = response.data.data.pageInfo || {}
        pageInfo.value = {
            page: apiPageInfo.page || 1,
            size: apiPageInfo.size || 10,
            totalElements: apiPageInfo.totalElements || 0
        }
        console.log('pageInfo : ', pageInfo.value)
    } catch (error) {
        console.error('회원 목록을 가져오는 중 오류 발생:', error)
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
    const response = await searchUsers(page, pageInfo.value.size, searchQuery.value);
        members.value = response.data.data.users;
        console.log('members : ', members.value);

        const apiPageInfo = response.data.data.pageInfo || {};
        pageInfo.value = {
            page: apiPageInfo.page || 1,
            size: apiPageInfo.size || 10,
            totalElements: apiPageInfo.totalElements || 0
        };
        console.log('pageInfo : ', pageInfo.value);
    } catch (error) {
        console.error('회원 검색 중 오류 발생:', error);
    }
}
 
const viewDetails = async (userCode) => {
    try {
        const response = await fetchEntrepreneurDetail(userCode); // userCode를 직접 전달
        userDetail.value = response.data.data;
        isDetailVisible.value = true; // 모달 표시
        console.log('Fetching details for userCode:', userCode)
        console.log('API response : ', response.data.data);
        console.log('userDetailVisible : ', isDetailVisible.value);
    } catch (error) {
        console.error('회원 상세 정보를 가져오는 중 오류 발생:', error);
    }
}
 
 // 초기 데이터 로드
fetchUsersByRoleMembers()
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