<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="lightbox">

      <button class="close-btn" @click="close">✕</button>

      <div class="main-img-wrapper">
        <button class="arrow-btn left" @click="prev">‹</button>

        <img :src="images[index]" class="main-img" />

        <button class="arrow-btn right" @click="next">›</button>
      </div>

      <div class="thumb-list">
        <img
            v-for="(img, i) in images"
            :key="i"
            :src="img"
            class="thumb"
            :class="{ active: i === index }"
            @click="set(i)"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  images: { type: Array, required: true },
  visible: { type: Boolean, required: true },
  index: { type: Number, required: true }
});

const emit = defineEmits(["close", "update:index"]);

const close = () => emit("close");

const set = (i) => emit("update:index", i);

const prev = () => {
  const nextIndex = props.index === 0
      ? props.images.length - 1
      : props.index - 1;
  emit("update:index", nextIndex);
};

const next = () => {
  const nextIndex = props.index === props.images.length - 1
      ? 0
      : props.index + 1;
  emit("update:index", nextIndex);
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.lightbox {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px; left: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}

.main-img-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-img {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}

.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 40px;
  cursor: pointer;
  padding: 10px;
  color: #333;
}

.left { left: -10px; }
.right { right: -10px; }

.thumb-list {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
}

.thumb {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  border: 2px solid transparent;
}

.thumb.active {
  opacity: 1;
  border-color: #5fa8ff;
}
</style>
