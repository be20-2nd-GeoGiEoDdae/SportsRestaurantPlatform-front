<template>
  <header class="navbar">
    <!-- 왼쪽 로고 -->
    <div class="navbar-left">
      <img :src="logo" alt="logo" class="logo" />
      <h1 class="brand"></h1>
    </div>

    <!-- 오른쪽: 메뉴 / 알림 / 유저 -->
    <nav class="navbar-right">

      <!-- 가게 / 관람 메뉴 -->
      <div class="menu-group">
        <router-link to="/restaurant" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            가게
          </a>
        </router-link>

        <router-link to="/viewing" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate" class="menu-btn" :class="{ active: isActive }">
            관람
          </a>
        </router-link>
      </div>

      <!-- 알림 -->
      <button class="bell">🔔</button>

      <!-- 유저 정보 -->
      <div class="user-section">
        <span>{{ userName }}님</span>
        <span class="divider">/</span>
        <button class="logout-btn">로그아웃</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue"
import logo from "@/assets/logo/logo.png"

const userName = ref("----")
</script>

<style scoped>
@import "@/assets/shared/navbar/navbar.css";
</style>
