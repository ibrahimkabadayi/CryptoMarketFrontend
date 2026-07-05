export interface NotificationDto {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    relatedEntityId?: string;
}

export interface CreateNotificationRequest {
    userId: string;
    title: string;
    message: string;
    type: string;
    relatedEntityId?: string;
}
