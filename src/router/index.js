import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/authStore";

/* ====== Import Views ====== */
import RestaurantRegisterView from '@/views/restaurant/entrepreneur/RestaurantRegisterView.vue'
import RestaurantListView from "@/views/restaurant/entrepreneur/RestaurantListView.vue";
import RestaurantListDetailedView from "@/views/restaurant/entrepreneur/RestaurantListDetailedView.vue";
import ViewingRegisterView from "@/views/viewing/entrepreneur/ViewingRegisterView.vue";
import ViewingListView from "@/views/viewing/entrepreneur/ViewingListView.vue";
import ViewingListDetailedView from "@/views/viewing/entrepreneur/ViewingListDetailedView.vue";

import Home from '@/views/Home.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import SignupAdditional from '@/views/auth/SignupAdditional.vue'
import SignupComplete from '@/views/auth/SignupComplete.vue'
import LoginSuccess from '@/views/auth/LoginSuccess.vue'
import AdminUserView from '@/views/admin/AdminUserView.vue'
import AdminEntrepreneurView from '@/views/admin/AdminEntrepreneurView.vue'
import MyPageViewingLog from "@/views/mypage/MyPageViewingLog.vue";
import MyPageSubscribeCancel from "@/views/mypage/MyPageSubscribeCancel.vue";
import MyPageSubscribeCancelConfirm from "@/views/mypage/MyPageSubscribeCancelConfirm.vue";
import MyPageSubscribeLog from "@/views/mypage/MyPageSubscribeLog.vue";
import MyPageReviewLog from "@/views/mypage/MyPageReviewLog.vue";
import MyPageViewingPayLog from "@/views/mypage/MyPageViewingPayLog.vue";
import MyPageEntrepreneurRegister from "@/views/mypage/MyPageEntrepreneurRegister.vue";
import MyPageBookMark from "@/views/mypage/MyPageBookMark.vue";
import MyPageReviewEdit from "@/views/mypage/MyPageReviewEdit.vue";
import MyPageSubscribeRegister from "@/views/mypage/MyPageSubscribeRegister.vue";

import ComponentSample from "@/views/ComponentSample.vue";
import ViewingManage from "@/views/admin/ViewingManage.vue";
import RestaurantManage from "@/views/admin/RestaurantManage.vue";
import KeywordReport from "@/views/admin/KeywordReport.vue";
import KeywordNotice from "@/views/admin/KeywordNotice.vue";
import Announcement from "@/views/admin/announcement/Annoncement.vue";
import KeywordRestaurant from "@/views/admin/KeywordRestaurant.vue";
import KeywordSports from "@/views/admin/KeywordSports.vue";

import ReservationView from "@/views/reservation/ReservationView.vue";
import AnnouncementsListView from "@/views/announcement/AnnouncementsListView.vue";
import AnnouncementsDetailView from "@/views/announcement/AnnouncementsDetailView.vue";

import RestaurantListDetailedUserView from "@/views/restaurant/user/RestaurantListDetailedUserView.vue";
import ViewingListUserView from "@/views/viewing/user/ViewingListUserView.vue";
import ViewingListDetailedUserView from "@/views/viewing/user/ViewingListDetailedUserView.vue";

import MyPageProfileEdit from "@/views/mypage/MyPageProfileEdit.vue";
import MyPageSubscribeSuccess from "@/views/mypage/MyPageSubscribeSuccess.vue";
import ViewingPaySuccess from "@/views/viewing/ViewingPaySuccess.vue";
import WelcomeView from "@/views/WelcomeView.vue";

/* ==========================
        Route 설정
=========================== */
const routes = [
    { path: '/', name: 'Home', component: Home },

    /* ====== 관리자 ====== */
    { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
    { path: '/admin/user-view', name: 'AdminUserView', component: AdminUserView },
    { path: '/admin/entrepreneur-view', name: 'AdminEntrepreneurView', component: AdminEntrepreneurView },
    { path: '/admin/ViewingManage', name: 'ViewingManage', component: ViewingManage },
    { path: '/admin/RestaurantManage', name: 'RestaurantManage', component: RestaurantManage },
    { path: '/admin/KeywordReport', name: 'KeywordReport', component: KeywordReport },
    { path: '/admin/KeywordNotice', name: 'KeywordNotice', component: KeywordNotice },
    { path: '/admin/KeywordRestaurant', name: 'KeywordRestaurant', component: KeywordRestaurant },
    { path: '/admin/KeywordSports', name: 'KeywordSports', component: KeywordSports },
    { path: '/admin/announcement/Announcement', name: 'Announcement', component: Announcement },

    /* ====== 사업자 ====== */
    { path: '/entrepreneur/restaurant/register', name: 'RestaurantRegister', component: RestaurantRegisterView },
    { path: '/entrepreneur/restaurant', name: 'RestaurantListEntrepreneur', component: RestaurantListView },
    { path: '/entrepreneur/restaurant/detailed/:id', name: 'RestaurantListDetailedEntrepreneur', component: RestaurantListDetailedView },
    { path: '/entrepreneur/viewing/register', name: 'ViewingRegister', component: ViewingRegisterView },
    { path: '/entrepreneur/viewing', name: 'ViewingListEntrepreneur', component: ViewingListView },
    { path: '/entrepreneur/viewing/detailed/:id', name: 'ViewingListDetailedEntrepreneur', component: ViewingListDetailedView },

    /* ====== 일반 사용자 ====== */

    { path: '/user/restaurant/detailed/:id', name: "RestaurantListDetailedUser", component: RestaurantListDetailedUserView },
    { path: '/user/viewing', name: "ViewingListUser", component: ViewingListUserView },
    { path: '/user/viewing/detailed/:id', name: "ViewingListDetailedUser", component: ViewingListDetailedUserView },

    { path: '/welcome', name: "WelcomeView", component: WelcomeView },

    /* ====== 마이페이지 ====== */
    { path: '/MyPage/ProfileEdit', name: 'MyPage-ProfileEdit', component: MyPageProfileEdit },
    { path: '/MyPage/ViewingLog', name: 'MyPage-ViewingLog', component: MyPageViewingLog },
    { path: '/MyPage/Subscribe/Cancel', name: 'MyPage-SubscribeCancel', component: MyPageSubscribeCancel },
    { path: '/MyPage/Subscribe/CancelConfirm', name: 'MyPage-SubscribeCancelConfirm', component: MyPageSubscribeCancelConfirm },
    { path: '/MyPage/Subscribe/Log', name: 'MyPage-SubscribeLog', component: MyPageSubscribeLog },
    { path: '/MyPage/Review/Log', name: 'MyPage-ReviewLog', component: MyPageReviewLog },
    { path: '/MyPage/ViewingPay/Log', name: 'MyPage-ViewingPayLog', component: MyPageViewingPayLog },
    { path: '/MyPage/Entrepreneur/Register', name: 'MyPage-EntrepreneurRegister', component: MyPageEntrepreneurRegister },
    { path: '/MyPage/BookMark', name: 'MyPage-BookMark', component: MyPageBookMark },
    { path: '/MyPage/Review/Edit', name: 'MyPage-ReviewEdit', component: MyPageReviewEdit },
    { path: '/MyPage/Subscribe/Register', name: 'MyPage-SubscribeRegister', component: MyPageSubscribeRegister },
    { path: '/MyPage/Subscribe/Success', name: 'MyPage-SubscribeSuccess', component: MyPageSubscribeSuccess },

    /* ====== 기타 ====== */
    { path: '/viewing/reservation', name: 'ReservationView', component: ReservationView },
    { path: '/announcement', name: 'AnnouncementListView', component: AnnouncementsListView },
    { path: '/announcement/:id', name: 'AnnouncementDetailView', component: AnnouncementsDetailView },
    { path: '/viewing/pay/success', name: 'Viewing-PaySuccess', component: ViewingPaySuccess },
    { path: '/ComponentSample', name: 'ComponentSample', component: ComponentSample },
];

/* ==========================
        Router 생성
=========================== */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

/* ==========================
        권한 체크 가드
=========================== */


/* ==========================
        Export
=========================== */
export default router;
