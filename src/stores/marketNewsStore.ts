import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {MarketNews} from '@/types/marketNewsTypes';
import {marketNewsApi} from "@/api/marketNewsApi";
import {signalRService} from '@/api/signalRApi';

export const useMarketNewsStore = defineStore('market-news', () => {
    const news = ref<MarketNews[]>([]);
    const coinSymbol = ref("");
    const isLoading = ref(false);
    const errorMessage = ref('');

    const fetchRecentNews = async () => {
        isLoading.value = true;
        try {
            news.value = await marketNewsApi.getRecentNews();
            coinSymbol.value = "";
        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNewsBySymbol = async (symbol: string) => {
        isLoading.value = true;
        try {
            news.value = await marketNewsApi.getNewsByCoin(symbol);
            coinSymbol.value = symbol;
        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            isLoading.value = false;
        }
    };

    const initPortfolioSignalR = async () => {
        const hubUrl = '/hubs/price-alerts';
        signalRService.buildConnection(hubUrl, true)

        signalRService.on('PublishNews', (data: MarketNews) => {
            if (coinSymbol.value === "") {
                news.value.unshift(data);
            }
            else if (data.relatedSymbols.includes(coinSymbol.value)) {
                news.value.unshift(data);
            }
        }, hubUrl);

        await signalRService.startConnection(hubUrl);
    };

    return {
        news,
        isLoading,
        errorMessage,
        fetchRecentNews,
        fetchNewsBySymbol,
        initPortfolioSignalR
    }
});