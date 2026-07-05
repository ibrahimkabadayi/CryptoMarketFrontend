import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { priceAlertApi } from '@/api/priceAlertApi';
import type { PriceAlertDto } from '@/types/priceAlertTypes';

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

export const usePriceAlertStore = defineStore('priceAlert', () => {
    const alerts = ref<PriceAlertDto[]>([]);
    const isLoading = ref(false);
    const isDropdownOpen = ref(false);
    const errorMessage = ref('');
    const showAllAlerts = ref(false);

    const userId = computed(() => getUserIdFromToken());

    const activeAlerts = computed(() =>
        alerts.value.filter(a => a.isActive)
    );

    const activeCount = computed(() => activeAlerts.value.length);

    const sortedAlerts = computed(() => {
        return [...alerts.value].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    const fetchAlerts = async () => {
        if (!userId.value) return;
        isLoading.value = true;
        errorMessage.value = '';
        try {
            if (showAllAlerts.value) {
                alerts.value = await priceAlertApi.getAllAlerts(userId.value);
            } else {
                alerts.value = await priceAlertApi.getActiveAlerts(userId.value);
            }
        } catch (error) {
            console.error('Failed to fetch price alerts:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const createAlert = async (symbol: string, targetPrice: number, isAbove: boolean): Promise<boolean> => {
        if (!userId.value) return false;
        errorMessage.value = '';
        try {
            await priceAlertApi.createAlert({
                userId: userId.value,
                symbol,
                targetPrice,
                isAbove
            });

            await fetchAlerts();
            return true;
        } catch (error: any) {
            errorMessage.value = error?.response?.data?.message || 'Failed to create price alert';
            console.error('Failed to create price alert:', error);
            return false;
        }
    };

    const deactivateAlert = async (alertId: string) => {
        if (!userId.value) return;
        try {
            await priceAlertApi.deactivateAlert(alertId, userId.value);

            const alert = alerts.value.find(a => a.id === alertId);
            if (alert) {
                alert.isActive = false;
            }
        } catch (error: any) {
            errorMessage.value = error?.response?.data?.message || 'Failed to deactivate alert';
            console.error('Failed to deactivate price alert:', error);
        }
    };

    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
        isDropdownOpen.value = false;
    };

    const toggleShowAll = async () => {
        showAllAlerts.value = !showAllAlerts.value;
        await fetchAlerts();
    };

    const init = async () => {
        if (!userId.value) return;
        await fetchAlerts();
    };

    return {
        alerts,
        activeAlerts,
        activeCount,
        sortedAlerts,
        isLoading,
        isDropdownOpen,
        errorMessage,
        showAllAlerts,
        userId,
        fetchAlerts,
        createAlert,
        deactivateAlert,
        toggleDropdown,
        closeDropdown,
        toggleShowAll,
        init
    };
});
