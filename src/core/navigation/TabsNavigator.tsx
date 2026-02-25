import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RestaurantListScreen } from '../../modules/restaurants/screens/RestaurantListScreen';
import { RestaurantDetailScreen } from '../../modules/restaurants/screens/RestaurantDetailScreen';
import { TiffinListScreen } from '../../modules/tiffins/screens/TiffinListScreen';
import { TiffinDetailScreen } from '../../modules/tiffins/screens/TiffinDetailScreen';
import { EventListScreen } from '../../modules/events/screens/EventListScreen';
import { EventDetailScreen } from '../../modules/events/screens/EventDetailScreen';
import { SettingsScreen } from '../../modules/settings/screens/SettingsScreen';
import type {
    EventsStackParamList,
    MainTabsParamList,
    RestaurantsStackParamList,
    SettingsStackParamList,
    TiffinStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const RestaurantsStack = createNativeStackNavigator<RestaurantsStackParamList>();
const TiffinStack = createNativeStackNavigator<TiffinStackParamList>();
const EventsStack = createNativeStackNavigator<EventsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const RestaurantsStackNavigator = () => (
    <RestaurantsStack.Navigator screenOptions={{ headerShown: false }}>
        <RestaurantsStack.Screen name="RestaurantList" component={RestaurantListScreen} />
        <RestaurantsStack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    </RestaurantsStack.Navigator>
);

const TiffinStackNavigator = () => (
    <TiffinStack.Navigator screenOptions={{ headerShown: false }}>
        <TiffinStack.Screen name="TiffinList" component={TiffinListScreen} />
        <TiffinStack.Screen name="TiffinDetail" component={TiffinDetailScreen} />
    </TiffinStack.Navigator>
);

const EventsStackNavigator = () => (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
        <EventsStack.Screen name="EventList" component={EventListScreen} />
        <EventsStack.Screen name="EventDetail" component={EventDetailScreen} />
    </EventsStack.Navigator>
);

const SettingsStackNavigator = () => (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
);

export const TabsNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="RestaurantsStack" component={RestaurantsStackNavigator} options={{ title: 'Restaurants' }} />
            <Tab.Screen name="TiffinStack" component={TiffinStackNavigator} options={{ title: 'Tiffin' }} />
            <Tab.Screen name="EventsStack" component={EventsStackNavigator} options={{ title: 'Events' }} />
            <Tab.Screen name="SettingsStack" component={SettingsStackNavigator} options={{ title: 'Settings' }} />
        </Tab.Navigator>
    );
};
