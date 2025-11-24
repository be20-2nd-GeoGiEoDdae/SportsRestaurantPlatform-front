<script setup>
import { ref } from 'vue'

import Layout from '@/components/shared/layout/Layout.vue'
import Button from '@/components/shared/basic/Button.vue'
import Input from '@/components/shared/basic/Input.vue'
import Label from '@/components/shared/basic/Label.vue'
import Text from '@/components/shared/basic/Text.vue'
import Checkbox from '@/components/shared/form/Checkbox.vue'
import Dropdown from '@/components/shared/form/Dropdown.vue'
import Radio from '@/components/shared/form/Radio.vue'
import Slider from '@/components/shared/form/Slider.vue'
import Modal from '@/components/shared/feedback/Modal.vue'
import Toast from '@/components/shared/feedback/Toast.vue'
import Alert from '@/components/shared/feedback/Alert.vue'
import SidebarAdmin from '@/components/shared/sidebar/admin/SidebarAdmin.vue'
import SidebarEntrepreneur from '@/components/shared/sidebar/entrepreneur/SidebarEntrepreneur.vue'
import SidebarUser from '@/components/shared/sidebar/user/SidebarUser.vue'

// 반응형 변수
const email = ref('')
const selectedDropdown = ref('')
const isChecked = ref(false)
const checkboxArray = ref([])
const selectedRadio = ref('')
const sliderValue = ref(50)
const showModal = ref(false)
const showToast = ref(false)

const dropdownOptions = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' }
]

const showSuccessToast = () => (showToast.value = true)
const openModal = () => (showModal.value = true)
const handleModalConfirm = () => {
  alert('확인 버튼이 클릭되었습니다!')
  showModal.value = false
}
</script>

<template>
  <div class="app-container">
    <Layout />

    <div class="main-content">
      <!-- 제목 -->
      <div class="page-header">
        <Text tag="h1" size="2xl" color="primary" weight="bold">
          컴포넌트 라이브러리 샘플
        </Text>
        <Text color="secondary">
          모든 컴포넌트들의 다양한 스타일과 기능을 확인해보세요
        </Text>
      </div>

      <!-- Sidebar Preview -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">
          📱 Sidebar Components
        </Text>
        <div class="sidebar-demos">
          <div class="sidebar-demo">
            <Text weight="medium">관리자 사이드바</Text>
            <SidebarAdmin />
          </div>
          <div class="sidebar-demo">
            <Text weight="medium">사업자 사이드바</Text>
            <SidebarEntrepreneur />
          </div>
          <div class="sidebar-demo">
            <Text weight="medium">사용자 사이드바</Text>
            <SidebarUser />
          </div>
        </div>
      </section>

      <!-- Button -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">
          🔘 Basic Components
        </Text>

        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Buttons</Text>
          <div class="button-grid">
            <Button size="small" variant="primary">작은 버튼</Button>
            <Button size="medium" variant="primary">중간 버튼</Button>
            <Button size="large" variant="primary">큰 버튼</Button>
            <Button variant="secondary">보조 버튼</Button>
            <Button variant="outline">테두리 버튼</Button>
            <Button disabled>비활성 버튼</Button>
          </div>
        </div>

        <!-- Text -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Text Styles</Text>
          <div class="text-samples">
            <Text tag="h1" size="2xl" weight="bold">Heading 1</Text>
            <Text tag="h2" size="xl" weight="semibold" color="primary">Heading 2</Text>
            <Text tag="h3" size="large" weight="medium">Heading 3</Text>
            <Text size="medium">일반 텍스트</Text>
            <Text size="small" color="secondary">작은 텍스트</Text>
            <Text size="xs" color="muted">아주 작은 텍스트</Text>
            <Text color="success">성공 메시지</Text>
            <Text color="warning">경고 메시지</Text>
            <Text color="error">오류 메시지</Text>
          </div>
        </div>

        <!-- Input -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Input Fields</Text>
          <div class="input-samples">
            <div class="input-group">
              <Label for="email" required>이메일</Label>
              <Input id="email" v-model="email" type="email" placeholder="이메일 입력" fullWidth />
            </div>

            <div class="input-group">
              <Label size="small">작은 라벨</Label>
              <Input size="small" placeholder="작은 필드" />
            </div>

            <div class="input-group">
              <Label size="large">큰 라벨</Label>
              <Input size="large" placeholder="큰 필드" />
            </div>
          </div>
        </div>
      </section>

      <!-- Form Components -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">📝 Form Components</Text>

        <!-- Dropdown -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Dropdown</Text>
          <div class="form-samples">
            <div class="form-item">
              <Label>음식 종류 선택</Label>
              <Dropdown v-model="selectedDropdown" :options="dropdownOptions" placeholder="선택하세요" />
            </div>

            <div class="form-item">
              <Label>작은 드롭다운</Label>
              <Dropdown :options="dropdownOptions" size="small" placeholder="작은 크기" />
            </div>
          </div>
        </div>

        <!-- Checkbox -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Checkboxes</Text>
          <div class="checkbox-samples">
            <Checkbox v-model="isChecked" label="기본 체크" />
            <Checkbox size="small" label="작은 체크" />
            <Checkbox size="large" variant="success" label="성공 체크" />
            <Checkbox variant="warning" label="경고 체크" />
            <Checkbox variant="error" label="오류 체크" />
            <Checkbox disabled label="비활성" />
          </div>
        </div>

        <!-- Radio -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Radio Buttons</Text>

          <div class="radio-samples">
            <Text weight="medium">성별 선택</Text>
            <div class="radio-group">
              <Radio v-model="selectedRadio" name="gender" value="male" label="남성" />
              <Radio v-model="selectedRadio" name="gender" value="female" label="여성" />
              <Radio v-model="selectedRadio" name="gender" value="other" label="기타" />
            </div>
          </div>
        </div>

        <!-- Slider -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Sliders</Text>

          <div class="slider-samples">
            <div class="slider-item">
              <Label>기본 슬라이더 ({{ sliderValue }})</Label>
              <Slider v-model="sliderValue" :min="0" :max="100" show-value />
            </div>
          </div>
        </div>
      </section>

      <!-- Feedback -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">💬 Feedback Components</Text>

        <!-- Alerts -->
        <div class="alert-samples">
          <Alert title="성공" message="성공적으로 완료!" variant="success" show-icon />
          <Alert title="경고" message="주의가 필요합니다" variant="warning" show-icon />
          <Alert title="오류" message="문제가 발생했습니다" variant="error" show-icon />
          <Alert message="정보입니다" variant="info" show-icon size="small" />
        </div>

        <!-- Trigger buttons -->
        <div class="feedback-triggers">
          <Button @click="openModal" variant="primary">모달 열기</Button>
          <Button @click="showSuccessToast" variant="success">토스트 보기</Button>
        </div>
      </section>

      <div class="page-footer">
        <Text color="muted" size="small">🎉 모든 컴포넌트가 일관된 디자인 시스템을 사용합니다</Text>
      </div>
    </div>

    <!-- Modal -->
    <Modal
        v-model="showModal"
        title="확인"
        size="medium"
        show-footer
        @confirm="handleModalConfirm"
        @cancel="showModal = false"
    >
      <Text>정말로 이 작업을 수행하시겠습니까?</Text>
      <Text size="small" color="secondary">이 작업은 되돌릴 수 없습니다.</Text>
    </Modal>

    <!-- Toast -->
    <Toast
        v-if="showToast"
        message="성공적으로 처리되었습니다!"
        variant="success"
        position="top-right"
        :duration="3000"
        @close="showToast = false"
    />
  </div>
</template>

<style scoped>
/* → 기존 스타일 그대로 유지 */
</style>
