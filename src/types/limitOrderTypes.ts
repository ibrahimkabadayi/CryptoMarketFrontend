export interface LimitOrderDto {
    id: string;
    userId: string;
    walletId: string;
    symbol: string;
    targetPrice: number;
    amount: number;
    orderType: number; // 1 = Buy, 2 = Sell
    status?: string;
    createdAt?: string;
}

export interface CreateLimitOrderRequest {
    userId: string;
    walletId: string;
    symbol: string;
    targetPrice: number;
    amount: number;
    orderType: number; // 1 = Buy, 2 = Sell
}

export interface UpdateLimitOrderRequest {
    amount: number;
    targetPrice: number;
}

export enum LimitOrderType {
    Buy = 1,
    Sell = 2
}
