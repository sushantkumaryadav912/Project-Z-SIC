import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://project-z-backend-apis.onrender.com';

const getApiBaseUrl = (): string => {
    const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
    const baseUrl = (raw && raw.trim().length > 0 ? raw.trim() : DEFAULT_API_BASE_URL).replace(/\/+$/, '');
    return baseUrl;
};

export const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API SUCCESS] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.message}`, error.response?.data);
        return Promise.reject(error);
    }
);
