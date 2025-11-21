<script setup>
import { ref } from 'vue'
import Layout from './components/shared/layout/Layout.vue';
import Button from './components/shared/basic/Button.vue';
import Input from './components/shared/basic/Input.vue';
import Label from './components/shared/basic/Label.vue';
import Text from './components/shared/basic/Text.vue';
import Checkbox from './components/shared/form/Checkbox.vue';
import Dropdown from './components/shared/form/Dropdown.vue';
import Radio from './components/shared/form/Radio.vue';
import Slider from './components/shared/form/Slider.vue';
import Modal from './components/shared/feedback/Modal.vue';
import Toast from './components/shared/feedback/Toast.vue';
import Alert from './components/shared/feedback/Alert.vue';
import SidebarAdmin from './components/shared/sidebar/admin/SidebarAdmin.vue';
import SidebarEntrepreneur from './components/shared/sidebar/entrepreneur/SidebarEntrepreneur.vue';
import SidebarUser from './components/shared/sidebar/user/SidebarUser.vue';

// 반응형 데이터
const email = ref('')
const selectedDropdown = ref('')
const isChecked = ref(false)
const checkboxArray = ref([])
const selectedRadio = ref('')
const sliderValue = ref(50)
const showModal = ref(false)
const showToast = ref(false)

// 드롭다운 옵션
const dropdownOptions = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' }
]

// 함수들
const showSuccessToast = () => {
  showToast.value = true
}

const openModal = () => {
  showModal.value = true
}

const handleModalConfirm = () => {
  alert('확인 버튼이 클릭되었습니다!')
  showModal.value = false
}
</script>

<template>
  <div class="app-container">
    <!-- Layout 컴포넌트 -->
    <Layout/>
    
    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <!-- 페이지 제목 -->
      <div class="page-header">
        <Text tag="h1" size="2xl" color="primary" weight="bold">컴포넌트 라이브러리 샘플</Text>
        <Text color="secondary">모든 컴포넌트들의 다양한 스타일과 기능을 확인해보세요</Text>
      </div>

      <!-- 사이드바 샘플 -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">📱 Sidebar Components</Text>
        <div class="sidebar-demos">
          <div class="sidebar-demo">
            <Text weight="medium">관리자 사이드바</Text>
            <SidebarAdmin/>
          </div>
          <div class="sidebar-demo">
            <Text weight="medium">사업자 사이드바</Text>
            <SidebarEntrepreneur/>
          </div>
          <div class="sidebar-demo">
            <Text weight="medium">사용자 사이드바</Text>
            <SidebarUser/>
          </div>
        </div>
      </section>

      <!-- Basic 컴포넌트 샘플 -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">🔘 Basic Components</Text>
        
        <!-- 버튼들 -->
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

        <!-- 텍스트들 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Text Styles</Text>
          <div class="text-samples">
            <Text tag="h1" size="2xl" weight="bold">Heading 1 - 2XL Bold</Text>
            <Text tag="h2" size="xl" weight="semibold" color="primary">Heading 2 - XL Semibold Primary</Text>
            <Text tag="h3" size="large" weight="medium">Heading 3 - Large Medium</Text>
            <Text size="medium">일반 텍스트 - Medium</Text>
            <Text size="small" color="secondary">작은 텍스트 - Small Secondary</Text>
            <Text size="xs" color="muted">아주 작은 텍스트 - XS Muted</Text>
            <Text color="success">성공 메시지</Text>
            <Text color="warning">경고 메시지</Text>
            <Text color="error">오류 메시지</Text>
          </div>
        </div>

        <!-- 입력 필드들 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Input Fields</Text>
          <div class="input-samples">
            <div class="input-group">
              <Label for="email" required>이메일 주소</Label>
              <Input 
                id="email"
                v-model="email"
                type="email" 
                placeholder="이메일을 입력하세요"
                variant="primary"
                fullWidth
              />
            </div>
            <div class="input-group">
              <Label size="small">작은 라벨</Label>
              <Input size="small" placeholder="작은 입력 필드" />
            </div>
            <div class="input-group">
              <Label size="large">큰 라벨</Label>
              <Input size="large" placeholder="큰 입력 필드" />
            </div>
          </div>
        </div>
      </section>

      <!-- Form 컴포넌트 샘플 -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">📝 Form Components</Text>
        
        <!-- 드롭다운 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Dropdown</Text>
          <div class="form-samples">
            <div class="form-item">
              <Label>음식 종류 선택</Label>
              <Dropdown 
                v-model="selectedDropdown"
                :options="dropdownOptions" 
                placeholder="음식 종류를 선택하세요"
                searchable
                fullWidth
              />
            </div>
            <div class="form-item">
              <Label>작은 드롭다운</Label>
              <Dropdown 
                :options="dropdownOptions" 
                size="small"
                placeholder="작은 크기"
              />
            </div>
          </div>
        </div>

        <!-- 체크박스 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Checkboxes</Text>
          <div class="checkbox-samples">
            <Checkbox v-model="isChecked" label="기본 체크박스" />
            <Checkbox size="small" label="작은 체크박스" />
            <Checkbox size="large" variant="success" label="큰 성공 체크박스" />
            <Checkbox variant="warning" label="경고 체크박스" />
            <Checkbox variant="error" label="오류 체크박스" />
            <Checkbox disabled label="비활성 체크박스" />
          </div>
        </div>

        <!-- 라디오 버튼 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Radio Buttons</Text>
          <div class="radio-samples">
            <Text weight="medium">성별 선택</Text>
            <div class="radio-group">
              <Radio v-model="selectedRadio" name="gender" value="male" label="남성" />
              <Radio v-model="selectedRadio" name="gender" value="female" label="여성" />
              <Radio v-model="selectedRadio" name="gender" value="other" label="기타" />
            </div>
            
            <Text weight="medium">크기별 라디오</Text>
            <div class="radio-group">
              <Radio name="size" value="small" size="small" label="작은 라디오" />
              <Radio name="size" value="medium" size="medium" label="중간 라디오" />
              <Radio name="size" value="large" size="large" label="큰 라디오" />
            </div>
          </div>
        </div>

        <!-- 슬라이더 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Sliders</Text>
          <div class="slider-samples">
            <div class="slider-item">
              <Label>기본 슬라이더 (현재 값: {{ sliderValue }})</Label>
              <Slider 
                v-model="sliderValue"
                :min="0" 
                :max="100" 
                show-value 
                show-min-max
              />
            </div>
            <div class="slider-item">
              <Label>성공 슬라이더</Label>
              <Slider 
                :model-value="30"
                variant="success"
                :min="0" 
                :max="100"
              />
            </div>
            <div class="slider-item">
              <Label>경고 슬라이더</Label>
              <Slider 
                :model-value="70"
                variant="warning"
                :min="0" 
                :max="100"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Feedback 컴포넌트 샘플 -->
      <section class="demo-section">
        <Text tag="h2" size="xl" weight="semibold" color="primary">💬 Feedback Components</Text>
        
        <!-- Alert -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Alerts</Text>
          <div class="alert-samples">
            <Alert
              title="성공"
              message="작업이 성공적으로 완료되었습니다."
              variant="success"
              show-icon
              closable
            />
            <Alert
              title="경고"
              message="이 작업은 주의가 필요합니다."
              variant="warning"
              show-icon
              closable
            />
            <Alert
              title="오류"
              message="문제가 발생했습니다. 다시 시도해주세요."
              variant="error"
              show-icon
              closable
            />
            <Alert
              message="정보성 메시지입니다."
              variant="info"
              show-icon
              size="small"
            />
          </div>
        </div>

        <!-- 버튼으로 피드백 트리거 -->
        <div class="component-group">
          <Text tag="h3" size="large" weight="medium">Interactive Feedback</Text>
          <div class="feedback-triggers">
            <Button @click="openModal" variant="primary">모달 열기</Button>
            <Button @click="showSuccessToast" variant="success">토스트 보기</Button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <div class="page-footer">
        <Text color="muted" size="small" align="center">
          🎉 모든 컴포넌트가 일관된 디자인 시스템을 사용합니다
        </Text>
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
      <Text color="secondary" size="small">이 작업은 되돌릴 수 없습니다.</Text>
    </Modal>

    <!-- Toast -->
    <Toast
      v-if="showToast"
      message="성공적으로 처리되었습니다! 🎉"
      variant="success"
      position="top-right"
      :duration="3000"
      @close="showToast = false"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #fafbfc;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 0;
  background: linear-gradient(135deg, #6094C5 0%, #5085b5 100%);
  border-radius: 20px;
  color: white;
}

.page-header .text {
  color: white !important;
}

.demo-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.component-group {
  margin-bottom: 32px;
}

.component-group:last-child {
  margin-bottom: 0;
}

/* Sidebar Demos */
.sidebar-demos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.sidebar-demo {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.sidebar-demo .text {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

/* Button Grid */
.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

/* Text Samples */
.text-samples {
  margin-top: 16px;
}

.text-samples .text {
  display: block;
  margin-bottom: 8px;
}

/* Input Samples */
.input-samples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Form Samples */
.form-samples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Checkbox Samples */
.checkbox-samples {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

/* Radio Samples */
.radio-samples {
  margin-top: 16px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 24px 0;
  padding-left: 16px;
}

/* Slider Samples */
.slider-samples {
  margin-top: 16px;
}

.slider-item {
  margin-bottom: 24px;
}

.slider-item:last-child {
  margin-bottom: 0;
}

/* Alert Samples */
.alert-samples {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

/* Feedback Triggers */
.feedback-triggers {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* Page Footer */
.page-footer {
  text-align: center;
  padding: 40px 0;
  margin-top: 60px;
  border-top: 1px solid #e9ecef;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }
  
  .demo-section {
    padding: 24px 20px;
  }
  
  .sidebar-demos {
    grid-template-columns: 1fr;
  }
  
  .button-grid {
    justify-content: center;
  }
  
  .input-samples,
  .form-samples {
    grid-template-columns: 1fr;
  }
  
  .feedback-triggers {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 24px 16px;
    margin-bottom: 32px;
  }
  
  .demo-section {
    margin-bottom: 20px;
  }
  
  .button-grid {
    flex-direction: column;
    align-items: center;
  }
}
</style>
