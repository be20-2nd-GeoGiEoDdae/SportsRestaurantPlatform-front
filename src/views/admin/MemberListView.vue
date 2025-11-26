<template>
    <div class="member-list-view">
        <div class="search-bar">
            <el-input v-model="searchQuery.userEmail" placeholder="이메일" class="search-input" />
            <el-input v-model="searchQuery.userName" placeholder="이름" class="search-input" />
            <el-input v-model="searchQuery.userPhoneNumber" placeholder="전화번호" class="search-input" />
            <el-button type="primary" @click="() => searchMembers(1)">검색</el-button>
        </div>
        <el-table :data="members" style="width: 100%">
            <el-table-column prop="userCode" label="회원번호" width="100" />
            <el-table-column prop="userEmail" label="이메일" />
            <el-table-column prop="userName" label="이름" />
            <el-table-column prop="userPhoneNumber" label="전화번호" />
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
            <!--  MemberDetailView 컴포넌트 -->
            <MemberDetailView :userDetail="userDetail" />

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
import { fetchUsers, searchUsers, fetchUserDetail } from '@/api/user'
import MemberDetailView from './MemberDetailView.vue'

const members = ref([])             // 전체 회원 정보 
const userRole = 'USER'; // hardcoded role: USER (일반 회원)
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
    userPhoneNumber: ''
})

const fetchUsersByRoleMembers = async (page = 1, size = pageInfo.value.size) => {
  try {
    const role = userRole // use hardcoded role
    const response = await fetchUsers(page, size, role);
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
    console.error('회원 목록을 가져오는 중 오류 발생:', error);
  }
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
        const response = await fetchUserDetail(userCode); // userCode를 직접 전달
        userDetail.value = response.data.data;
        isDetailVisible.value = true; // 모달 표시
        console.log('Fetching details for userCode:', userCode)
        console.log('API response : ', response.data.data);
        console.log('userDetailVisible : ', isDetailVisible.value);
    } catch (error) {
        console.error('회원 상세 정보를 가져오는 중 오류 발생:', error);
    }
}

// 초기 데이터 로드(하드코딩된 userRole 사용)
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