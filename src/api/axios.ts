import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    //timeout: 5000
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Caught API error:", error.response?.status);
        return Promise.reject(error);
    }
)

export default apiClient;