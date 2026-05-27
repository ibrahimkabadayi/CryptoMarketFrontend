import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Coin, PriceUpdateMessage} from '@/types/market';
import {marketApi} from '@/api/market';
import {signalRService} from '@/api/signalR';

export const useMarketStore = defineStore('market', () => {
    const coins = ref<Coin[]>([]);
    const priceHistories = ref<PriceHistory[]>([]);
    const isLoading = ref(false);

    const fetchInitialCoins = async () => {
        isLoading.value = true;
        try {
            coins.value = await marketApi.getAllCoins();
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchPriceHistory = async (symbol: string, timeframe: string = '1d') => {
        isLoading.value = true;
        try {
            priceHistories.value = await marketApi.getPriceHistory(symbol, timeframe);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const buyCoin = async (coin: Coin, amount: number) => {
        try {
            await marketApi.buyCoin(coin, amount);
        } catch (error) {
            console.log(error);
        }
    };

    const setLimitOrder = async (credentials: SetLimitOrderRequest) => {
        try {
            await marketApi.setLimitOrder(credentials);
        } catch (error) {
            console.log(error);
        }
    }

    const initSignalR = async () => {
        await signalRService.startConnection('/hubs/market');

        signalRService.on('ReceivePriceUpdate', (updateInfo: PriceUpdateMessage) => {
            const coin = coins.value.find(c => c.symbol === updateInfo.symbol);
            if (coin) {
                coin.currentPrice = updateInfo.price;
            }
        });

        signalRService.on('ReceiveHistoryUpdate', (updateInfo: HistoryUpdateMessage) => {

        });
    };

    return {
        coins,
        isLoading,
        priceHistories,
        fetchPriceHistory,
        setLimitOrder,
        buyCoin,
        fetchInitialCoins,
        initSignalR
    };
});