import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5145',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
});

apiClient.interceptors.request.use(
    (config) =>
    {
        const token = localStorage.getItem('token');

        if (token && config.headers)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) =>
    {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) =>
    {
        return response;
    },
    (error) =>
    {
        console.error("Caught API error:", error.response?.status);
        return Promise.reject(error);
    }
)

export default apiClient;