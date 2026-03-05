import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://project-z-backend-apis.onrender.com',
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
