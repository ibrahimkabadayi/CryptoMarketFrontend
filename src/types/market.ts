export interface Coin
{
    name: string;
    symbol: string;
    currentPrice: number;
    marketCap: number;
}

export interface PriceUpdateMessage
{
    symbol: string;
    price: number;
}