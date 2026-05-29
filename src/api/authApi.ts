import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "@/types/authTypes";
import apiClient from "./axios";

export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<LoginResponse>("api/auth/login", credentials);
            return response.data;
        }
        catch(error) {
            throw error;
        }
    },
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await apiClient.post<RegisterResponse>("api/auth/register", data);
            return response.data;
        }
        catch(error) {
            throw error;
        }
    }
}