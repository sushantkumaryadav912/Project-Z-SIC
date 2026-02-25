import React from 'react';
import { View } from 'react-native';

type LoadingSkeletonListProps = {
    count?: number;
};

export const LoadingSkeletonList: React.FC<LoadingSkeletonListProps> = ({ count = 3 }) => {
    return (
        <View className="px-5 pt-2">
            {Array.from({ length: count }).map((_, index) => (
                <View
                    key={`skeleton-${index}`}
                    className="bg-gray-200 rounded-3xl h-48 mb-4"
                    style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 }}
                />
            ))}
        </View>
    );
};
