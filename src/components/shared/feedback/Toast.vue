<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'error', 'info'].includes(value)
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  closable: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
let timer = null

const icons = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
  default: '💬'
}

const closeToast = () => {
  visible.value = false
  emit('close')
}

const startTimer = () => {
  if (!props.persistent && props.duration > 0) {
    timer = setTimeout(() => {
      closeToast()
    }, props.duration)
  }
}

const stopTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

watch(() => props.duration, () => {
  stopTimer()
  startTimer()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="visible"
        class="toast"
        :class="[
          `toast-${variant}`,
          `toast-${position}`
        ]"
        @mouseenter="stopTimer"
        @mouseleave="startTimer"
      >
        <div class="toast-content">
          <span v-if="showIcon" class="toast-icon">
            {{ icons[variant] }}
          </span>
          
          <span class="toast-message">{{ message }}</span>
          
          <button
            v-if="closable"
            type="button"
            class="toast-close"
            @click="closeToast"
          >
            ✕
          </button>
        </div>

        <!-- Progress bar -->
        <div
          v-if="!persistent && duration > 0"
          class="toast-progress"
          :style="{ animationDuration: `${duration}ms` }"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/feedback/toasts.css";
</style>
