export interface Coin {
    name: string;
    symbol: string;
    currentPrice: number;
    percentChange: number;
    marketCap: number;
    isCapped: boolean;
    iconUrlPng: string;
    priceChangeStatus?: 'up' | 'down' | 'none';
}

export interface PriceUpdateMessage {
    symbol: string;
    price: number;
    marketCap: number;
    percentChange: number;
}

export type HistoryUpdateMessage = {
    symbol: string;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    timestamp: number;
}

export interface PriceHistory {
    symbol: string;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    timestamp: number;
}

export type SetLimitOrderRequest = {
    symbol: string;
    targetPrice: number;
    amount: number;
    orderType: 'Buy' | 'Sell';
}