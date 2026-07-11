import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Coin, PriceHistory, HistoryUpdateMessage, PriceUpdateMessage, SetLimitOrderRequest} from '@/types/marketTypes';
import {marketApi} from '@/api/marketApi';
import {signalRService} from '@/api/signalRApi';

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
        const hubUrl = '/hubs/market';
        signalRService.buildConnection(hubUrl);

        signalRService.on('ReceivePriceUpdate', (updateInfo: PriceUpdateMessage) => {
            const incomingSymbol = updateInfo.symbol;
            const incomingPrice = updateInfo.price;
            const incomingMarketCap = updateInfo.marketCap;

            if (!incomingSymbol) {
                console.error("SignalR Update Missing Symbol:", updateInfo);
                return;
            }

            const index = coins.value.findIndex(c => c.symbol === incomingSymbol);

            if (index !== -1) {
                const oldPrice = coins.value[index].currentPrice;
                let status: 'up' | 'down' | 'none' = 'none';

                if (incomingPrice > oldPrice) status = 'up';
                else if (incomingPrice < oldPrice) status = 'down';

                coins.value[index] = {
                    ...coins.value[index],
                    currentPrice: incomingPrice,
                    marketCap: incomingMarketCap,
                    priceChangeStatus: status
                };

                // Reset status after animation duration
                setTimeout(() => {
                    if (coins.value[index] && coins.value[index].currentPrice === incomingPrice) {
                        coins.value[index] = {
                            ...coins.value[index],
                            priceChangeStatus: 'none'
                        };
                    }
                }, 2000);
            } else {
                console.warn(`Coin with symbol ${incomingSymbol} not found in store.`);
            }
        }, hubUrl);

        signalRService.on('ReceiveHistoryUpdate', (updateInfo: HistoryUpdateMessage) => {

        }, hubUrl);

        await signalRService.startConnection(hubUrl);
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