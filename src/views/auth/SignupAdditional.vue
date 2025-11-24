<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/shared/basic/Button.vue'
import Input from '@/components/shared/basic/Input.vue'
import Label from '@/components/shared/basic/Label.vue'

const route = useRoute()
const router = useRouter()

// 폼 데이터
const formData = reactive({
  userName: '',
  userPhoneNumber: '',
  userAddress: '',
  detailAddress: '',
  verificationCode: ''
})

// 상태 관리
const state = reactive({
  tempToken: '',
  userEmail: '',
  isPhoneVerified: false,
  isVerificationSent: false,
  showVerificationInput: false,
  isSubmitting: false,
  verifyButtonDisabled: false,
  verifyButtonText: '인증번호 발송'
})

// 에러 메시지
const errors = reactive({
  name: '',
  phone: '',
  verification: '',
  address: ''
})

// 성공 메시지
const success = reactive({
  phone: '',
  verification: ''
})

// URL 파라미터에서 토큰과 이메일 추출
onMounted(() => {
  state.tempToken = route.query.tempToken || ''
  state.userEmail = route.query.email || ''
  
  if (!state.tempToken || !state.userEmail) {
    alert('올바르지 않은 접근입니다.')
    router.push('/')
  }
})

// 전화번호 포맷팅
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '')
  
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return numbers.slice(0, 3) + '-' + numbers.slice(3)
  } else {
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
  }
}

// 전화번호 입력 이벤트
const handlePhoneInput = (event) => {
  formData.userPhoneNumber = formatPhoneNumber(event.target.value)
}

// 인증번호 발송
const sendVerificationCode = async () => {
  const phoneRegex = /^010-\d{4}-\d{4}$/
  
  if (!phoneRegex.test(formData.userPhoneNumber)) {
    errors.phone = '올바른 전화번호를 입력해주세요 (010-1234-5678)'
    return
  }

  errors.phone = ''
  
  try {
    const response = await fetch('/api/auth/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber: formData.userPhoneNumber })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      success.phone = result.data
      state.showVerificationInput = true
      state.isVerificationSent = true
      
      // 버튼 비활성화
      state.verifyButtonDisabled = true
      state.verifyButtonText = '발송됨'
      
      // 5분 후 재활성화
      setTimeout(() => {
        state.verifyButtonDisabled = false
        state.verifyButtonText = '인증번호 발송'
      }, 300000) // 5분
      
    } else {
      errors.phone = result.message || '인증번호 발송에 실패했습니다.'
    }
  } catch (error) {
    console.error('SMS 발송 오류:', error)
    errors.phone = '네트워크 오류가 발생했습니다.'
  }
}

// 인증번호 확인
const verifyCode = async () => {
  if (!formData.verificationCode || formData.verificationCode.length !== 6) {
    return
  }
  
  try {
    const response = await fetch('/api/auth/sms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phoneNumber: formData.userPhoneNumber,
        verificationCode: formData.verificationCode 
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      errors.verification = ''
      success.verification = result.data
      state.isPhoneVerified = true
    } else {
      success.verification = ''
      errors.verification = result.message || '인증번호가 올바르지 않습니다.'
    }
  } catch (error) {
    console.error('인증번호 확인 오류:', error)
    errors.verification = '네트워크 오류가 발생했습니다.'
  }
}

// 주소 검색
const searchAddress = () => {
  alert('주소 검색 기능은 추후 구현 예정입니다.')
}

// 폼 제출
const submitForm = async () => {
  // 유효성 검사
  if (!formData.userName.trim()) {
    errors.name = '이름을 입력해주세요.'
    return
  }

  if (!formData.userPhoneNumber.match(/^010-\d{4}-\d{4}$/)) {
    errors.phone = '올바른 전화번호를 입력해주세요.'
    return
  }

  if (!state.isPhoneVerified) {
    errors.verification = '전화번호 인증을 완료해주세요.'
    return
  }

  if (!formData.userAddress.trim()) {
    errors.address = '주소를 입력해주세요.'
    return
  }

  // 에러 초기화
  Object.keys(errors).forEach(key => errors[key] = '')

  state.isSubmitting = true

  // 상세주소와 기본주소 결합
  const fullAddress = formData.detailAddress 
    ? formData.userAddress + ' ' + formData.detailAddress 
    : formData.userAddress

  // JWT 토큰에서 소셜 정보 추출
  let socialId = ''
  let socialType = ''
  
  try {
    const tokenPayload = JSON.parse(atob(state.tempToken.split('.')[1]))
    socialId = tokenPayload.socialId
    socialType = tokenPayload.socialType
  } catch (error) {
    console.error('토큰 파싱 오류:', error)
    alert('인증 정보가 올바르지 않습니다.')
    state.isSubmitting = false
    return
  }

  // API 호출
  const requestData = {
    userEmail: state.userEmail,
    userName: formData.userName,
    userPhoneNumber: formData.userPhoneNumber,
    userAddress: fullAddress,
    socialId: socialId,
    socialType: socialType
  }

  try {
    const response = await fetch('/api/auth/social-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.tempToken
      },
      body: JSON.stringify(requestData)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // 회원가입 완료 페이지로 이동
      router.push('/signup/complete')
    } else {
      alert('회원가입 실패: ' + (result.message || '알 수 없는 오류'))
    }
  } catch (error) {
    console.error('API 호출 오류:', error)
    alert('네트워크 오류가 발생했습니다.')
  }
  
  state.isSubmitting = false
}
</script>

<template>
  <div class="signup-container">
    <!-- 로고 영역 -->
    <div class="logo-section">
      <div class="logo-icon">🍽️</div>
      <div class="logo-text">거기어때?</div>
    </div>

    <!-- 제목 -->
    <h1 class="title">회원 정보 입력</h1>

    <!-- 폼 -->
    <form @submit.prevent="submitForm" class="signup-form">
      <!-- 이름 입력 -->
      <div class="form-group">
        <Label for="userName" required>이름</Label>
        <Input
          id="userName"
          v-model="formData.userName"
          type="text"
          placeholder="이름을 입력해주세요"
          full-width
          :variant="errors.name ? 'error' : 'default'"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <!-- 전화번호 입력 -->
      <div class="form-group">
        <Label for="userPhoneNumber" required>전화번호</Label>
        <div class="phone-group">
          <Input
            id="userPhoneNumber"
            :model-value="formData.userPhoneNumber"
            @input="handlePhoneInput"
            type="tel"
            placeholder="010-1234-5678"
            class="phone-input"
            :variant="errors.phone ? 'error' : 'default'"
          />
          <Button
            type="button"
            @click="sendVerificationCode"
            :disabled="state.verifyButtonDisabled"
            variant="primary"
            class="verify-btn"
          >
            {{ state.verifyButtonText }}
          </Button>
        </div>
        <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
        <div v-if="success.phone" class="success-message">{{ success.phone }}</div>
      </div>

      <!-- 인증번호 입력 -->
      <div v-if="state.showVerificationInput" class="form-group">
        <Input
          v-model="formData.verificationCode"
          type="text"
          placeholder="인증번호를 입력해주세요"
          maxlength="6"
          full-width
          :variant="errors.verification ? 'error' : state.isPhoneVerified ? 'primary' : 'default'"
          :readonly="state.isPhoneVerified"
          @blur="verifyCode"
        />
        <div v-if="errors.verification" class="error-message">{{ errors.verification }}</div>
        <div v-if="success.verification" class="success-message">{{ success.verification }}</div>
      </div>

      <!-- 주소 입력 -->
      <div class="form-group">
        <Label for="userAddress" required>주소</Label>
        <div class="address-group">
          <Input
            id="userAddress"
            v-model="formData.userAddress"
            type="text"
            placeholder="주소를 입력해주세요"
            class="address-input"
            :variant="errors.address ? 'error' : 'default'"
          />
          <Button
            type="button"
            @click="searchAddress"
            variant="primary"
            class="search-btn"
          >
            검색
          </Button>
        </div>
        <!-- 상세주소 -->
        <Input
          v-model="formData.detailAddress"
          type="text"
          placeholder="상세주소를 입력해주세요"
          full-width
          class="detail-address"
        />
        <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
      </div>

      <!-- 제출 버튼 -->
      <Button
        type="submit"
        variant="primary"
        size="large"
        full-width
        :disabled="state.isSubmitting || !state.isPhoneVerified"
        class="submit-btn"
      >
        {{ state.isSubmitting ? '가입 중...' : '가입' }}
      </Button>
    </form>
  </div>
</template>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo-icon {
  background-color: #4FC3F7;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #4FC3F7;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.signup-form {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
}

.form-group {
  margin-bottom: 20px;
}

.phone-group {
  display: flex;
  gap: 8px;
}

.phone-input {
  flex: 1;
}

.verify-btn {
  white-space: nowrap;
  min-width: 120px;
}

.address-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.address-input {
  flex: 1;
}

.search-btn {
  white-space: nowrap;
  min-width: 80px;
}

.detail-address {
  margin-top: 8px;
}

.submit-btn {
  margin-top: 30px;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.success-message {
  color: #4caf50;
  font-size: 12px;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .signup-form {
    padding: 20px;
    margin: 10px;
  }
  
  .phone-group,
  .address-group {
    flex-direction: column;
  }
  
  .verify-btn,
  .search-btn {
    margin-top: 8px;
  }
}
</style>
