import type { NavigatorScreenParams } from '@react-navigation/native';

export type RestaurantsStackParamList = {
    RestaurantList: undefined;
    RestaurantDetail: { id: string };
};

export type TiffinStackParamList = {
    TiffinList: undefined;
    TiffinDetail: { id: string };
};

export type EventsStackParamList = {
    EventList: undefined;
    EventDetail: { id: string };
};

export type SettingsStackParamList = {
    Settings: undefined;
};

export type MainTabsParamList = {
    RestaurantsStack: NavigatorScreenParams<RestaurantsStackParamList>;
    TiffinStack: NavigatorScreenParams<TiffinStackParamList>;
    EventsStack: NavigatorScreenParams<EventsStackParamList>;
    SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
    Splash: undefined;
    AuthLanding: undefined;
    Login: undefined;
    MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
};
