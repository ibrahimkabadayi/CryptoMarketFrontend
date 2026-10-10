import apiClient from '@/api/axios';
import type { PriceAlertDto, CreatePriceAlertRequest } from '@/types/priceAlertTypes';

export const priceAlertApi = {
    createAlert: async (request: CreatePriceAlertRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('api/price-alerts', request);
        return response.data;
    },

    getActiveAlerts: async (): Promise<PriceAlertDto[]> => {
        const response = await apiClient.get<PriceAlertDto[]>('api/price-alerts/active');
        return response.data;
    },

    getAllAlerts: async (): Promise<PriceAlertDto[]> => {
        const response = await apiClient.get<PriceAlertDto[]>('api/price-alerts/all');
        return response.data;
    },

    deactivateAlert: async (alertId: string): Promise<void> => {
        await apiClient.put(`api/price-alerts/${alertId}/deactivate`);
    }
};
