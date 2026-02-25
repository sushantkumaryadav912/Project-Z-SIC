import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Tiffin, TiffinDetail } from '../types/tiffin';

export const useTiffins = () => {
    return useQuery({
        queryKey: ['tiffins'],
        queryFn: async () => {
            const response = await apiClient.get<{ data: Tiffin[] }>(ENDPOINTS.tiffins.list);
            // The exact path depends on backend structure, assuming { data: [...] } for now or direct array
            return response.data?.data || response.data || [];
        },
    });
};

export const useTiffinDetail = (id: string) => {
    return useQuery({
        queryKey: ['tiffin', id],
        queryFn: async () => {
            const response = await apiClient.get<{ data: TiffinDetail }>(ENDPOINTS.tiffins.detail(id));
            return response.data?.data || response.data;
        },
        enabled: !!id,
    });
};
