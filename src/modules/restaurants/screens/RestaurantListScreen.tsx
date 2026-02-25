import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RestaurantsStackParamList } from '../../../core/navigation/types';
import { useRestaurants } from '../hooks/useRestaurants';
import { Restaurant } from '../types/restaurant';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { LoadingSkeletonList } from '../../../shared/components/LoadingSkeletonList';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<RestaurantsStackParamList, 'RestaurantList'>;

const PAGE_SIZE = 8;

export const RestaurantListScreen: React.FC<Props> = ({ navigation }) => {
    const { data: restaurants = [], isLoading, isError, refetch } = useRestaurants();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [vegOnly, setVegOnly] = useState(false);
    const [priceFilter, setPriceFilter] = useState<'budget' | 'mid' | 'premium' | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [debouncedQuery, selectedCuisine, vegOnly, priceFilter]);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const getCuisineTags = (item: Restaurant) => {
        if (Array.isArray(item.cuisineTags)) return item.cuisineTags;
        if (Array.isArray(item.cuisines)) return item.cuisines;
        if (typeof item.cuisines === 'string') {
            return item.cuisines.split(',').map((c) => c.trim()).filter(Boolean);
        }
        return [];
    };

    const getPriceValue = (item: Restaurant) => {
        if (typeof item.priceRange === 'number') return item.priceRange;
        if (typeof item.priceRange === 'string') {
            const match = item.priceRange.match(/\d+/g);
            if (match && match.length > 0) return Number(match[0]);
        }
        return null;
    };

    const isVegRestaurant = (item: Restaurant) => {
        if (item.vegOnly || item.isVeg) return true;
        const tags = getCuisineTags(item).map((tag) => tag.toLowerCase());
        return tags.includes('veg') || tags.includes('vegetarian') || tags.includes('pure veg');
    };

    const cuisineOptions = useMemo(() => {
        const set = new Set<string>();
        restaurants.forEach((item) => {
            getCuisineTags(item).forEach((tag) => set.add(tag));
        });
        return Array.from(set).slice(0, 10);
    }, [restaurants]);

    const filteredRestaurants = useMemo(() => {
        const lowerQuery = debouncedQuery.toLowerCase();
        return restaurants.filter((item) => {
            const cuisines = getCuisineTags(item);
            const searchable = [item.name, item.description, ...cuisines].filter(Boolean).join(' ').toLowerCase();
            if (lowerQuery && !searchable.includes(lowerQuery)) return false;
            if (selectedCuisine && !cuisines.includes(selectedCuisine)) return false;
            if (vegOnly && !isVegRestaurant(item)) return false;

            const priceValue = getPriceValue(item);
            if (priceFilter && priceValue !== null) {
                if (priceFilter === 'budget' && priceValue > 200) return false;
                if (priceFilter === 'mid' && (priceValue <= 200 || priceValue > 400)) return false;
                if (priceFilter === 'premium' && priceValue <= 400) return false;
            }
            return true;
        });
    }, [restaurants, debouncedQuery, selectedCuisine, vegOnly, priceFilter]);

    const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);
    const hasMore = visibleCount < filteredRestaurants.length;

    const renderChip = (label: string, active: boolean, onPress: () => void) => (
        <TouchableOpacity
            key={label}
            className={`mr-2 rounded-full border px-3 py-2 ${active ? 'bg-[#02757A] border-[#02757A]' : 'bg-white border-gray-200'}`}
            onPress={onPress}
        >
            <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: Restaurant }) => {
        const cuisines = getCuisineTags(item);
        const priceValue = getPriceValue(item);
        const imageUrl = item.imageUrl || item.images?.[0];

        return (
            <TouchableOpacity
                className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}
                onPress={() => navigation.navigate('RestaurantDetail', { id: item._id || 'unknown' })}
            >
                <View className="h-40 bg-gray-100">
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} className="h-40 w-full" />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-xs text-gray-500">No image</Text>
                        </View>
                    )}
                </View>
                <View className="p-4">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {item.name || 'Unnamed Restaurant'}
                    </Text>
                    {cuisines.length > 0 && (
                        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                            {cuisines.join(' • ')}
                        </Text>
                    )}
                    {priceValue !== null && (
                        <Text className="text-xs font-semibold text-[#02757A] mt-2">From ₹{priceValue}</Text>
                    )}
                    {isVegRestaurant(item) && (
                        <View className="mt-2 bg-emerald-50 px-2 py-1 rounded-full self-start">
                            <Text className="text-[11px] font-semibold text-emerald-700">Pure Veg</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-[#f7f7f7]">
            <ScreenHeader title="Restaurants" subtitle="Takeaway and dining picks" />
            <View className="px-5">
                <TextInput
                    className="bg-white px-4 py-3 rounded-2xl text-base text-gray-900"
                    placeholder="Search by name, cuisine, or dish"
                    value={query}
                    onChangeText={setQuery}
                />
                <View className="flex-row mt-3">
                    {renderChip('Veg', vegOnly, () => setVegOnly((prev) => !prev))}
                    {renderChip('Budget', priceFilter === 'budget', () => setPriceFilter(priceFilter === 'budget' ? null : 'budget'))}
                    {renderChip('Mid', priceFilter === 'mid', () => setPriceFilter(priceFilter === 'mid' ? null : 'mid'))}
                    {renderChip('Premium', priceFilter === 'premium', () => setPriceFilter(priceFilter === 'premium' ? null : 'premium'))}
                </View>
                <View className="flex-row mt-3 flex-wrap">
                    {cuisineOptions.map((cuisine) =>
                        renderChip(cuisine, selectedCuisine === cuisine, () =>
                            setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)
                        )
                    )}
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeletonList />
            ) : isError ? (
                <ErrorState message="Failed to load restaurants." onRetry={refetch} />
            ) : (
                <FlatList
                    data={visibleRestaurants}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 }}
                    onEndReached={() => {
                        if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE);
                    }}
                    onEndReachedThreshold={0.4}
                    ListEmptyComponent={
                        <EmptyState
                            title="No restaurants found"
                            description="Try adjusting your filters or search terms."
                            actionLabel="Reset filters"
                            onAction={() => {
                                setSelectedCuisine(null);
                                setVegOnly(false);
                                setPriceFilter(null);
                                setQuery('');
                            }}
                        />
                    }
                />
            )}
        </View>
    );
};
