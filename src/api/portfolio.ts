import apiClient from "@/api/axios";
import type { Dashboard } from "@/types/portfolio";

export const portfolioApi = {
    getDashboard: async() =>
    {
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
    }
}