import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { limitOrderApi } from '@/api/limitOrderApi';
import { LimitOrderType } from '@/types/limitOrderTypes';
import type { LimitOrderDto } from '@/types/limitOrderTypes';

function getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));

        return (
            decoded.nameid ||
            decoded.sub ||
            decoded.userId ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            null
        );
    } catch {
        console.error('Failed to decode JWT token');
        return null;
    }
}

export const useLimitOrderStore = defineStore('limitOrder', () => {
    const orders = ref<LimitOrderDto[]>([]);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const userId = computed(() => getUserIdFromToken());

    const sortedOrders = computed(() => {
        return [...orders.value].sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    });

    const buyOrders = computed(() =>
        sortedOrders.value.filter(o => o.orderType === LimitOrderType.Buy)
    );

    const sellOrders = computed(() =>
        sortedOrders.value.filter(o => o.orderType === LimitOrderType.Sell)
    );

    const fetchAllOrders = async () => {
        isLoading.value = true;
        errorMessage.value = '';
        try {
            orders.value = await limitOrderApi.getAllLimitOrders();
        } catch (error) {
            console.error('Failed to fetch limit orders:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const createOrder = async (
        walletId: string,
        symbol: string,
        targetPrice: number,
        amount: number,
        orderType: 'Buy' | 'Sell'
    ): Promise<boolean> => {
        if (!userId.value) return false;
        errorMessage.value = '';
        successMessage.value = '';

        try {
            await limitOrderApi.createLimitOrder({
                userId: userId.value,
                walletId,
                symbol,
                targetPrice,
                amount,
                orderType: orderType === 'Buy' ? LimitOrderType.Buy : LimitOrderType.Sell
            });

            successMessage.value = `${orderType} limit order placed for ${symbol}`;
            await fetchAllOrders();

            setTimeout(() => { successMessage.value = ''; }, 3000);
            return true;
        } catch (error: any) {
            errorMessage.value = error?.response?.data?.message || 'Failed to create limit order';
            console.error('Failed to create limit order:', error);
            return false;
        }
    };

    const updateOrder = async (id: string, amount: number, targetPrice: number): Promise<boolean> => {
        errorMessage.value = '';
        successMessage.value = '';

        try {
            await limitOrderApi.updateLimitOrder(id, { amount, targetPrice });
            successMessage.value = 'Limit order updated';

            const order = orders.value.find(o => o.id === id);
            if (order) {
                order.amount = amount;
                order.targetPrice = targetPrice;
            }

            setTimeout(() => { successMessage.value = ''; }, 3000);
            return true;
        } catch (error: any) {
            errorMessage.value = error?.response?.data?.message || 'Failed to update limit order';
            console.error('Failed to update limit order:', error);
            return false;
        }
    };

    const deleteOrder = async (id: string): Promise<boolean> => {
        errorMessage.value = '';
        try {
            await limitOrderApi.deleteLimitOrder(id);
            orders.value = orders.value.filter(o => o.id !== id);
            return true;
        } catch (error: any) {
            errorMessage.value = error?.response?.data?.message || 'Failed to delete limit order';
            console.error('Failed to delete limit order:', error);
            return false;
        }
    };

    const clearMessages = () => {
        errorMessage.value = '';
        successMessage.value = '';
    };

    return {
        orders,
        sortedOrders,
        buyOrders,
        sellOrders,
        isLoading,
        errorMessage,
        successMessage,
        userId,
        fetchAllOrders,
        createOrder,
        updateOrder,
        deleteOrder,
        clearMessages
    };
});
