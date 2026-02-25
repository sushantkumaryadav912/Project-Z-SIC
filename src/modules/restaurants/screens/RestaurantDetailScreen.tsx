import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RestaurantsStackParamList } from '../../../core/navigation/types';
import { useRestaurantDetail } from '../hooks/useRestaurants';
import { RestaurantDetail, RestaurantMenuItem, RestaurantMenuSection } from '../types/restaurant';
import { ImageCarousel } from '../../../shared/components/ImageCarousel';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingSkeletonList } from '../../../shared/components/LoadingSkeletonList';
import { openInMaps } from '../../../shared/utils/maps';

type Props = NativeStackScreenProps<RestaurantsStackParamList, 'RestaurantDetail'>;

export const RestaurantDetailScreen: React.FC<Props> = ({ route }) => {
    const { id } = route.params;
    const { data: restaurant, isLoading, isError, refetch } = useRestaurantDetail(id);

    const normalizedRestaurant = restaurant as RestaurantDetail | undefined;

    const images = useMemo(() => {
        if (!normalizedRestaurant) return [];
        return [
            ...(normalizedRestaurant.images || []),
            normalizedRestaurant.imageUrl,
        ].filter(Boolean) as string[];
    }, [normalizedRestaurant]);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const menuSections = useMemo<RestaurantMenuSection[]>(() => {
        if (!normalizedRestaurant) return [];
        const sections: RestaurantMenuSection[] = [];

        if (Array.isArray(normalizedRestaurant.menuSections)) {
            normalizedRestaurant.menuSections.forEach((section, index) => {
                const items = Array.isArray(section.items) ? section.items : [];
                const formattedItems: RestaurantMenuItem[] = items.map((item) => {
                    if (typeof item === 'string') {
                        return { name: item };
                    }
                    return {
                        name: item.name || 'Menu item',
                        description: item.description,
                        price: item.price,
                    };
                });

                sections.push({
                    title: section.title || section.name || `Section ${index + 1}`,
                    items: formattedItems,
                });
            });
        } else if (Array.isArray(normalizedRestaurant.menu)) {
            const formattedItems: RestaurantMenuItem[] = normalizedRestaurant.menu.map((item) => {
                if (typeof item === 'string') {
                    return { name: item };
                }
                return {
                    name: item.name || 'Menu item',
                    description: item.description,
                    price: item.price,
                };
            });
            sections.push({ title: 'Menu', items: formattedItems });
        }

        return sections;
    }, [normalizedRestaurant]);

    const services = useMemo(() => {
        if (!normalizedRestaurant) return [];
        return [
            ...(normalizedRestaurant.serviceTypes || []),
            ...(normalizedRestaurant.badges || []),
        ].filter(Boolean);
    }, [normalizedRestaurant]);

    const hours = useMemo(() => {
        if (!normalizedRestaurant) return [];
        const hoursData = normalizedRestaurant.openingHours || normalizedRestaurant.hours;
        if (Array.isArray(hoursData)) return hoursData;
        if (typeof hoursData === 'string') return [hoursData];
        return [];
    }, [normalizedRestaurant]);

    const cuisineTags = useMemo(() => {
        if (!normalizedRestaurant) return [];
        if (Array.isArray(normalizedRestaurant.cuisineTags)) return normalizedRestaurant.cuisineTags;
        if (Array.isArray(normalizedRestaurant.cuisines)) return normalizedRestaurant.cuisines;
        if (typeof normalizedRestaurant.cuisines === 'string') {
            return normalizedRestaurant.cuisines.split(',').map((tag) => tag.trim()).filter(Boolean);
        }
        return [];
    }, [normalizedRestaurant]);

    if (isLoading) {
        return <LoadingSkeletonList count={2} />;
    }

    if (isError || !normalizedRestaurant) {
        return <ErrorState message="Failed to load restaurant details." onRetry={refetch} />;
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="px-5 py-6">
                {images.length > 0 && <ImageCarousel images={images} />}

                <Text className="text-2xl font-bold text-gray-900 mt-6">{normalizedRestaurant.name || 'Unnamed Restaurant'}</Text>
                {cuisineTags.length > 0 && (
                    <Text className="text-sm text-gray-600 mt-2">{cuisineTags.join(' • ')}</Text>
                )}
                {normalizedRestaurant.priceRange && (
                    <Text className="text-sm font-semibold text-[#02757A] mt-2">{normalizedRestaurant.priceRange}</Text>
                )}

                {normalizedRestaurant.description && (
                    <Text className="text-base text-gray-700 mt-4 leading-6">{normalizedRestaurant.description}</Text>
                )}

                <View className="mt-6">
                    <Text className="text-base font-semibold text-gray-900 mb-2">Services</Text>
                    <View className="flex-row flex-wrap">
                        {services.map((service) => (
                            <View key={service} className="bg-cyan-50 px-3 py-1.5 rounded-full mr-2 mb-2">
                                <Text className="text-xs font-semibold text-cyan-700">{service}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {hours.length > 0 && (
                    <View className="mt-6">
                        <Text className="text-base font-semibold text-gray-900 mb-2">Hours</Text>
                        {hours.map((line) => (
                            <Text key={line} className="text-sm text-gray-600 mb-1">{line}</Text>
                        ))}
                    </View>
                )}

                {(normalizedRestaurant.address || normalizedRestaurant.location?.address) && (
                    <View className="mt-6">
                        <Text className="text-base font-semibold text-gray-900 mb-2">Location</Text>
                        <Text className="text-sm text-gray-600">{normalizedRestaurant.address || normalizedRestaurant.location?.address}</Text>
                    </View>
                )}

                {menuSections.length > 0 && (
                    <View className="mt-6">
                        <Text className="text-base font-semibold text-gray-900 mb-3">Menu</Text>
                        {menuSections.map((section) => (
                            <View key={section.title} className="mb-4">
                                <Text className="text-sm font-semibold text-gray-900 mb-2">{section.title}</Text>
                                {section.items.map((item, index) => (
                                    <View key={`${section.title}-${index}`} className="border-b border-gray-100 pb-2 mb-2">
                                        <Text className="text-sm font-medium text-gray-900">{item.name}</Text>
                                        {item.description && (
                                            <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
                                        )}
                                        {item.price !== undefined && item.price !== null && (
                                            <Text className="text-xs font-semibold text-gray-900 mt-1">₹{item.price}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {normalizedRestaurant.location?.lat && normalizedRestaurant.location?.lng && (
                    <TouchableOpacity
                        className="mt-6 bg-[#02757A] px-4 py-3 rounded-2xl items-center"
                        onPress={() => openInMaps(normalizedRestaurant.location!.lat!, normalizedRestaurant.location!.lng!)}
                    >
                        <Text className="text-white font-semibold text-base">Navigate in Google Maps</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};
