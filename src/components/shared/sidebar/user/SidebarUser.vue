<script setup>
import { ref } from 'vue'

// 현재 선택된 메뉴
const activeMenu = ref('프로필 조회')
const activeSubMenu = ref('사업자 신청')

// 하위메뉴 표시 상태
const showProfileSubmenu = ref(true)
const showSubscribeSubmenu = ref(false)

// 메뉴 데이터
const menuItems = [
  {
    id: 'main',
    name: '메인 페이지',
  },
  {
    id: 'profile',
    name: '프로필 조회',
    subItems: [
      { id: 'entrepreneurRegister', name: '사업자 신청' },
      { id: 'profileEdit', name: '프로필 조회' }
    ]
  },
  {
    id: 'bookmark',
    name: '즐겨찾기 목록',
  },
  {
    id: 'viewing',
    name: '관람 내역'
  },
  {
    id: 'like',
    name: '리뷰 조회',
  },
  {
    id: 'pay',
    name: '결제 내역 조회'
  },
  {
    id: 'notice',
    name: '공지사항',
  }
]

// 메뉴 클릭 핸들러
const handleMenuClick = (menu) => {
  activeMenu.value = menu.name
  
  if (menu.id === 'profile') {
    showProfileSubmenu.value = !showProfileSubmenu.value
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
          :class="{ 
            active: activeMenu === menu.name,
            'has-submenu': menu.subItems 
          }"
          @click="handleMenuClick(menu)"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-text">{{ menu.name }}</span>
          <span v-if="menu.subItems" class="arrow" 
                :class="{ 
                  expanded: (showProfileSubmenu && menu.id === 'profile')
                }">
            ▼
          </span>
        </button>

        <!-- 프로필 조회 하위메뉴 -->
        <div v-if="menu.id === 'profile'" class="submenu" :class="{ show: showProfileSubmenu }">
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