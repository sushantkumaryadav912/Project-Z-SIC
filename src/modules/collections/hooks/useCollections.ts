import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Collection, CollectionDetail } from '../types/collection';

export const useCollections = () => {
    return useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const response = await apiClient.get<Collection[] | { data: Collection[] }>(ENDPOINTS.activeCollections);
            // Depending on API wrapping
            return (response.data as any)?.data || response.data || [];
        },
    });
};

export const useCollectionDetail = (slug: string) => {
    return useQuery({
        queryKey: ['collection', slug],
        queryFn: async () => {
            const response = await apiClient.get<CollectionDetail | { data: CollectionDetail }>(ENDPOINTS.collectionBySlug(slug));
            return (response.data as any)?.data || response.data;
        },
        enabled: !!slug,
    });
};
