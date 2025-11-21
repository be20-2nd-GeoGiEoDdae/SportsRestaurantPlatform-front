<script setup>
defineProps({
  for: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'muted', 'error'].includes(value)
  },
  weight: {
    type: String,
    default: 'medium',
    validator: (value) => ['normal', 'medium', 'semibold', 'bold'].includes(value)
  }
})
</script>

<template>
  <label
    :for="for"
    class="label"
    :class="[
      `label-${size}`,
      `label-${color}`,
      `label-${weight}`
    ]"
  >
    <slot></slot>
    <span v-if="required" class="label-required">*</span>
  </label>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/basic/labels.css";
</style>
