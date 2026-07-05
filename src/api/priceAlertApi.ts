import apiClient from '@/api/axios';
import type { PriceAlertDto, CreatePriceAlertRequest } from '@/types/priceAlertTypes';

export const priceAlertApi = {
    createAlert: async (request: CreatePriceAlertRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('api/price-alerts', request);
        return response.data;
    },

    getActiveAlerts: async (userId: string): Promise<PriceAlertDto[]> => {
        const response = await apiClient.get<PriceAlertDto[]>(`api/price-alerts/user/${userId}/active`);
        return response.data;
    },

    getAllAlerts: async (userId: string): Promise<PriceAlertDto[]> => {
        const response = await apiClient.get<PriceAlertDto[]>(`api/price-alerts/user/${userId}/all`);
        return response.data;
    },

    deactivateAlert: async (alertId: string, userId: string): Promise<void> => {
        await apiClient.put(`api/price-alerts/${alertId}/deactivate`, JSON.stringify(userId), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
