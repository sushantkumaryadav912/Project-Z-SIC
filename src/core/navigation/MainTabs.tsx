import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TiffinNavigator } from '../../modules/tiffins/screens/TiffinNavigator';
import { CollectionNavigator } from '../../modules/collections/screens/CollectionNavigator';

export type MainTabsParamList = {
    TiffinsTab: undefined;
    CollectionsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="TiffinsTab" component={TiffinNavigator} options={{ title: 'Tiffins' }} />
            <Tab.Screen name="CollectionsTab" component={CollectionNavigator} options={{ title: 'Collections' }} />
        </Tab.Navigator>
    );
};
