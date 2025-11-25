<script setup>
import {ref, watch} from 'vue'
import {START_LOCATION_NORMALIZED as route} from "vue-router/dist/devtools-BLCumUwL.mjs";
import {useRouter} from "vue-router";

// 현재 선택된 메뉴
const activeMenu = ref('프로필 조회')
const activeSubMenu = ref('내 가게 조회')

// 하위메뉴 표시 상태
const showProfileSubmenu = ref(true)
const showSubscribeSubmenu = ref(false)

const router = useRouter()

// 메뉴 데이터
const menuItems = [
  {
    id: 'main',
    name: '메인 페이지',
  },
  {
    id: 'Profile',
    name: '프로필 조회',
    subItems: [
      { id: 'MyStore', name: '내 가게 조회' },
      { id: 'ProfileEdit', name: '프로필 조회' }
    ]
  },
  {
    id: 'BookMark',
    name: '즐겨찾기 목록',
  },
  {
    id: 'ViewingLog',
    name: '관람 내역'
  },
  {
    id: 'ReviewLog',
    name: '리뷰 조회',
  },
  {
    id: 'ViewingPayLog',
    name: '결제 내역 조회'
  },
  {
    id: 'Subscribe',
    name: '구독 결제',
    subItems: [
      { id: 'SubscribeRegister', name: '구독 결제 신청' },
      { id: 'SubscribeLog', name: '구독 내역 조회' }
    ],
  },
  {
    id: 'notice',
    name: '공지사항',
  }
]

const syncMenu=()=>{
  activeMenu.value=route.name.replace('MyPage-', '')
}
// 메뉴 클릭 핸들러
const handleMenuClick = (menu) => {
  activeMenu.value = menu.name
  
  if (menu.id === 'profile') {
    showProfileSubmenu.value = !showProfileSubmenu.value
  } else if (menu.id === 'subscribe') {
    showSubscribeSubmenu.value = !showSubscribeSubmenu.value
  }
  router.push({ name: 'MyPage-'+menu.id })
  
  console.log(`메뉴 클릭: ${menu.name}`)
}

// 하위 메뉴 클릭 핸들러
const handleSubMenuClick = (parentMenu, subMenu) => {
  activeMenu.value = parentMenu
  activeSubMenu.value = subMenu.name
  console.log(`하위메뉴 클릭: ${parentMenu} > ${subMenu.name}`)
}
watch()(
    ()=>route.name,
    ()=>syncMenu(),
    { immediate: true }
)
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
                  expanded: (showProfileSubmenu && menu.id === 'profile') || 
                           (showSubscribeSubmenu && menu.id === 'subscribe')
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

        <!-- 구독 결제 조회 하위메뉴 -->
        <div v-if="menu.id === 'subscribe'" class="submenu" :class="{ show: showSubscribeSubmenu }">
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