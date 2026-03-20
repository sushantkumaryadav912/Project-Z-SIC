import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '@/app/navigation/types';
import { useEventsInfinite } from '../hooks/useEvents';
import { Event } from '@/domains/events/types';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '@/ui/components/EmptyState';
import { ErrorState } from '@/ui/components/ErrorState';
import { LoadingSkeletonList } from '@/ui/components/LoadingSkeletonList';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { FilterChip } from '@/ui/components/FilterChip';
import { storage } from '@/services/storage/localStorage';
import { useTheme } from '@/ui/theme';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventList'>;
type SortOption = 'default' | 'date-asc' | 'date-desc' | 'price-low' | 'price-high';

export const EventListScreen: React.FC<Props> = ({ navigation }) => {
    const { isDark, colors } = useTheme();

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<'upcoming' | 'week' | 'past' | null>(null);
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
    } = useEventsInfinite();

    const allEvents = useMemo(() => {
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
    }, [categoryFilter, dateFilter, sortBy]);

    const loadFilters = async () => {
        const saved = await storage.getFilters('events');
        if (saved) {
            if (saved.categoryFilter) setCategoryFilter(saved.categoryFilter);
            if (saved.dateFilter) setDateFilter(saved.dateFilter);
            if (saved.sortBy) setSortBy(saved.sortBy);
        }
    };

    const saveFilters = async () => {
        await storage.saveFilters('events', { categoryFilter, dateFilter, sortBy });
    };

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const categoryOptions = useMemo(() => {
        const set = new Set<string>();
        allEvents.forEach((item) => {
            if (item.category) set.add(item.category);
        });
        return Array.from(set).slice(0, 8);
    }, [allEvents]);

    const isWithinDays = (dateString?: string, days = 7) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return false;
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
    };

    const isPastEvent = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return false;
        return date.getTime() < Date.now();
    };

    const getPrice = (event: Event): number | null => {
        if (typeof event.price === 'number') return event.price;
        if (typeof event.price === 'string') {
            const match = event.price.match(/\d+/);
            return match ? Number(match[0]) : null;
        }
        return null;
    };

    const filteredAndSortedEvents = useMemo(() => {
        const lowerQuery = debouncedQuery.toLowerCase();
        let filtered = allEvents.filter((item) => {
            const title = item.name || item.title || '';
            const searchable = [title, item.description, item.category, item.venue]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            if (lowerQuery && !searchable.includes(lowerQuery)) return false;
            if (categoryFilter && item.category !== categoryFilter) return false;
            if (dateFilter === 'upcoming') return isWithinDays(item.date, 30);
            if (dateFilter === 'week') return isWithinDays(item.date, 7);
            if (dateFilter === 'past') return isPastEvent(item.date);
            return true;
        });

        if (sortBy === 'date-asc') {
            filtered = filtered.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : Infinity;
                const dateB = b.date ? new Date(b.date).getTime() : Infinity;
                return dateA - dateB;
            });
        } else if (sortBy === 'date-desc') {
            filtered = filtered.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });
        } else if (sortBy === 'price-low') {
            filtered = filtered.sort((a, b) => {
                const priceA = getPrice(a) ?? Infinity;
                const priceB = getPrice(b) ?? Infinity;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered = filtered.sort((a, b) => {
                const priceA = getPrice(a) ?? 0;
                const priceB = getPrice(b) ?? 0;
                return priceB - priceA;
            });
        }

        return filtered;
    }, [allEvents, debouncedQuery, categoryFilter, dateFilter, sortBy]);

    const filteredCount = filteredAndSortedEvents.length;

    const handleEventPress = useCallback((id: string) => {
        navigation.navigate('EventDetail', { id });
    }, [navigation]);

    const renderItem = useCallback(({ item }: { item: Event }) => (
        <EventCard item={item} onPress={handleEventPress} />
    ), [handleEventPress]);

    const keyExtractor = useCallback((item: Event, index: number) => item._id || index.toString(), []);

    const getItemLayout = useCallback((data: ArrayLike<Event> | null | undefined, index: number) => ({
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
        { value: 'date-asc', label: 'Date: Nearest First' },
        { value: 'date-desc', label: 'Date: Latest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
    ];

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="bg-[#efe9f6] dark:bg-gray-900 px-4 pt-12 pb-6">
                <View className="absolute right-[-30px] top-[-20px] h-28 w-28 rounded-full bg-[#e3daf0] dark:bg-gray-800" />
                <View className="absolute left-[-20px] bottom-[-30px] h-24 w-24 rounded-full bg-[#e3daf0] dark:bg-gray-800" />
                <ScreenHeader
                    title="Events"
                    subtitle="Live shows and community meetups"
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
                        placeholder="Search events, venues, or categories"
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
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">Quick filters</Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">{filteredCount} events</Text>
                    </View>
                    <View className="flex-row flex-wrap mt-3">
                        <FilterChip
                            label="Upcoming"
                            selected={dateFilter === 'upcoming'}
                            onPress={() => setDateFilter(dateFilter === 'upcoming' ? null : 'upcoming')}
                            testID="filter-chip-upcoming"
                        />
                        <FilterChip
                            label="This Week"
                            selected={dateFilter === 'week'}
                            onPress={() => setDateFilter(dateFilter === 'week' ? null : 'week')}
                            testID="filter-chip-this-week"
                        />
                        <FilterChip
                            label="Past"
                            selected={dateFilter === 'past'}
                            onPress={() => setDateFilter(dateFilter === 'past' ? null : 'past')}
                            testID="filter-chip-past"
                        />
                    </View>
                    <View className="flex-row mt-3 flex-wrap">
                        {categoryOptions.map((category) =>
                            <FilterChip
                                key={category}
                                label={category}
                                selected={categoryFilter === category}
                                onPress={() => setCategoryFilter(categoryFilter === category ? null : category)}
                                testID={`filter-chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                        )}
                    </View>
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeletonList />
            ) : isError ? (
                <ErrorState message="Failed to load events." onRetry={refetch} />
            ) : (
                <FlatList
                    data={filteredAndSortedEvents}
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
                            title="No events match your filters"
                            description="Try a different category or date range."
                            actionLabel="Clear filters"
                            onAction={() => {
                                setCategoryFilter(null);
                                setDateFilter(null);
                                setQuery('');
                                setSortBy('default');
                            }}
                        />
                    }
                />
            )}
        </View>
    );
};
