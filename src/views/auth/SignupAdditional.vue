<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/shared/basic/Button.vue'
import Input from '@/components/shared/basic/Input.vue'
import Label from '@/components/shared/basic/Label.vue'

const route = useRoute()
const router = useRouter()

/* ===========================
   상태 & 폼 데이터
=========================== */
const formData = reactive({
  userName: '',
  userPhoneNumber: '',
  userAddress: '',
  detailAddress: '',
  verificationCode: '',
  latitude: null,
  longitude: null
})

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

const errors = reactive({
  name: '',
  phone: '',
  verification: '',
  address: ''
})

const success = reactive({
  phone: '',
  verification: ''
})

/* ===========================
   초기 URL 체크
=========================== */
onMounted(() => {
  state.tempToken = route.query.tempToken || ''
  state.userEmail = route.query.email || ''

  if (!state.tempToken || !state.userEmail) {
    alert('올바르지 않은 접근입니다.')
    router.push('/')
  }
})

/* ===========================
   전화번호 포맷
=========================== */
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '')
  if (numbers.length <= 3) return numbers
  else if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3)
  else return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
}

const handlePhoneInput = (event) => {
  formData.userPhoneNumber = formatPhoneNumber(event.target.value)
}

/* ===========================
   인증번호 발송
=========================== */
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: formData.userPhoneNumber })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      success.phone = result.data
      state.showVerificationInput = true
      state.isVerificationSent = true

      state.verifyButtonDisabled = true
      state.verifyButtonText = '발송됨'

      setTimeout(() => {
        state.verifyButtonDisabled = false
        state.verifyButtonText = '인증번호 발송'
      }, 300000)

    } else {
      errors.phone = result.message || '인증번호 발송 실패'
    }
  } catch (error) {
    errors.phone = '네트워크 오류가 발생했습니다.'
  }
}

/* ===========================
   인증번호 검증
=========================== */
const verifyCode = async () => {
  if (!formData.verificationCode || formData.verificationCode.length !== 6) return

  try {
    const response = await fetch('/api/auth/sms/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    errors.verification = '네트워크 오류'
  }
}

/* ====================================================
   Google Places 자동완성 — 최종 안정형
==================================================== */
const addressInput = ref(null)

const getRealInput = (comp) => {
  if (!comp) return null

  if (comp.native instanceof HTMLElement) return comp.native
  if (comp.$el && comp.$el.querySelector) {
    const el = comp.$el.querySelector("input")
    if (el) return el
  }
  if (comp instanceof HTMLElement) return comp

  return null
}

onMounted(() => {
  if (window.google && window.google.maps) initAutocomplete()
  window.addEventListener("google-maps-ready", initAutocomplete)
})

const initAutocomplete = () => {
  const inputEl = getRealInput(addressInput.value)

  if (!inputEl) {
    console.warn("❌ Input DOM을 찾을 수 없음")
    return
  }
  if (!window.google || !window.google.maps) return

  const autocomplete = new google.maps.places.Autocomplete(inputEl, {
    fields: ["address_components", "geometry", "formatted_address"],
    componentRestrictions: { country: "kr" }
  })

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace()
    if (!place.geometry) return

    formData.userAddress = place.formatted_address
    formData.latitude = place.geometry.location.lat()
    formData.longitude = place.geometry.location.lng()
  })

  console.log("🔥 Google Autocomplete Enabled")
}

/* ===========================
   제출
=========================== */
const submitForm = async () => {
  if (!formData.userName.trim()) {
    errors.name = '이름을 입력해주세요.'
    return
  }

  if (!formData.userPhoneNumber.match(/^010-\d{4}-\d{4}$/)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다.'
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

  const fullAddress = formData.detailAddress
      ? formData.userAddress + ' ' + formData.detailAddress
      : formData.userAddress

  let socialId = ''
  let socialType = ''

  try {
    const tokenPayload = JSON.parse(atob(state.tempToken.split('.')[1]))
    socialId = tokenPayload.socialId
    socialType = tokenPayload.socialType
  } catch (error) {
    alert('인증 토큰 오류')
    return
  }

  const requestData = {
    userEmail: state.userEmail,
    userName: formData.userName,
    userPhoneNumber: formData.userPhoneNumber,
    userAddress: fullAddress,
    latitude: formData.latitude,
    longitude: formData.longitude,
    socialId,
    socialType
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
      router.push('/signup/complete')
    } else {
      alert('회원가입 실패: ' + (result.message || '알 수 없는 오류'))
    }

  } catch (error) {
    alert('네트워크 오류 발생')
  }
}
</script>

<template>
  <div class="signup-container">
    <div class="logo-section">
      <div class="logo-icon">🍽️</div>
      <div class="logo-text">거기어때?</div>
    </div>

    <h1 class="title">회원 정보 입력</h1>

    <form @submit.prevent="submitForm" class="signup-form">

      <div class="form-group">
        <Label required>이름</Label>
        <Input v-model="formData.userName" placeholder="이름 입력" full-width :variant="errors.name ? 'error' : 'default'" />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <Label required>전화번호</Label>
        <div class="phone-group">
          <Input
              :model-value="formData.userPhoneNumber"
              @input="handlePhoneInput"
              placeholder="010-1234-5678"
              full-width
          />
          <Button
              type="button"
              class="verify-btn"
              variant="primary"
              @click="sendVerificationCode"
              :disabled="state.verifyButtonDisabled"
          >
            {{ state.verifyButtonText }}
          </Button>
        </div>

        <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
        <div v-if="success.phone" class="success-message">{{ success.phone }}</div>
      </div>

      <div v-if="state.showVerificationInput" class="form-group">
        <Input
            v-model="formData.verificationCode"
            maxlength="6"
            placeholder="인증번호 입력"
            full-width
            :variant="errors.verification ? 'error' : state.isPhoneVerified ? 'primary' : 'default'"
            @blur="verifyCode"
        />
        <div v-if="errors.verification" class="error-message">{{ errors.verification }}</div>
        <div v-if="success.verification" class="success-message">{{ success.verification }}</div>
      </div>

      <div class="form-group">
        <Label required>주소</Label>

        <Input
            ref="addressInput"
            v-model="formData.userAddress"
            placeholder="주소 검색 (자동완성)"
            full-width
            class="address-input"
            :variant="errors.address ? 'error' : 'default'"
        />

        <Input
            v-model="formData.detailAddress"
            placeholder="상세주소 입력"
            full-width
            class="detail-address"
        />

        <div v-if="formData.latitude" class="coord-info">
          위도: {{ formData.latitude }} / 경도: {{ formData.longitude }}
        </div>

        <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
      </div>

      <Button
          type="submit"
          variant="primary"
          size="large"
          full-width
          :disabled="state.isSubmitting || !state.isPhoneVerified"
      >
        {{ state.isSubmitting ? '가입 중...' : '가입' }}
      </Button>

    </form>
  </div>
</template>

<style scoped>
.coord-info {
  margin-top: 6px;
  font-size: 12px;
  color: #555;
}
.signup-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background-light);
  padding: 20px;
}
.signup-form {
  background-color: var(--background-white);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-light);
  width: 100%;
  max-width: 480px;
}
.form-group { margin-bottom: 20px; }
.phone-group { display: flex; gap: 8px; }
.verify-btn { white-space: nowrap; min-width: 120px; }
.address-input { margin-bottom: 8px; }
.detail-address { margin-top: 8px; }
.error-message {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 4px;
}
.success-message {
  color: var(--success-color);
  font-size: 12px;
  margin-top: 4px;
}
</style>
