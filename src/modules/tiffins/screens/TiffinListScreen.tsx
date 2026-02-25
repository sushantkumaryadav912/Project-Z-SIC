import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TiffinStackParamList } from '../../../core/navigation/types';
import { useTiffins } from '../hooks/useTiffins';
import { Tiffin } from '../types/tiffin';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { LoadingSkeletonList } from '../../../shared/components/LoadingSkeletonList';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';

type Props = NativeStackScreenProps<TiffinStackParamList, 'TiffinList'>;

export const TiffinListScreen: React.FC<Props> = ({ navigation }) => {
    const { data: tiffins = [], isLoading, isError, refetch } = useTiffins();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [vegOnly, setVegOnly] = useState(false);
    const [priceFilter, setPriceFilter] = useState<'budget' | 'mid' | 'premium' | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
        return () => clearTimeout(timer);
    }, [query]);

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

    const filteredTiffins = useMemo(() => {
        const lowerQuery = debouncedQuery.toLowerCase();
        return tiffins.filter((item) => {
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
    }, [tiffins, debouncedQuery, vegOnly, priceFilter]);

    const renderItem = ({ item }: { item: Tiffin }) => {
        const imageUrl = item.imageUrl;
        const priceValue = getPriceValue(item);

        return (
            <TouchableOpacity
                className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}
                onPress={() => navigation.navigate('TiffinDetail', { id: item._id || 'unknown' })}
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
                        {item.name || 'Unnamed Tiffin'}
                    </Text>
                    {item.shortDescription && (
                        <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                            {item.shortDescription}
                        </Text>
                    )}
                    <View className="flex-row items-center justify-between mt-3">
                        {priceValue !== null && (
                            <Text className="text-xs font-semibold text-[#02757A]">₹{priceValue} / meal</Text>
                        )}
                        {item.vegOnly && (
                            <View className="bg-emerald-50 px-2 py-1 rounded-full">
                                <Text className="text-[11px] font-semibold text-emerald-700">Veg Only</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderChip = (label: string, active: boolean, onPress: () => void) => (
        <TouchableOpacity
            key={label}
            className={`mr-2 rounded-full border px-3 py-2 ${active ? 'bg-[#02757A] border-[#02757A]' : 'bg-white border-gray-200'}`}
            onPress={onPress}
        >
            <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-[#f7f7f7]">
            <ScreenHeader title="Tiffin" subtitle="Home-style meal services" />
            <View className="px-5">
                <TextInput
                    className="bg-white px-4 py-3 rounded-2xl text-base text-gray-900"
                    placeholder="Search by meal plan or provider"
                    value={query}
                    onChangeText={setQuery}
                />
                <View className="flex-row mt-3">
                    {renderChip('Veg', vegOnly, () => setVegOnly((prev) => !prev))}
                    {renderChip('Budget', priceFilter === 'budget', () => setPriceFilter(priceFilter === 'budget' ? null : 'budget'))}
                    {renderChip('Mid', priceFilter === 'mid', () => setPriceFilter(priceFilter === 'mid' ? null : 'mid'))}
                    {renderChip('Premium', priceFilter === 'premium', () => setPriceFilter(priceFilter === 'premium' ? null : 'premium'))}
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeletonList />
            ) : isError ? (
                <ErrorState message="Failed to load tiffin services." onRetry={refetch} />
            ) : (
                <FlatList
                    data={filteredTiffins}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 }}
                    ListEmptyComponent={
                        <EmptyState
                            title="No tiffin services found"
                            description="Try adjusting your search or filters."
                            actionLabel="Clear search"
                            onAction={() => {
                                setQuery('');
                                setVegOnly(false);
                                setPriceFilter(null);
                            }}
                        />
                    }
                />
            )}
        </View>
    );
};
