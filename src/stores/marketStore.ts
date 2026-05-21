import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Coin, PriceUpdateMessage} from '@/types/market';
import {marketApi} from '@/api/market';
import {signalRService} from '@/api/signalR';

export const useMarketStore = defineStore('market', () => {
    const coins = ref<Coin[]>([]);
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

    const initSignalR = async () => {
        await signalRService.startConnection('/hubs/market');

        signalRService.on('ReceivePriceUpdate', (updateInfo: PriceUpdateMessage) => {
            const coin = coins.value.find(c => c.symbol === updateInfo.symbol);
            if (coin) {
                coin.currentPrice = updateInfo.price;
                 console.log(`${updateInfo.symbol} updated: ${updateInfo.price}`);
            }
        });
    };

    return {
        coins,
        isLoading,
        fetchInitialCoins,
        initSignalR
    };
});