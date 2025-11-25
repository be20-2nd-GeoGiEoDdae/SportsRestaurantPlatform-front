<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '선택하세요'
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
    default: 'default',
    validator: (value) => ['default', 'primary', 'error'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')

/* 🔍 검색 지원 */
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  return props.options.filter(opt =>
      opt.label?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

/* ⭐ multiple 및 single 모두 지원하는 selectedLabel */
const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return props.placeholder
    const labels = props.modelValue.map(v => {
      const found = props.options.find(opt => opt.value === v)
      return found?.label || v
    })
    return labels.join(', ')
  }

  if (!props.modelValue) return props.placeholder

  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label || props.modelValue
})

/* ⭐ option 클릭 시 처리 */
const selectOption = (option) => {
  /* multiple 처리 */
  if (props.multiple) {
    let next = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : []

    if (next.includes(option.value)) {
      next = next.filter(v => v !== option.value)
    } else {
      next.push(option.value)
    }

    emit('update:modelValue', next)
    emit('change', next)
    return
  }

  /* single 처리 */
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
  searchQuery.value = ''
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div
      class="dropdown"
      :class="[
      `dropdown-${size}`,
      `dropdown-${variant}`,
      { 'dropdown-full-width': fullWidth, 'dropdown-open': isOpen, 'dropdown-disabled': disabled }
    ]"
  >
    <button
        type="button"
        class="dropdown-trigger"
        @click="toggleDropdown"
        :disabled="disabled"
    >
      <span class="dropdown-text">{{ selectedLabel }}</span>
      <span class="dropdown-arrow" :class="{ 'dropdown-arrow-up': isOpen }">▼</span>
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <input
          v-if="searchable"
          v-model="searchQuery"
          type="text"
          class="dropdown-search"
          placeholder="검색..."
          @click.stop
      />

      <div class="dropdown-options">
        <button
            v-for="opt in filteredOptions"
            :key="opt.value"
            type="button"
            class="dropdown-option"
            :class="{ 'dropdown-option-selected': opt.value === modelValue || (Array.isArray(modelValue) && modelValue.includes(opt.value)) }"
            @click="selectOption(opt)"
        >
          {{ opt.label }}
        </button>

        <div v-if="filteredOptions.length === 0" class="dropdown-no-options">
          검색 결과가 없습니다
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/shared/colors.css";
@import "@/assets/shared/form/dropdowns.css";
</style>
