export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    token: string;
    message: string;
}

export interface RegisterRequest {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
}