import apiClient from './axios'
import {MarketNews} from "@/types/marketNewsTypes";

export const marketNewsApi = {
    getRecentNews: async (): Promise<MarketNews[]> => {
        const response = await apiClient.get<MarketNews[]>('api/market-news');
        return response.data;
    },
    getNewsByCoin: async (symbol: string): Promise<MarketNews[]> => {
        const response = await apiClient.get<MarketNews[]>(`api/market-news/coin/${symbol}`);
        return response.data;
    },
}