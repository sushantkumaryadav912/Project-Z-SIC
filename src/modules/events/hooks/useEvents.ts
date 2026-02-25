import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Event } from '../types/event';

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data } = await apiClient.get(ENDPOINTS.events.list);
            return (data.data || data) as Event[];
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
