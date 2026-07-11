import apiClient from './axios'
import type {Coin, PriceHistory, SetLimitOrderRequest} from '@/types/marketTypes';

export const marketApi = {
    getAllCoins: async () => {
        const response = await apiClient.get<Coin[]>('api/market');
        return response.data as Coin[];
    },
    getPriceHistory: async (symbol: string, timeframe: string = '1d') => {
        let intervalMinutes = 15;
        let hoursBack = 24;

        switch (timeframe) {
            case '1h':
                intervalMinutes = 1;
                hoursBack = 1;
                break;
            case '1d':
                intervalMinutes = 15;
                hoursBack = 24;
                break;
            case '7d':
                intervalMinutes = 60;
                hoursBack = 168;
                break;
            case '30d':
                intervalMinutes = 240;
                hoursBack = 720;
                break;
        }

        const response = await apiClient.get<PriceHistory[]>(`api/market/${symbol}/history?intervalMinutes=${intervalMinutes}&hoursBack=${hoursBack}`)
        return response.data as PriceHistory[];
    },
    buyCoin: async (coin: Coin, amount: number) => {
        const request = {
            amount: amount,
            price: coin.currentPrice
        }

        if (!localStorage.getItem('token'))
            return;

        await apiClient.post(`api/market/${coin.symbol}`, request)
    },
    setLimitOrder: async (credentials: SetLimitOrderRequest) => {
        if (!localStorage.getItem('token'))
            return;

        await apiClient.post(`api/market/limit-order/${credentials.symbol}`, credentials)
    }
}