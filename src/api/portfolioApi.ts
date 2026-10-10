import apiClient from "@/api/axios";
import type {Dashboard} from "@/types/portfolioTypes";
import {Coin} from "@/types/marketTypes";

export const portfolioApi = {
    getDashboard: async() => {
        const response = await apiClient.get<any>("api/wallet");

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

    deposit: async (amount: number) => {
        try {
            const request = {
                amount: amount
            };

            const response = await apiClient.post('api/wallet/deposits', request, getFinancialHeaders());
            return response.data;
        }catch (error) {
            console.error(error);
        }
    },

    withdraw: async (amount: number) => {
        try {
            const request = {
                amount: amount
            };

            const response = await apiClient.post('api/wallet/withdrawals', request, getFinancialHeaders());
            return response.data;
        }catch (error) {
            console.error(error);
        }
    },

    buyCoin: async (quantity: number, coin: Coin) => {
        const request = {
            amount: quantity,
            buyingPrice: coin.currentPrice
        }

        await apiClient.post(`api/wallet/assets/${coin.symbol}/purchases`, request, getFinancialHeaders());
    },

    sellCoin: async (amount: number, coin: Coin) => {
        const request = {
            amount: amount,
            price: coin.currentPrice
        }

        await apiClient.post(`api/wallet/assets/${coin.symbol}/sales`, request, getFinancialHeaders());
    },
}

const getFinancialHeaders = () => ({
    headers: {
        'Idempotency-Key': crypto.randomUUID()
    }
});