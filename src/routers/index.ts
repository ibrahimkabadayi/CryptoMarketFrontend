import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MarketView from "@/views/MarketView.vue";
import PortfolioView from "@/views/PortfolioView.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: 'market',
                name: 'market',
                component: MarketView
            },
            {
                path: 'portfolio',
                name: 'portfolio',
                component: PortfolioView
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router