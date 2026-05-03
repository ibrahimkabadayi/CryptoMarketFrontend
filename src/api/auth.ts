import {LoginRequest, LoginResponse} from "@/types/auth";
import apiClient from "./axios";

export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try{
            const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials);
            return response.data;
        }catch(error){
            throw error;
        }
    }
}