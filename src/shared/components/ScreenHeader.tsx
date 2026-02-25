import React from 'react';
import { View, Text } from 'react-native';

type ScreenHeaderProps = {
    title: string;
    subtitle?: string;
    rightSlot?: React.ReactNode;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, rightSlot }) => {
    return (
        <View className="px-5 pt-6 pb-3">
            <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-900">{title}</Text>
                {rightSlot}
            </View>
            {subtitle ? <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text> : null}
        </View>
    );
};
