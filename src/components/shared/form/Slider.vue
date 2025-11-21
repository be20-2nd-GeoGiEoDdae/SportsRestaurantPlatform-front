<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
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
  showValue: {
    type: Boolean,
    default: false
  },
  showMinMax: {
    type: Boolean,
    default: false
  },
  marks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue', 'change', 'input'])

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const handleInput = (event) => {
  const value = Number(event.target.value)
  $emit('update:modelValue', value)
  $emit('input', value)
}

const handleChange = (event) => {
  const value = Number(event.target.value)
  $emit('change', value)
}
</script>

<template>
  <div 
    class="slider"
    :class="[
      `slider-${size}`,
      `slider-${variant}`,
      { 'slider-disabled': disabled }
    ]"
  >
    <!-- Min/Max 표시 -->
    <div v-if="showMinMax" class="slider-minmax">
      <span class="slider-min">{{ min }}</span>
      <span class="slider-max">{{ max }}</span>
    </div>

    <!-- 슬라이더 컨테이너 -->
    <div class="slider-container">
      <!-- 슬라이더 트랙 -->
      <div class="slider-track">
        <div 
          class="slider-fill" 
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>

      <!-- 슬라이더 입력 -->
      <input
        type="range"
        class="slider-input"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :disabled="disabled"
        @input="handleInput"
        @change="handleChange"
      />

      <!-- 마크 표시 -->
      <div v-if="marks.length > 0" class="slider-marks">
        <div
          v-for="mark in marks"
          :key="mark.value"
          class="slider-mark"
          :style="{ 
            left: `${((mark.value - min) / (max - min)) * 100}%` 
          }"
        >
          <div class="slider-mark-dot"></div>
          <div v-if="mark.label" class="slider-mark-label">
            {{ mark.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 현재 값 표시 -->
    <div v-if="showValue" class="slider-value">
      {{ modelValue }}
    </div>
  </div>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/form/sliders.css";
</style>
