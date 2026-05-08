import apiClient from "@/api/axios";
import type { Dashboard } from "@/types/portfolio";

export const portfolioApi = {
    getDashboard: async() =>
    {
        const response = await apiClient.get<Dashboard>("/api/portfolio");
        return response.data as Dashboard;
    }
}