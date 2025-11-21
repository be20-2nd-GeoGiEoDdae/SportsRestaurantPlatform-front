<script setup>
defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Boolean],
    default: null
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
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
  const isChecked = event.target.checked
  
  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    if (isChecked) {
      newValue.push(props.value)
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
    $emit('update:modelValue', newValue)
  } else {
    $emit('update:modelValue', isChecked)
  }
  
  $emit('change', { checked: isChecked, value: props.value })
}
</script>

<template>
  <label 
    class="checkbox"
    :class="[
      `checkbox-${size}`,
      `checkbox-${variant}`,
      { 'checkbox-disabled': disabled }
    ]"
  >
    <input
      type="checkbox"
      class="checkbox-input"
      :checked="Array.isArray(modelValue) ? modelValue.includes(value) : modelValue"
      :value="value"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="handleChange"
    />
    <span class="checkbox-mark"></span>
    <span v-if="label || $slots.default" class="checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/form/checkboxes.css";
</style>
