import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Restaurant, RestaurantDetail } from '../types/restaurant';

export const useRestaurants = () => {
    return useQuery({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.restaurants.list);
            return (data.data || data) as Restaurant[];
        },
    });
};

export const useRestaurantDetail = (id: string) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.restaurants.detail(id));
            return (data.data || data) as RestaurantDetail;
        },
        enabled: !!id,
    });
};
