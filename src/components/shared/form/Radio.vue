<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
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
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  }
})

defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
  const value = event.target.value
  $emit('update:modelValue', value)
  $emit('change', { value })
}
</script>

<template>
  <label 
    class="radio"
    :class="[
      `radio-${size}`,
      `radio-${variant}`,
      { 'radio-disabled': disabled }
    ]"
  >
    <input
      type="radio"
      class="radio-input"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="radio-mark"></span>
    <span v-if="label || $slots.default" class="radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/form/radios.css";
</style>
