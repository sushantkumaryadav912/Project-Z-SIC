import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TiffinListScreen } from './TiffinListScreen';
import { TiffinDetailScreen } from './TiffinDetailScreen';

export type TiffinStackParamList = {
    TiffinList: undefined;
    TiffinDetail: { tiffinId: string };
};

const Stack = createNativeStackNavigator<TiffinStackParamList>();

export const TiffinNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TiffinList" component={TiffinListScreen} options={{ title: 'Tiffins' }} />
            <Stack.Screen name="TiffinDetail" component={TiffinDetailScreen} options={{ title: 'Tiffin Detail' }} />
        </Stack.Navigator>
    );
};
