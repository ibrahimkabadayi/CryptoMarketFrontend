import apiClient from '@/api/axios';
import type {
    LimitOrderDto,
    CreateLimitOrderRequest,
    UpdateLimitOrderRequest
} from '@/types/limitOrderTypes';

export const limitOrderApi = {
    createLimitOrder: async (request: CreateLimitOrderRequest): Promise<void> => {
        if (!localStorage.getItem('token')) return;
        await apiClient.post('api/limit-orders', request, getFinancialHeaders());
    },

    getLimitOrder: async (id: string): Promise<LimitOrderDto | null> => {
        if (!localStorage.getItem('token')) return null;
        const response = await apiClient.get<LimitOrderDto>(`api/limit-orders/${id}`, getFinancialHeaders());
        return response.data;
    },

    getAllLimitOrders: async (): Promise<LimitOrderDto[]> => {
        if (!localStorage.getItem('token')) return [];
        const response = await apiClient.get<LimitOrderDto[]>('api/limit-orders', getFinancialHeaders());
        return response.data;
    },

    updateLimitOrder: async (id: string, request: UpdateLimitOrderRequest): Promise<void> => {
        if (!localStorage.getItem('token')) return;
        await apiClient.patch(`api/limit-orders/${id}`, request, getFinancialHeaders());
    },

    deleteLimitOrder: async (id: string): Promise<void> => {
        if (!localStorage.getItem('token')) return;
        await apiClient.delete(`api/limit-orders/${id}`, getFinancialHeaders());
    }
}

const getFinancialHeaders = () => ({
    headers: {
        'Idempotency-Key': crypto.randomUUID()
    }
});
