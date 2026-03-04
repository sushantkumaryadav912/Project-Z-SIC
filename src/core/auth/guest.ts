import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/axios';

type GuestCredentials = {
    username: string;
    email: string;
    password: string;
};

type GuestSession = {
    email: string;
    password: string;
    token?: string;
};

const GUEST_CREDENTIALS: GuestCredentials = {
    username: 'Guest',
    email: 'guest@gmail.com',
    password: 'Guest@123',
};

const GUEST_SESSION_KEY = 'sic_guest_session';

const saveGuestSession = async (session: GuestSession) => {
    await SecureStore.setItemAsync(GUEST_SESSION_KEY, JSON.stringify(session));
    if (session.token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${session.token}`;
    }
};

export const getGuestSession = async (): Promise<GuestSession | null> => {
    const stored = await SecureStore.getItemAsync(GUEST_SESSION_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as GuestSession;
    } catch {
        return null;
    }
};

const loginGuest = async () => {
    const response = await apiClient.post('/api/login', {
        email: GUEST_CREDENTIALS.email,
        password: GUEST_CREDENTIALS.password,
        rememberMe: true,
    });

    const token = response.data?.token || response.data?.data?.token;
    await saveGuestSession({
        email: GUEST_CREDENTIALS.email,
        password: GUEST_CREDENTIALS.password,
        token,
    });

    return response.data;
};

const signupGuest = async () => {
    const response = await apiClient.post('/api/signup', {
        username: GUEST_CREDENTIALS.username,
        email: GUEST_CREDENTIALS.email,
        password: GUEST_CREDENTIALS.password,
    });

    return response.data;
};

export const loginAsGuest = async () => {
    try {
        return await loginGuest();
    } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 404) {
            await signupGuest();
            return loginGuest();
        }
        throw error;
    }
};
