export interface Coin {
    name: string;
    symbol: string;
    currentPrice: number;
    marketCap: number;
}

export interface PriceUpdateMessage {
    symbol: string;
    price: number;
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
    orderType: OrderType;
}

enum OrderType {
    buy = "Buy",
    sell = "Sell",
}