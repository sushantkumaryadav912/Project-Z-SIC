import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://project-z-backend-apis.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Explicitly no auth interceptors as per requirements
