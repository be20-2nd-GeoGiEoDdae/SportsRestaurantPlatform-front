import {createRouter, createWebHistory} from 'vue-router'
import RestaurantRegisterView from '@/views/restaurant/RestaurantRegisterView.vue'
import ComponentDemoView from "@/views/ComponentDemoView.vue";
import RestaurantListView from "@/views/restaurant/RestaurantListView.vue";
import RestaurantListDetailedView from "@/views/restaurant/RestaurantListDetailedView.vue";
import ViewingRegisterView from "@/views/viewing/ViewingRegisterView.vue";
import ViewingListView from "@/views/viewing/ViewingListView.vue";
import ViewingListDetailedView from "@/views/viewing/ViewingListDetailedView.vue";
const routes = [

    {path: '/restaurant/register', name: 'RestaurantRegister', component: RestaurantRegisterView},
    {path: '/', name: 'ComponentDemo', component: ComponentDemoView },
    {path: '/restaurant', name: 'RestaurantList',component: RestaurantListView},
    {path: '/restaurant/detailed/:id', name: 'RestaurantListDetailed',component: RestaurantListDetailedView},
    {path: '/viewing/register', name: 'ViewingRegister',component: ViewingRegisterView},
    {path: '/viewing', name: 'ViewingList',component: ViewingListView},
    {path: '/viewing/detailed/:id', name: 'ViewingListDetailed',component: ViewingListDetailedView},



]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router
