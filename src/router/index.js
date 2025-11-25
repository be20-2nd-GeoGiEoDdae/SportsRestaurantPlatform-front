import {createRouter, createWebHistory} from 'vue-router'
import RestaurantRegisterView from '@/views/restaurant/RestaurantRegisterView.vue'
import ComponentDemoView from "@/views/ComponentDemoView.vue";
import RestaurantListView from "@/views/restaurant/RestaurantListView.vue";
import RestaurantListDetailedView from "@/views/restaurant/RestaurantListDetailedView.vue";
import ViewingRegisterView from "@/views/viewing/ViewingRegisterView.vue";
import ViewingListView from "@/views/viewing/ViewingListView.vue";
import ViewingListDetailedView from "@/views/viewing/ViewingListDetailedView.vue";
import MyPageViewingLog from "@/views/mypage/MyPageViewingLog.vue";
import AppClone from "@/AppClone.vue";
import MyPageSubscribeCancel from "@/views/mypage/MyPageSubscribeCancel.vue";
import MyPageSubscribeCancelConfirm
  from "@/views/mypage/MyPageSubscribeCancelConfirm.vue";
import MyPageSubscribeLog from "@/views/mypage/MyPageSubscribeLog.vue";
import MyPageReviewLog from "@/views/mypage/MyPageReviewLog.vue";
import MyPageViewingPayLog from "@/views/mypage/MyPageViewingPayLog.vue";
import MyPageEntrepreneurRegister
  from "@/views/mypage/MyPageEntrepreneurRegister.vue";
import MyPageBookMark from "@/views/mypage/MyPageBookMark.vue";
import MyPageReviewEdit from "@/views/mypage/MyPageReviewEdit.vue";
import MyPageSubscribeRegister
  from "@/views/mypage/MyPageSubscribeRegister.vue";
const routes = [
    {path: '/restaurant/register', name: 'RestaurantRegister', component: RestaurantRegisterView},
    {path: '/', name: 'ComponentDemo', component: ComponentDemoView },
    {path: '/restaurant', name: 'RestaurantList',component: RestaurantListView},
    {path: '/restaurant/detailed/:id', name: 'RestaurantListDetailed',component: RestaurantListDetailedView},
    {path: '/viewing/register', name: 'ViewingRegister',component: ViewingRegisterView},
    {path: '/viewing', name: 'ViewingList',component: ViewingListView},
    {path: '/viewing/detailed/:id', name: 'ViewingListDetailed',component: ViewingListDetailedView},
    {path:'/MyPage/ProfileEdit',name:'MyPage-ProfileEdit',component:MyPageViewingLog},
    {path:'/MyPage/ViewingLog',name:'MyPage-ViewingLog',component:MyPageViewingLog},
    {path:'/AppClone',name:'App-Clone',component:AppClone},
    {path:'/MyPage/Subscribe/Cancel',name:'MyPage-SubscribeCancel',component:MyPageSubscribeCancel},
    {path:'/MyPage/Subscribe/CancelConfirm',name:'MyPage-SubscribeCancelConfirm',component:MyPageSubscribeCancelConfirm},
    {path:'/MyPage/Subscribe/Log',name:'MyPage-SubscribeLog',component:MyPageSubscribeLog},
    {path:'/MyPage/Review/Log',name:'MyPage-ReviewLog',component:MyPageReviewLog},
    {path:'/MyPage/ViewingPay/Log',name:'MyPage-ViewingPayLog',component:MyPageViewingPayLog},
    {path:'/MyPage/Entrepreneur/Register',name:'MyPage-EntrepreneurRegister',component:MyPageEntrepreneurRegister},
    {path:'/MyPage/BookMark',name:'MyPage-BookMark',component:MyPageBookMark},
    {path:'/MyPage/Review/Edit',name:'MyPage-ReviewEdit',component:MyPageReviewEdit},
    {path:'/MyPage/Subscribe/Register',name:'MyPage-SubscribeRegister',component:MyPageSubscribeRegister},
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
