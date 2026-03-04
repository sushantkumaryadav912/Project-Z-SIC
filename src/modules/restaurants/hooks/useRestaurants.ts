import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Restaurant, RestaurantDetail } from '../types/restaurant';

type TakeawayListParams = Record<string, string | number | boolean | string[] | undefined>;

export const useRestaurants = (params?: TakeawayListParams) => {
    const queryParams = { feature: 'Takeaway', ...(params || {}) };
    return useQuery({
        queryKey: ['restaurants', queryParams],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.list, { params: queryParams });
            const payload = data?.data ?? data;
            if (Array.isArray(payload)) return payload as Restaurant[];
            if (Array.isArray(payload?.restaurants)) return payload.restaurants as Restaurant[];
            if (Array.isArray(payload?.items)) return payload.items as Restaurant[];
            if (Array.isArray(payload?.data)) return payload.data as Restaurant[];
            return [] as Restaurant[];
        },
    });
};

export const useRestaurantDetail = (id: string) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.detail(id));
            return (data.data || data) as RestaurantDetail;
        },
        enabled: !!id,
    });
};

export const useRestaurantMenuSections = (id: string) => {
    return useQuery({
        queryKey: ['restaurant-menu-sections', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.menuSections(id));
            return data?.data ?? data;
        },
        enabled: !!id,
    });
};

export const useTakeawayRecentlyViewed = () => {
    return useQuery({
        queryKey: ['takeaway-recently-viewed'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.recentlyViewed.list);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTrackTakeawayRecentlyViewed = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.recentlyViewed.track(id));
            return data?.data ?? data;
        },
    });
};

export const useTakeawayFavorites = () => {
    return useQuery({
        queryKey: ['takeaway-favorites'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.favorites.list);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? payload : [];
        },
    });
};

export const useTakeawayFavoriteStatus = (id: string) => {
    return useQuery({
        queryKey: ['takeaway-favorite-status', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.favorites.check(id));
            return data?.data ?? data;
        },
        enabled: !!id,
    });
};

export const useTakeawayLikeStatus = (id: string) => {
    return useQuery({
        queryKey: ['takeaway-like-status', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.favorites.isLike(id));
            return data?.data ?? data;
        },
        enabled: !!id,
    });
};

export const useAddTakeawayFavorite = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.favorites.add(id));
            return data?.data ?? data;
        },
    });
};

export const useRemoveTakeawayFavorite = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.favorites.remove(id));
            return data?.data ?? data;
        },
    });
};

export const useLikeTakeaway = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.favorites.like(id));
            return data?.data ?? data;
        },
    });
};

type PaginationParams = { page?: number; limit?: number };

export const useTakeawayOrders = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ['takeaway-orders', params],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.orders.list, { params });
            return data?.data ?? data;
        },
    });
};

export const useTakeawayFavoriteOrders = (params?: PaginationParams) => {
    const queryParams = { type: 'Firm', ...(params || {}) };
    return useQuery({
        queryKey: ['takeaway-favorite-orders', queryParams],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.orders.favoriteList, { params: queryParams });
            return data?.data ?? data;
        },
    });
};

export const useToggleTakeawayOrderFavorite = () => {
    return useMutation({
        mutationFn: async (orderId: string) => {
            const { data } = await apiClient.put(ENDPOINTS.takeaway.orders.toggleFavorite(orderId));
            return data?.data ?? data;
        },
    });
};

type ApplyOfferParams = {
    firmId: string;
    productIds?: string[];
    categoryId?: string;
    subcategoryIds?: string[];
};

export const useTakeawayOffers = (params: ApplyOfferParams) => {
    return useQuery({
        queryKey: ['takeaway-offers', params],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.offers.apply, { params });
            return data?.data ?? data;
        },
        enabled: !!params?.firmId,
    });
};

export const useTakeawayNotifications = () => {
    return useQuery({
        queryKey: ['takeaway-notifications'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.takeaway.notifications.list);
            return data?.data ?? data;
        },
    });
};

export const useUpdateTakeawayNotifications = () => {
    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.notifications.update, payload);
            return data?.data ?? data;
        },
    });
};

export const useCreateTakeawayOrder = () => {
    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const { data } = await apiClient.post(ENDPOINTS.takeaway.orders.create, payload);
            return data?.data ?? data;
        },
    });
};
