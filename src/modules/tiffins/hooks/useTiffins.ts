import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Tiffin, TiffinDetail } from '../types/tiffin';

type TiffinListParams = Record<string, string | number | boolean | string[] | undefined>;

export const useTiffins = (params?: TiffinListParams) => {
    return useQuery({
        queryKey: ['tiffins', params],
        queryFn: async () => {
            const response = await apiClient.get<{ data: Tiffin[] }>(ENDPOINTS.tiffins.list, { params });
            const payload = response.data?.data ?? response.data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTiffinsOpenNow = () => {
    return useQuery({
        queryKey: ['tiffins-open-now'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.openNow);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTiffinsHighRated = () => {
    return useQuery({
        queryKey: ['tiffins-high-rated'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.highRated);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTiffinsByKitchenName = (kitchenName?: string) => {
    return useTiffins(kitchenName ? { kitchenName } : undefined);
};

export const useTiffinDetail = (id: string) => {
    return useQuery({
        queryKey: ['tiffin', id],
        queryFn: async () => {
            const response = await apiClient.get<{ data: TiffinDetail }>(ENDPOINTS.tiffins.detail(id));
            return response.data?.data ?? response.data;
        },
        enabled: !!id,
    });
};

export const useTiffinOffers = (id: string) => {
    return useQuery({
        queryKey: ['tiffin-offers', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.offers(id));
            return data?.data ?? data;
        },
        enabled: !!id,
    });
};

export const useTiffinFavorites = () => {
    return useQuery({
        queryKey: ['tiffin-favorites'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.favorites);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

type PaginationParams = { page?: number; limit?: number };

export const useTiffinFavoriteOrders = (params?: PaginationParams) => {
    const queryParams = { type: 'Tiffin', ...(params || {}) };
    return useQuery({
        queryKey: ['tiffin-favorite-orders', queryParams],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.favoriteOrders, { params: queryParams });
            return data?.data ?? data;
        },
    });
};

export const useToggleTiffinOrderFavorite = () => {
    return useMutation({
        mutationFn: async (orderId: string) => {
            const { data } = await apiClient.put(ENDPOINTS.tiffins.toggleOrderFavorite(orderId));
            return data?.data ?? data;
        },
    });
};

export const useTiffinRecentlyViewed = () => {
    return useQuery({
        queryKey: ['tiffin-recently-viewed'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.tiffins.recentlyViewed);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTrackTiffinRecentlyViewed = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(ENDPOINTS.tiffins.trackRecentlyViewed(id));
            return data?.data ?? data;
        },
    });
};
