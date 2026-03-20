import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/hooks/useAppStore';

type ScreenHeaderProps = {
    title: string;
    subtitle?: string;
    rightSlot?: React.ReactNode;
    showSearch?: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
    title, 
    subtitle, 
    rightSlot, 
    showSearch = true 
}) => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useAppSelector((state) => state.ui.theme);
    const isDark = theme === 'dark';

    return (
        <View>
            <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-50">{title}</Text>
                <View className="flex-row items-center">
                    {showSearch && (
                        <TouchableOpacity
                            data-testid="search-icon-button"
                            onPress={() => navigation.navigate('Search')}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-2 mr-2"
                            style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}
                        >
                            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-200">Search</Text>
                        </TouchableOpacity>
                    )}
                    {rightSlot}
                </View>
            </View>
            {subtitle ? <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</Text> : null}
        </View>
    );
};