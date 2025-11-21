<script setup>
import { ref } from 'vue'

// 현재 선택된 메뉴
const activeMenu = ref('회원 관리')
const activeSubMenu = ref('일반')

// 키워드 관리 하위메뉴 표시 상태
const showSubmenu = ref(false)

// 메뉴 데이터
const menuItems = [
  {
    id: 'member',
    name: '회원 관리',
    subItems: [
      { id: 'general', name: '일반' },
      { id: 'business', name: '사업자' }
    ]
  },
  {
    id: 'review',
    name: '관람 관리',
  },
  {
    id: 'store',
    name: '가게 관리',
  },
  {
    id: 'category',
    name: '키워드 관리',
    subItems: [
      { id: 'food', name: '가게' },
      { id: 'sports', name: '스포츠' },
      { id: 'news', name: '신고' },
      { id: 'event', name: '알림' }
    ]
  },
  {
    id: 'admin',
    name: '공지사항',
  }
]

// 메뉴 클릭 핸들러
const handleMenuClick = (menu) => {
  activeMenu.value = menu.name
  
  if (menu.id === 'category') {
    showSubmenu.value = !showSubmenu.value
  }
  
  console.log(`메뉴 클릭: ${menu.name}`)
}

// 하위 메뉴 클릭 핸들러
const handleSubMenuClick = (parentMenu, subMenu) => {
  activeMenu.value = parentMenu
  activeSubMenu.value = subMenu.name
  console.log(`하위메뉴 클릭: ${parentMenu} > ${subMenu.name}`)
}
</script>

<template>
  <div id="sidebar-container">

    <!-- 메뉴 리스트 -->
    <nav class="sidebar-nav">
      <div v-for="menu in menuItems" :key="menu.id" class="menu-group">
        <!-- 메인 메뉴 -->
        <button 
          class="menu-item"
          :class="{ active: activeMenu === menu.name }"
          @click="handleMenuClick(menu)"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-text">{{ menu.name }}</span>
          <span v-if="menu.subItems" class="arrow" :class="{ expanded: showSubmenu && menu.id === 'category' }">
            ▶
          </span>
        </button>

        <!-- 하위 메뉴 -->
        <div v-if="menu.subItems" class="submenu" :class="{ show: showSubmenu && menu.id === 'category' }">
          <button 
            v-for="subItem in menu.subItems" 
            :key="subItem.id"
            class="submenu-item"
            :class="{ active: activeSubMenu === subItem.name && activeMenu === menu.name }"
            @click="handleSubMenuClick(menu.name, subItem)"
          >
            {{ subItem.name }}
          </button>
        </div>

        <!-- 회원 관리의 고정 하위메뉴 -->
        <div v-if="menu.id === 'member'" class="submenu show">
          <button 
            v-for="subItem in menu.subItems" 
            :key="subItem.id"
            class="submenu-item"
            :class="{ active: activeSubMenu === subItem.name && activeMenu === menu.name }"
            @click="handleSubMenuClick(menu.name, subItem)"
          >
            {{ subItem.name }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<style>
@import "@/assets/sidebar/sidebar.css";
</style>