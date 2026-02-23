import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CollectionListScreen } from './CollectionListScreen';
import { CollectionDetailScreen } from './CollectionDetailScreen';

export type CollectionStackParamList = {
    CollectionList: undefined;
    CollectionDetail: { slug: string };
};

const Stack = createNativeStackNavigator<CollectionStackParamList>();

export const CollectionNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CollectionList" component={CollectionListScreen} options={{ title: 'Collections' }} />
            <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Collection Detail' }} />
        </Stack.Navigator>
    );
};
