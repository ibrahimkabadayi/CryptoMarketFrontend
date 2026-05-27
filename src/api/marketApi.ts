import apiClient from './axios'
import type {Coin, PriceHistory, SetLimitOrderRequest} from '@/types/marketTypes';

export const marketApi = {
    getAllCoins: async () => {
        const response = await apiClient.get<Coin[]>('api/market');
        return response.data as Coin[];
    },
    getPriceHistory: async (symbol: string, timeframe: string = '1d') => {
        const response = await apiClient.get<PriceHistory[]>(`api/market/${symbol}/history?timeframe=${timeframe}`)
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