import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TiffinStackParamList } from '@/app/navigation/types';
import { useTiffinsInfinite } from '../hooks/useTiffins';
import { Tiffin } from '@/domains/tiffins/types';
import { TiffinCard } from '../components/TiffinCard';
import { EmptyState } from '@/ui/components/EmptyState';
import { ErrorState } from '@/ui/components/ErrorState';
import { LoadingSkeletonList } from '@/ui/components/LoadingSkeletonList';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { FilterChip } from '@/ui/components/FilterChip';
import { storage } from '@/services/storage/localStorage';
import { useTheme } from '@/ui/theme';

type Props = NativeStackScreenProps<TiffinStackParamList, 'TiffinList'>;
type SortOption = 'default' | 'price-low' | 'price-high' | 'veg-first';

export const TiffinListScreen: React.FC<Props> = ({ navigation }) => {
    const { isDark, colors } = useTheme();

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [vegOnly, setVegOnly] = useState(false);
    const [priceFilter, setPriceFilter] = useState<'budget' | 'mid' | 'premium' | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useTiffinsInfinite();

    const allTiffins = useMemo(() => {
        const items = data?.pages.flatMap((page) => page.items) ?? [];
        const seen = new Set<string>();
        return items.filter((item) => {
            const id = item._id;
            if (!id) return true;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [data]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        loadFilters();
    }, []);

    useEffect(() => {
        saveFilters();
    }, [vegOnly, priceFilter, sortBy]);

    const loadFilters = async () => {
        const saved = await storage.getFilters('tiffins');
        if (saved) {
            if (saved.vegOnly !== undefined) setVegOnly(saved.vegOnly);
            if (saved.priceFilter) setPriceFilter(saved.priceFilter);
            if (saved.sortBy) setSortBy(saved.sortBy);
        }
    };

    const saveFilters = async () => {
        await storage.saveFilters('tiffins', { vegOnly, priceFilter, sortBy });
    };

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const getPriceValue = (item: Tiffin) => {
        if (typeof item.pricePerMeal === 'number') return item.pricePerMeal;
        if (typeof item.priceRange === 'number') return item.priceRange;
        if (typeof item.priceRange === 'string') {
            const match = item.priceRange.match(/\d+/g);
            if (match && match.length > 0) return Number(match[0]);
        }
        return null;
    };

    const filteredAndSortedTiffins = useMemo(() => {
        const lowerQuery = debouncedQuery.toLowerCase();
        let filtered = allTiffins.filter((item) => {
            const searchable = [item.name, item.shortDescription, ...(item.mealPlans || [])]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            if (lowerQuery && !searchable.includes(lowerQuery)) return false;
            if (vegOnly && !item.vegOnly) return false;

            const priceValue = getPriceValue(item);
            if (priceFilter && priceValue !== null) {
                if (priceFilter === 'budget' && priceValue > 120) return false;
                if (priceFilter === 'mid' && (priceValue <= 120 || priceValue > 250)) return false;
                if (priceFilter === 'premium' && priceValue <= 250) return false;
            }
            return true;
        });

        if (sortBy === 'price-low') {
            filtered = filtered.sort((a, b) => {
                const priceA = getPriceValue(a) ?? Infinity;
                const priceB = getPriceValue(b) ?? Infinity;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered = filtered.sort((a, b) => {
                const priceA = getPriceValue(a) ?? 0;
                const priceB = getPriceValue(b) ?? 0;
                return priceB - priceA;
            });
        } else if (sortBy === 'veg-first') {
            filtered = filtered.sort((a, b) => {
                if (a.vegOnly && !b.vegOnly) return -1;
                if (!a.vegOnly && b.vegOnly) return 1;
                return 0;
            });
        }

        return filtered;
    }, [allTiffins, debouncedQuery, vegOnly, priceFilter, sortBy]);

    const handleTiffinPress = useCallback((id: string) => {
        navigation.navigate('TiffinDetail', { id });
    }, [navigation]);

    const renderItem = useCallback(({ item }: { item: Tiffin }) => (
        <TiffinCard item={item} onPress={handleTiffinPress} />
    ), [handleTiffinPress]);

    const keyExtractor = useCallback((item: Tiffin, index: number) => item._id || index.toString(), []);

    const getItemLayout = useCallback((data: ArrayLike<Tiffin> | null | undefined, index: number) => ({
        length: 240,
        offset: 240 * index,
        index,
    }), []);

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className="py-4">
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const sortOptions = [
        { value: 'default', label: 'Default' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'veg-first', label: 'Veg Priority' },
    ];

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="bg-[#f5efe8] dark:bg-gray-900 px-4 pt-12 pb-6">
                <View className="absolute right-[-30px] top-[-20px] h-28 w-28 rounded-full bg-[#efe6db] dark:bg-gray-800" />
                <View className="absolute left-[-20px] bottom-[-30px] h-24 w-24 rounded-full bg-[#efe6db] dark:bg-gray-800" />
                <ScreenHeader
                    title="Tiffin"
                    subtitle="Home-style meal services"
                    rightSlot={
                        <TouchableOpacity
                            data-testid="sort-button"
                            onPress={() => setShowSortMenu(!showSortMenu)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2"
                            style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }]}
                        >
                            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-200">Sort ▼</Text>
                        </TouchableOpacity>
                    }
                />
                <View className="mt-4">
                    <TextInput
                        data-testid="search-input"
                        className="bg-white dark:bg-gray-900 px-4 py-3 rounded-2xl text-base text-gray-900 dark:text-gray-50"
                        placeholder="Search by meal plan or provider"
                        placeholderTextColor={colors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
            </View>

            {showSortMenu && (
                <View
                    className="bg-white dark:bg-gray-900 mx-4 rounded-2xl mb-2 border border-gray-100 dark:border-gray-800"
                    style={{ elevation: isDark ? 0 : 4 }}
                >
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            data-testid={`sort-option-${option.value}`}
                            className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${sortBy === option.value ? 'bg-[#02757A]/10' : ''}`}
                            onPress={() => {
                                setSortBy(option.value as SortOption);
                                setShowSortMenu(false);
                            }}
                        >
                            <Text className={`text-sm font-semibold ${sortBy === option.value ? 'text-[#02757A]' : 'text-gray-900 dark:text-gray-50'}`}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View className="px-4 -mt-4">
                <View
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm"
                    style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }]}
                >
                    <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">Quick filters</Text>
                    <View className="flex-row flex-wrap mt-3">
                        <FilterChip
                            label="Veg"
                            selected={vegOnly}
                            onPress={() => setVegOnly((prev) => !prev)}
                            testID="filter-chip-veg"
                        />
                        <FilterChip
                            label="Budget"
                            selected={priceFilter === 'budget'}
                            onPress={() => setPriceFilter(priceFilter === 'budget' ? null : 'budget')}
                            testID="filter-chip-budget"
                        />
                        <FilterChip
                            label="Mid"
                            selected={priceFilter === 'mid'}
                            onPress={() => setPriceFilter(priceFilter === 'mid' ? null : 'mid')}
                            testID="filter-chip-mid"
                        />
                        <FilterChip
                            label="Premium"
                            selected={priceFilter === 'premium'}
                            onPress={() => setPriceFilter(priceFilter === 'premium' ? null : 'premium')}
                            testID="filter-chip-premium"
                        />
                    </View>
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeletonList />
            ) : isError ? (
                <ErrorState message="Failed to load tiffin services." onRetry={refetch} />
            ) : (
                <FlatList
                    data={filteredAndSortedTiffins}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 20 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews
                    getItemLayout={getItemLayout}
                    ListEmptyComponent={
                        <EmptyState
                            title="No tiffin services found"
                            description="Try adjusting your search or filters."
                            actionLabel="Clear search"
                            onAction={() => {
                                setQuery('');
                                setVegOnly(false);
                                setPriceFilter(null);
                                setSortBy('default');
                            }}
                        />
                    }
                />
            )}
        </View>
    );
};
