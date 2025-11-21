<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button 
    class="btn"
    :class="[
      `btn-${variant}`, 
      `btn-${size}`,
      { 'btn-full-width': fullWidth }
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/basic/buttons.css";
</style>