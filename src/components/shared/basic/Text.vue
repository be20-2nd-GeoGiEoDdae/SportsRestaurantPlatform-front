<script setup>
defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value) => ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl', '2xl'].includes(value)
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'muted', 'success', 'warning', 'error'].includes(value)
  },
  weight: {
    type: String,
    default: 'normal',
    validator: (value) => ['light', 'normal', 'medium', 'semibold', 'bold'].includes(value)
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },
  truncate: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <component
    :is="tag"
    class="text"
    :class="[
      `text-${size}`,
      `text-${color}`,
      `text-${weight}`,
      `text-${align}`,
      { 'text-truncate': truncate }
    ]"
  >
    <slot></slot>
  </component>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/basic/texts.css";
</style>
