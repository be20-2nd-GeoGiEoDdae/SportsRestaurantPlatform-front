<template>
  <div class="entrepreneur-detail">
    <el-form :model="form" label-width="120px" class="detail-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="이름">
            <el-input v-model="form.userName" readonly />
          </el-form-item>

          <el-form-item label="이메일">
            <el-input v-model="form.userEmail" readonly />
          </el-form-item>

          <el-form-item label="주소">
            <el-input v-model="form.userAddress" readonly />
          </el-form-item>

          <el-form-item label="전화번호">
            <el-input v-model="form.userPhoneNumber" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="사업자 계좌번호">
            <el-input v-model="form.accountNumber" />
          </el-form-item>

          <el-form-item label="사업자 등록번호">
            <el-input v-model="form.businessNumber" />
          </el-form-item>

          <el-form-item label="사업자 등록 URL">
            <el-input v-model="form.businessUrl" />
          </el-form-item>

          <el-form-item label="사업자 활성화 상태">
            <el-select v-model="form.activationStatus" placeholder="선택">
              <el-option label="승인" value="APPROVED" />
              <el-option label="대기" value="WAITING" />
              <el-option label="거절" value="REJECTED" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row justify="end" class="footer-row">
        <el-button @click="onClose">닫기</el-button>
        <el-button type="primary" @click="onApply">적용</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  userDetail: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['apply', 'close'])

// local editable form (copy from prop to avoid mutating parent object directly)
const form = reactive({
  userCode: null,
  userName: '',
  userEmail: '',
  userPhoneNumber: '',
  userAddress: '',
  accountNumber: '',
  businessNumber: '',
  businessUrl: '',
  activationStatus: ''
})

// update form whenever prop changes
watch(
  () => props.userDetail,
  (val) => {
    if (!val) return
    form.userCode = val.userCode ?? null
    form.userName = val.userName ?? ''
    form.userEmail = val.userEmail ?? ''
    form.userPhoneNumber = val.userPhoneNumber ?? ''
    // backend field names may differ; adapt if needed
    form.userAddress = val.userAddress ?? val.address ?? ''
    form.accountNumber = val.accountNumber ?? val.businessAccountNumber ?? ''
    form.businessNumber = val.businessNumber ?? val.businessRegNumber ?? ''
    form.businessUrl = val.businessUrl ?? ''
    form.activationStatus = val.activationStatus ?? val.userRole ?? ''
  },
  { immediate: true }
)

const onApply = () => {
  // emit updated data to parent; parent should call API to persist
  emit('apply', { ...form })
}

const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.entrepreneur-detail {
  padding: 12px 8px;
}
.detail-form {
  max-width: 900px;
}
.footer-row {
  margin-top: 16px;
  gap: 8px;
}
</style>