<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// ====== Router ======
const router = useRouter()
const route = useRoute()

// ====== 상태 ======
const activeMenu = ref('회원 관리')
const activeSubMenu = ref('일반')
const showSubmenu = ref(false)

// ====== 메뉴 데이터 ======
const menuItems = [
  {
    id: 'member',
    name: '회원 관리',
    subItems: [
      { id: 'general', name: '일반' },
      { id: 'business', name: '사업자' }
    ]
  },
  { id: 'ViewingManage', name: '관람 관리' },
  { id: 'RestaurantManage', name: '가게 관리' },
  {
    id: 'category',
    name: '키워드 관리',
    subItems: [
      { id: 'restaurant', name: '가게' },
      { id: 'sports', name: '스포츠' },
      { id: 'report', name: '신고' },
      { id: 'notice', name: '알림' }
    ]
  },
  { id: 'announcement', name: '공지사항' }
]

// ====== 메뉴 → 라우트 path 매핑 (여기 네 라우터에 맞게 수정 필수) ======
const menuRoutes = {
  ViewingManage: '/admin/ViewingManage',              // 관람 관리
  RestaurantManage: '/admin/RestaurantManage',                // 가게 관리
  announcement: '/admin/announcement/Announcement',              // 공지사항

  member: {
    general: '/admin/user-view',   // 회원 관리 - 일반
    business: '/admin/entrepreneur-view', // 회원 관리 - 사업자
  },
  category: {
    restaurant: '/admin/keywordRestaurant',        // 키워드 관리 - 가게
    sports: '/admin/keywordSports',     // 키워드 관리 - 스포츠
    report: '/admin/keywordReport',       // 키워드 관리 - 신고
    notice: '/admin/keywordNotice',      // 🔵 네가 보여준 알림 페이지
  }
}

// ====== 현재 path 보고 active 메뉴 세팅 ======
const setActiveByPath = (path) => {
  // 1) 단일 메뉴들 (관람 관리, 가게 관리, 공지사항)
  if (path.startsWith(menuRoutes.ViewingManage)) {
    activeMenu.value = '관람 관리'
    activeSubMenu.value = ''
    return
  }
  if (path.startsWith(menuRoutes.RestaurantManage)) {
    activeMenu.value = '가게 관리'
    activeSubMenu.value = ''
    return
  }
  if (path.startsWith(menuRoutes.announcement)) {
    activeMenu.value = '공지사항'
    activeSubMenu.value = ''
    return
  }

  // 2) 회원 관리 하위 메뉴
  for (const [subId, subPath] of Object.entries(menuRoutes.member)) {
    if (path.startsWith(subPath)) {
      activeMenu.value = '회원 관리'
      const memberMenu = menuItems.find(m => m.id === 'member')
      const targetSub = memberMenu.subItems.find(s => s.id === subId)
      activeSubMenu.value = targetSub?.name ?? ''
      return
    }
  }

  // 3) 키워드 관리 하위 메뉴
  for (const [subId, subPath] of Object.entries(menuRoutes.category)) {
    if (path.startsWith(subPath)) {
      activeMenu.value = '키워드 관리'
      const categoryMenu = menuItems.find(m => m.id === 'category')
      const targetSub = categoryMenu.subItems.find(s => s.id === subId)
      activeSubMenu.value = targetSub?.name ?? ''
      showSubmenu.value = true
      return
    }
  }
}

// 최초 진입 + 라우트 변경 때마다 active 상태 동기화
onMounted(() => {
  setActiveByPath(route.path)
})

watch(
    () => route.path,
    (newPath) => {
      setActiveByPath(newPath)
    }
)

// ====== 클릭 핸들러 ======
const handleMenuClick = (menu) => {
  activeMenu.value = menu.name

  if (menu.id === 'category') {
    showSubmenu.value = !showSubmenu.value
  }

  // 회원 / 키워드는 서브메뉴에서 라우팅
  if (menu.id === 'member' || menu.id === 'category') return

  const path = menuRoutes[menu.id]
  if (path) router.push(path)
}

const handleSubMenuClick = (parentMenu, subMenu) => {
  activeMenu.value = parentMenu
  activeSubMenu.value = subMenu.name

  if (parentMenu === '회원 관리') {
    const path = menuRoutes.member?.[subMenu.id]
    if (path) router.push(path)
    return
  }

  if (parentMenu === '키워드 관리') {
    const path = menuRoutes.category?.[subMenu.id]
    if (path) router.push(path)
  }
}
</script>

<template>
  <div id="sidebar-container">
    <nav class="sidebar-nav">
      <div
          v-for="menu in menuItems"
          :key="menu.id"
          class="menu-group"
      >
        <!-- 메인 메뉴 -->
        <button
            class="menu-item"
            :class="{ active: activeMenu === menu.name }"
            @click="handleMenuClick(menu)"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-text">{{ menu.name }}</span>
          <span
              v-if="menu.subItems"
              class="arrow"
              :class="{ expanded: showSubmenu && menu.id === 'category' }"
          >
            ▶
          </span>
        </button>

        <!-- 키워드 관리 하위 메뉴 (토글) -->
        <div
            v-if="menu.subItems && menu.id === 'category'"
            class="submenu"
            :class="{ show: showSubmenu && menu.id === 'category' }"
        >
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
        <div
            v-if="menu.id === 'member'"
            class="submenu show"
        >
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