import { useAppSelector } from './useAppStore';

export const useFeatureFlags = () => {
    const featureFlags = useAppSelector((state) => state.ui.featureFlags);

    return { data: featureFlags, isLoading: false, isError: false };
};
