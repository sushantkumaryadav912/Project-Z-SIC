import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { EventDetailScreen } from '@/domains/events/screens/EventDetailScreen';
import { EventListScreen } from '@/domains/events/screens/EventListScreen';
import { RestaurantDetailScreen } from '@/domains/restaurants/screens/RestaurantDetailScreen';
import { RestaurantListScreen } from '@/domains/restaurants/screens/RestaurantListScreen';
import { SettingsScreen } from '@/domains/settings/screens/SettingsScreen';
import { TiffinDetailScreen } from '@/domains/tiffins/screens/TiffinDetailScreen';
import { TiffinListScreen } from '@/domains/tiffins/screens/TiffinListScreen';
import { useTheme } from '@/ui/theme';
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
    const { isDark, colors } = useTheme();

    // Keep tab highlight consistent with in-screen primary actions (e.g. selected filter chip)
    const activeColor = colors.primary;
    const inactiveColor = isDark ? '#AAA' : '#888';
    const tabBackground = isDark ? '#121212' : '#FFFFFF';
    const tabBorder = isDark ? '#222' : '#E5E5E5';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                return {
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => {
                        const iconName = (() => {
                            switch (route.name) {
                                case 'RestaurantsStack':
                                    return focused ? 'restaurant' : 'restaurant-outline';
                                case 'TiffinStack':
                                    return focused ? 'fast-food' : 'fast-food-outline';
                                case 'EventsStack':
                                    return focused ? 'calendar' : 'calendar-outline';
                                case 'SettingsStack':
                                    return focused ? 'settings' : 'settings-outline';
                                default:
                                    return focused ? 'help-circle' : 'help-circle-outline';
                            }
                        })();

                        return <Ionicons name={iconName} size={24} color={color} />;
                    },
                    tabBarStyle: {
                        backgroundColor: tabBackground,
                        borderTopColor: tabBorder,
                        height: 70,
                        paddingTop: 8,
                        paddingBottom: 10,
                    },
                    tabBarLabelStyle: {
                        marginTop: 2,
                    },
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                };
            }}
        >
            <Tab.Screen name="RestaurantsStack" component={RestaurantsStackNavigator} options={{ title: 'Restaurants' }} />
            <Tab.Screen name="TiffinStack" component={TiffinStackNavigator} options={{ title: 'Tiffin' }} />
            <Tab.Screen name="EventsStack" component={EventsStackNavigator} options={{ title: 'Events' }} />
            <Tab.Screen name="SettingsStack" component={SettingsStackNavigator} options={{ title: 'Settings' }} />
        </Tab.Navigator>
    );
};
