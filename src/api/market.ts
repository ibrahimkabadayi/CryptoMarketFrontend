import apiClient from './axios'
import type {Coin} from '@/types/market';

export const marketApi = {
    getAllCoins: async () => {
        const response = await apiClient.get<Coin[]>('/api/market');
        return response.data as Coin[];
    }
}