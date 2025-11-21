<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
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
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  return props.options.filter(option => 
    option.label?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedLabel = computed(() => {
  if (!props.modelValue) return props.placeholder
  const selected = props.options.find(option => option.value === props.modelValue)
  return selected?.label || props.modelValue
})

const selectOption = (option) => {
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
      { 
        'dropdown-full-width': fullWidth,
        'dropdown-open': isOpen,
        'dropdown-disabled': disabled
      }
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
          v-for="option in filteredOptions"
          :key="option.value"
          type="button"
          class="dropdown-option"
          :class="{ 'dropdown-option-selected': option.value === modelValue }"
          @click="selectOption(option)"
        >
          {{ option.label }}
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
