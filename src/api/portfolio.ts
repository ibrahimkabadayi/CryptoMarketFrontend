import apiClient from "@/api/axios";
import type {Dashboard} from "@/types/portfolio";
import {Coin} from "@/types/market";

export const portfolioApi = {
    getDashboard: async() => {
        const response = await apiClient.get<any>("/api/wallets");

        const data = response.data.result;

        return {
            walletId: data.walletId,
            address: data.address,
            fiatBalance: data.fiatBalance,
            totalInvestedValue: data.totalInvestedValue,
            assets: data.assets,
            recentTransactions: data.recentTransactions
        } as Dashboard;
    },

    deposit: async (walletId: string, amount: number) => {
        try {
            const request = {
                amount: amount
            };

            const response = await apiClient.post(`api/wallets/${walletId}/transaction`, request, getFinancialHeaders());
            return response.data;
        }catch (error) {
            console.error(error);
        }
    },

    withdraw: async (walletId: string, amount: number) => {
        try {
            const request = {
                amount: amount
            };

            const response = await apiClient.patch(`api/wallets/${walletId}` , request, getFinancialHeaders());
            return response.data;
        }catch (error) {
            console.error(error);
        }
    },

    buyCoin: async (walletId: string, quantity: number, coin: Coin) => {
        const request = {
            amount: quantity,
            buyingPrice: coin.currentPrice
        }

        await apiClient.post(`/api/wallets/${walletId}/assets/${coin.symbol}`, request, getFinancialHeaders());
    },

    sellCoin: async (walletId: string, amount: number, coin: Coin) => {
        const request = {
            amount: amount,
            price: coin.currentPrice
        }

        await apiClient.patch(`/api/wallets/${walletId}/assets/${coin.symbol}`, request, getFinancialHeaders());
    },
}

const getFinancialHeaders = () => ({
    headers: {
        'Idempotency-Key': crypto.randomUUID()
    }
});