import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import { useTheme } from '@/ui/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type ScreenHeaderProps = {
    title: string;
    subtitle?: string;
    rightSlot?: React.ReactNode;
    showSearch?: boolean;
    onBack?: () => void;
    backIcon?: keyof typeof Ionicons.glyphMap;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
    title, 
    subtitle, 
    rightSlot, 
    showSearch = true,
    onBack,
    backIcon = 'chevron-back'
}) => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();

    return (
        <View style={{ paddingTop: 8, paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {onBack && (
                    <TouchableOpacity 
                        onPress={onBack}
                        style={{ marginRight: 12, padding: 4 }}
                    >
                        <Ionicons name={backIcon} size={28} color={theme.text} />
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: theme.text, letterSpacing: -0.5 }}>{title}</Text>
                    {subtitle ? (
                        <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 3, fontWeight: '500', letterSpacing: 0.1 }}>{subtitle}</Text>
                    ) : null}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                    {showSearch && (
                        <TouchableOpacity
                            data-testid="search-icon-button"
                            onPress={() => navigation.navigate('Search')}
                            style={{ backgroundColor: theme.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.sectionLabel }}>🔍 Search</Text>
                        </TouchableOpacity>
                    )}
                    {rightSlot}
                </View>
            </View>
        </View>
    );
};