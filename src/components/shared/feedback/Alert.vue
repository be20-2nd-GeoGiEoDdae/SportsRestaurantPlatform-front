<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  closable: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  outlined: {
    type: Boolean,
    default: false
  },
  banner: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)

const icons = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ'
}

const closeAlert = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition name="alert">
    <div
      v-if="visible"
      class="alert"
      :class="[
        `alert-${variant}`,
        `alert-${size}`,
        {
          'alert-outlined': outlined,
          'alert-banner': banner,
          'alert-closable': closable
        }
      ]"
      role="alert"
    >
      <div class="alert-content">
        <div v-if="showIcon" class="alert-icon">
          <slot name="icon">
            {{ icons[variant] }}
          </slot>
        </div>

        <div class="alert-body">
          <div v-if="title" class="alert-title">
            <slot name="title">{{ title }}</slot>
          </div>
          
          <div class="alert-message">
            <slot>{{ message }}</slot>
          </div>
        </div>

        <button
          v-if="closable"
          type="button"
          class="alert-close"
          @click="closeAlert"
        >
          ✕
        </button>
      </div>

      <!-- Action buttons -->
      <div v-if="$slots.actions" class="alert-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </Transition>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/feedback/alerts.css";
</style>
