import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Event } from '../types/event';

type EventListParams = Record<string, string | number | boolean | string[] | undefined>;

export const useEvents = (params?: EventListParams) => {
    return useQuery({
        queryKey: ['events', params],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.events.list, { params });
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? (payload as Event[]) : [];
        },
    });
};

export const useEventDetail = (id: string) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.events.detail(id));
            return (data.data || data) as Event;
        },
        enabled: !!id,
    });
};

export const useEventFeatured = () => {
    return useQuery({
        queryKey: ['events-featured'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.events.featured);
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? (payload as Event[]) : [];
        },
    });
};

export const useEventSearch = (query?: string) => {
    return useQuery({
        queryKey: ['events-search', query],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.events.search, { params: { q: query } });
            const payload = data?.data ?? data;
            return Array.isArray(payload) ? (payload as Event[]) : [];
        },
        enabled: !!query,
    });
};
