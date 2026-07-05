export interface PriceAlertDto {
    id: string;
    userId: string;
    symbol: string;
    targetPrice: number;
    isAbove: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePriceAlertRequest {
    userId: string;
    symbol: string;
    targetPrice: number;
    isAbove: boolean;
}
