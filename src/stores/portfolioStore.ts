import {defineStore} from 'pinia';
import {ref} from 'vue';
import {portfolioApi} from "@/api/portfolio";
import {useMarketStore} from "@/stores/marketStore";
import {Dashboard, Transaction} from "@/types/portfolio";
import {signalRService} from '@/api/signalR';

export const usePortfolioStore = defineStore('portfolio', () => {
    const dashboard = ref<Dashboard>();
    const isLoading = ref(false);
    const errorMessage = ref('');
    const marketStore = useMarketStore();

    const fetchDashboard = async () => {
        isLoading.value = true;
        try {
            dashboard.value = await portfolioApi.getDashboard();
        } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
        } finally {
            isLoading.value = false;
        }
    };

    const deposit = async (amount: number) => {
        try {
            const response = await portfolioApi.deposit(dashboard.value.walletId, amount);
            console.log(response);
        } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
        }
    };

    const withdraw = async (amount: number) => {
        try {
            const response = await portfolioApi.withdraw(dashboard.value.walletId, amount);
            console.log(response);
        } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
        }
    };

    const buyCoin = async (symbol: string, quantity: number) => {
        try {
            const coin = marketStore.coins.find(x => x.symbol === symbol);
            await portfolioApi.buyCoin(dashboard.value.walletId, quantity, coin);
        } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
        }
    };

    const sellCoin = async (symbol: string, quantity: number) => {
        try {
            const coin = marketStore.coins.find(x => x.symbol === symbol);
            await portfolioApi.sellCoin(dashboard.value.walletId, quantity, coin);
        } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
        }
    };

    const initPortfolioSignalR = async () => {
        await signalRService.startConnection('hubs/portfolio', true);
        
        signalRService.on('UpdatePortfolio', (data) => {
            dashboard.value = {...dashboard.value, ...data};
        });

        signalRService.on('NewTransaction', (transaction: any) => {
            dashboard.value.recentTransactions.unshift(transaction);
        });

        signalRService.on('UpdateBalance', (balance: number) => {
            dashboard.value.fiatBalance = balance;
        });
    };

    return {
        dashboard,
        isLoading,
        errorMessage,
        buyCoin,
        sellCoin,
        fetchDashboard,
        deposit,
        withdraw,
        initPortfolioSignalR
    };
});