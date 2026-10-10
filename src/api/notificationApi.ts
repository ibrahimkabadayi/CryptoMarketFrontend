import apiClient from '@/api/axios';
import type { NotificationDto, CreateNotificationRequest } from '@/types/notificationTypes';

export const notificationApi = {
    getUserNotifications: async (): Promise<NotificationDto[]> => {
        const response = await apiClient.get<NotificationDto[]>('api/notifications');
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get<number>('api/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (notificationId: string): Promise<void> => {
        await apiClient.put(`api/notifications/${notificationId}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await apiClient.put('api/notifications/mark-all-read');
    },

    createNotification: async (request: CreateNotificationRequest): Promise<void> => {
        await apiClient.post('api/notifications', request);
    }
};
