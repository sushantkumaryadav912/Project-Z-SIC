import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Retro 1 time on failure before throwing error
            refetchOnWindowFocus: false, // Don't refetch on app focus
            staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
            gcTime: 10 * 60 * 1000,   // Keep unused data in cache for 10 minutes
        },
    },
});
