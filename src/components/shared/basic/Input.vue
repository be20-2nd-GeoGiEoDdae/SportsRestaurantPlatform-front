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
    // ⭐ 수정됨: textarea 타입 추가
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
    // ⭐ textarea 전용 rows 추가
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

const inputEl = ref(null)
defineExpose({ input: inputEl })
</script>

<template>

  <!-- ⭐ 추가됨: textarea 전용 -->
  <textarea
      v-if="type === 'textarea'"
      ref="inputEl"
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

  <!-- 기존 input -->
  <input
      v-else
      ref="inputEl"
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

/* ⭐ textarea 스타일 추가 */
.textarea-input {
  resize: vertical;   /* 크기 조절 허용 */
  min-height: 100px;
}
</style>
