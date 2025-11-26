<template>
  <div class="dashboard-header">
    <h2>{{ headerText }}</h2>
  </div>
</template>

<script setup>
defineProps({
  headerText: String
})
</script>

<style scoped>
.dashboard-header {
  font-size: 10px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 50px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}
</style>