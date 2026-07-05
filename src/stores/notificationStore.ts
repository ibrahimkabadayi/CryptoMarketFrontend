import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { notificationApi } from '@/api/notificationApi';
import { signalRService } from '@/api/signalRApi';
import type { NotificationDto } from '@/types/notificationTypes';

/**
 * Decodes a JWT token and extracts the userId from common claim names.
 * Tries: 'nameid', 'sub', 'userId', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
 */
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

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<NotificationDto[]>([]);
    const unreadCount = ref(0);
    const isLoading = ref(false);
    const isDropdownOpen = ref(false);

    const userId = computed(() => getUserIdFromToken());

    const sortedNotifications = computed(() => {
        return [...notifications.value].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    const fetchNotifications = async () => {
        if (!userId.value) return;
        isLoading.value = true;
        try {
            notifications.value = await notificationApi.getUserNotifications(userId.value);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchUnreadCount = async () => {
        if (!userId.value) return;
        try {
            unreadCount.value = await notificationApi.getUnreadCount(userId.value);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        if (!userId.value) return;
        try {
            await notificationApi.markAsRead(notificationId, userId.value);

            const notification = notifications.value.find(n => n.id === notificationId);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId.value) return;
        try {
            await notificationApi.markAllAsRead(userId.value);

            notifications.value.forEach(n => (n.isRead = true));
            unreadCount.value = 0;
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
        isDropdownOpen.value = false;
    };

    const initNotificationSignalR = async () => {
        try {
            const hubUrl = '/hubs/notifications';
            signalRService.buildConnection(hubUrl, true);

            signalRService.on('ReceiveNotification', (notification: NotificationDto) => {
                notifications.value.unshift(notification);
                if (!notification.isRead) {
                    unreadCount.value++;
                }
            }, hubUrl);

            await signalRService.startConnection(hubUrl);
        } catch (error) {
            console.error('Failed to initialize notification SignalR:', error);
        }
    };

    const init = async () => {
        if (!userId.value) return;
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        await initNotificationSignalR();
    };

    return {
        notifications,
        sortedNotifications,
        unreadCount,
        isLoading,
        isDropdownOpen,
        userId,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        toggleDropdown,
        closeDropdown,
        initNotificationSignalR,
        init
    };
});
