<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'error'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  },
  centered: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm', 'cancel'])

const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    closeModal()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  closeModal()
}

// ESC 키로 닫기
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closable) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleMaskClick"
      >
        <div
          class="modal"
          :class="[
            `modal-${size}`,
            `modal-${variant}`,
            { 'modal-centered': centered }
          ]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="showHeader" class="modal-header">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <slot name="header" v-else></slot>

            <button
              v-if="closable"
              type="button"
              class="modal-close"
              @click="closeModal"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="showFooter || $slots.footer" class="modal-footer">
            <slot name="footer">
              <button
                type="button"
                class="modal-btn modal-btn-cancel"
                @click="handleCancel"
              >
                취소
              </button>
              <button
                type="button"
                class="modal-btn modal-btn-confirm"
                @click="handleConfirm"
              >
                확인
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/feedback/modals.css";
</style>
