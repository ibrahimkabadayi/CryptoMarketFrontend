import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MarketView from "@/views/MarketView.vue";
import DashboardView from "@/views/PortfolioView.vue";
import PortfolioView from "@/views/PortfolioView.vue";

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/market',
        name: 'market',
        component: MarketView
    },
    {
        path: '/portfolio',
        name: 'portfolio',
        component: PortfolioView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router