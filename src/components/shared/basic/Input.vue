<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) =>
        ['text', 'password', 'email', 'number', 'tel', 'url', 'textarea'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'error'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

/* ===========================
   핵심: 실제 DOM 요소를 Ref로 확보
=========================== */
const native = ref(null)

/* ===========================
   외부에서 native DOM 접근 가능하게 expose
=========================== */
defineExpose({ native })
</script>

<template>

  <!-- textarea -->
  <textarea
      v-if="type === 'textarea'"
      ref="native"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      class="input textarea-input"
      :class="[
      `input-${size}`,
      `input-${variant}`,
      { 'input-full-width': fullWidth }
    ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
  ></textarea>

  <!-- 기본 input -->
  <input
      v-else
      ref="native"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="input"
      :class="[
      `input-${size}`,
      `input-${variant}`,
      { 'input-full-width': fullWidth }
    ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
  />
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/basic/inputs.css";

.textarea-input {
  resize: vertical;
  min-height: 100px;
}
</style>
