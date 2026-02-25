import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../../modules/splash/SplashScreen';
import { AuthLandingScreen } from '../../modules/auth/screens/AuthLandingScreen';
import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { TabsNavigator } from './TabsNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs" component={TabsNavigator} />
        </Stack.Navigator>
    );
};
