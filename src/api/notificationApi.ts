import apiClient from '@/api/axios';
import type { NotificationDto, CreateNotificationRequest } from '@/types/notificationTypes';

export const notificationApi = {
    getUserNotifications: async (userId: string): Promise<NotificationDto[]> => {
        const response = await apiClient.get<NotificationDto[]>(`api/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const response = await apiClient.get<number>(`api/notifications/user/${userId}/unread-count`);
        return response.data;
    },

    markAsRead: async (notificationId: string, userId: string): Promise<void> => {
        await apiClient.put(`api/notifications/${notificationId}/read`, JSON.stringify(userId), {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    markAllAsRead: async (userId: string): Promise<void> => {
        await apiClient.put(`api/notifications/user/${userId}/mark-all-read`);
    },

    createNotification: async (request: CreateNotificationRequest): Promise<void> => {
        await apiClient.post('api/notifications', request);
    }
};
