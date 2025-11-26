<template>
    <div class="member-detail-view">
        <h2>회원 관리 - 회원 상세</h2>
        <div class="detail-container">
            <div class="detail-item">
                <span>이름:</span>
                <span>{{ userDetail.userName }}</span>
            </div>
            <div class="detail-item">
                <span>이메일 계정:</span>
                <span>{{ userDetail.userEmail }}</span>
            </div>
            <div class="detail-item">
                <span>전화번호:</span>
                <span>{{ userDetail.userPhoneNumber }}</span>
            </div>
            <div class="detail-item">
                <span>주소:</span>
                <span>{{ userDetail.address }}</span>
            </div>
            <div class="detail-item">
                <span>회원 상태:</span>
                <span>{{ userDetail.userRole }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>

// 부모 컴포넌트에서 전달받은 회원 상세 정보
defineProps({
    userDetail: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.member-detail-view {
    margin: 20px;
}
.detail-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}
</style>