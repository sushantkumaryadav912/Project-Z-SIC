import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Tiffin } from '@/domains/tiffins/types';
import { useAppSelector } from '@/hooks/useAppStore';

interface TiffinCardProps {
    item: Tiffin;
    onPress: (id: string) => void;
}

export const TiffinCard = memo<TiffinCardProps>(({ item, onPress }) => {
    const theme = useAppSelector((state) => state.ui.theme);
    const isDark = theme === 'dark';

    const getPriceValue = (item: Tiffin) => {
        if (typeof item.pricePerMeal === 'number') return item.pricePerMeal;
        if (typeof item.priceRange === 'number') return item.priceRange;
        if (typeof item.priceRange === 'string') {
            const match = item.priceRange.match(/\d+/g);
            if (match && match.length > 0) return Number(match[0]);
        }
        return null;
    };

    const imageUrl = item.imageUrl;
    const priceValue = getPriceValue(item);

    return (
        <TouchableOpacity
            data-testid={`tiffin-card-${item._id}`}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden mb-4 shadow-sm"
            style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }]}
            onPress={() => onPress(item._id || 'unknown')}
        >
            <View className="h-40 bg-gray-100 dark:bg-gray-800">
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} className="h-40 w-full" />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-xs text-gray-500 dark:text-gray-400">No image</Text>
                    </View>
                )}
            </View>
            <View className="p-4">
                <Text className="text-base font-bold text-gray-900 dark:text-gray-50" numberOfLines={1}>
                    {item.name || 'Unnamed Tiffin'}
                </Text>
                {item.shortDescription && (
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1" numberOfLines={2}>
                        {item.shortDescription}
                    </Text>
                )}
                <View className="flex-row items-center justify-between mt-3">
                    {priceValue !== null && (
                        <Text className="text-xs font-semibold text-[#02757A]">₹{priceValue} / meal</Text>
                    )}
                    {item.vegOnly && (
                        <View className="bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-full">
                            <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Veg Only</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.item._id === nextProps.item._id;
});

TiffinCard.displayName = 'TiffinCard';
