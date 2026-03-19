import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Tiffin } from '@/domains/tiffins/types';

interface TiffinCardProps {
    item: Tiffin;
    onPress: (id: string) => void;
}

export const TiffinCard = memo<TiffinCardProps>(({ item, onPress }) => {
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
            activeOpacity={0.92}
            style={{
                backgroundColor: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                marginBottom: 18,
                shadowColor: '#b45309',
                shadowOpacity: 0.10,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
            }}
            onPress={() => onPress(item._id || 'unknown')}
        >
            {/* Image Section */}
            <View style={{ height: 180, backgroundColor: '#fef3e2' }}>
                {imageUrl ? (
                    <ImageBackground source={{ uri: imageUrl }} style={{ flex: 1 }} resizeMode="cover">
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'rgba(0,0,0,0.32)' }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
                            {item.vegOnly && (
                                <View style={{ backgroundColor: '#16a34a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>🌿 VEG ONLY</Text>
                                </View>
                            )}
                            {priceValue !== null && (
                                <View style={{ marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ color: '#b45309', fontSize: 11, fontWeight: '700' }}>₹{priceValue} / meal</Text>
                                </View>
                            )}
                        </View>
                    </ImageBackground>
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40 }}>🍱</Text>
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>No image available</Text>
                    </View>
                )}
            </View>

            {/* Info Section */}
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827' }} numberOfLines={1}>
                    {item.name || 'Unnamed Tiffin'}
                </Text>
                {item.shortDescription && (
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8, lineHeight: 18 }} numberOfLines={2}>
                        {item.shortDescription}
                    </Text>
                )}
                <View style={{ height: 1, backgroundColor: '#f3f4f6', marginTop: 12, marginBottom: 10 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: '#9ca3af', fontWeight: '500' }}>Tap to explore plans</Text>
                    <View style={{ backgroundColor: '#b45309', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>View →</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.item._id === nextProps.item._id;
});

TiffinCard.displayName = 'TiffinCard';
