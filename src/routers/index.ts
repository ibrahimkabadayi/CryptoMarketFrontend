import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MarketView from "@/views/MarketView.vue";
import PortfolioView from "@/views/PortfolioView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import MarketNewsView from "@/views/MarketNewsView.vue";
import NewsDetailView from "@/views/NewsDetailView.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterView.vue')
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/HomeView.vue')
            },
            {
                path: 'market',
                name: 'market',
                component: MarketView
            },
            {
                path: 'market/:symbol',
                name: 'coin-detail',
                component: () => import('@/views/CoinDetailView.vue'),
                props: true
            },
            {
                path: 'portfolio',
                name: 'portfolio',
                component: PortfolioView
            },
            {
                path: 'market-news',
                name: 'news',
                component: MarketNewsView
            },
            {
                path: 'market-news/:title',
                name: 'news-detail',
                component: NewsDetailView,
                props: true
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router