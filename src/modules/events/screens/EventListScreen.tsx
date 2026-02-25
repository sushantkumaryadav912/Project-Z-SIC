import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../../core/navigation/types';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types/event';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { LoadingSkeletonList } from '../../../shared/components/LoadingSkeletonList';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventList'>;

export const EventListScreen: React.FC<Props> = ({ navigation }) => {
    const { data: events = [], isLoading, isError, refetch } = useEvents();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<'upcoming' | 'week' | 'past' | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
        return () => clearTimeout(timer);
    }, [query]);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const categoryOptions = useMemo(() => {
        const set = new Set<string>();
        events.forEach((item) => {
            if (item.category) set.add(item.category);
        });
        return Array.from(set).slice(0, 8);
    }, [events]);

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

    const formatVenue = (venue?: Event['venue']) => {
        if (!venue) return '';
        if (typeof venue === 'string') return venue;
        if (typeof venue === 'object') {
            const value = venue as { name?: string; address?: string; city?: string; state?: string; country?: string };
            return [value.name, value.address, value.city, value.state, value.country]
                .filter(Boolean)
                .join(', ');
        }
        return String(venue);
    };

    const filteredEvents = useMemo(() => {
        const lowerQuery = debouncedQuery.toLowerCase();
        return events.filter((item) => {
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
    }, [events, debouncedQuery, categoryFilter, dateFilter]);

    const renderChip = (label: string, active: boolean, onPress: () => void) => (
        <TouchableOpacity
            key={label}
            className={`mr-2 rounded-full border px-3 py-2 ${active ? 'bg-[#02757A] border-[#02757A]' : 'bg-white border-gray-200'}`}
            onPress={onPress}
        >
            <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: Event }) => {
        const imageUrl = item.imageUrl || item.images?.[0];
        const ended = isPastEvent(item.date);

        return (
            <TouchableOpacity
                className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}
                onPress={() => navigation.navigate('EventDetail', { id: item._id || 'unknown' })}
            >
                <View className="h-40 bg-gray-100">
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} className="h-40 w-full" />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-xs text-gray-500">No image</Text>
                        </View>
                    )}
                    {ended && (
                        <View className="absolute top-3 right-3 bg-red-600 px-2 py-1 rounded-full">
                            <Text className="text-xs font-semibold text-white">Event Ended</Text>
                        </View>
                    )}
                </View>
                <View className="p-4">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {item.name || item.title || 'Unnamed Event'}
                    </Text>
                    {item.date && (
                        <Text className="text-sm text-gray-600 mt-1">{new Date(item.date).toLocaleDateString()}</Text>
                    )}
                    {item.venue && (
                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>Venue: {formatVenue(item.venue)}</Text>
                    )}
                    {item.category && (
                        <Text className="text-xs font-semibold text-[#02757A] mt-2">{item.category}</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-[#f7f7f7]">
            <ScreenHeader title="Events" subtitle="Live shows and community meetups" />
            <View className="px-5">
                <TextInput
                    className="bg-white px-4 py-3 rounded-2xl text-base text-gray-900"
                    placeholder="Search events, venues, or categories"
                    value={query}
                    onChangeText={setQuery}
                />
                <View className="flex-row mt-3">
                    {renderChip('Upcoming', dateFilter === 'upcoming', () => setDateFilter(dateFilter === 'upcoming' ? null : 'upcoming'))}
                    {renderChip('This Week', dateFilter === 'week', () => setDateFilter(dateFilter === 'week' ? null : 'week'))}
                    {renderChip('Past', dateFilter === 'past', () => setDateFilter(dateFilter === 'past' ? null : 'past'))}
                </View>
                <View className="flex-row mt-3 flex-wrap">
                    {categoryOptions.map((category) =>
                        renderChip(category, categoryFilter === category, () =>
                            setCategoryFilter(categoryFilter === category ? null : category)
                        )
                    )}
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeletonList />
            ) : isError ? (
                <ErrorState message="Failed to load events." onRetry={refetch} />
            ) : (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 }}
                    ListEmptyComponent={
                        <EmptyState
                            title="No events match your filters"
                            description="Try a different category or date range."
                            actionLabel="Clear filters"
                            onAction={() => {
                                setCategoryFilter(null);
                                setDateFilter(null);
                                setQuery('');
                            }}
                        />
                    }
                />
            )}
        </View>
    );
};
