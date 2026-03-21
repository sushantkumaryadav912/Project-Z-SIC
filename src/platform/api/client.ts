import axios from 'axios';
import { AppConfig } from '@/platform/config';

export const apiClient = axios.create({
    baseURL: AppConfig.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API SUCCESS] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const url = error.config?.url || 'UNKNOWN';
        const status = error.response?.status || 'NO_RESPONSE';
        const message = error.message || 'Unknown error';

        console.error(`[API ERROR] ${method} ${url} - Status: ${status} - ${message}`);

        if (error.response?.data) {
            console.error('[API ERROR DATA]', error.response.data);
        }
        return Promise.reject(error);
    }
);

// Log the configured base URL on initialization
console.log('[API CLIENT] Initialized with baseURL:', AppConfig.API_BASE_URL);
