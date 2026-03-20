import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/navigation/types';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setFeatureFlags } from '@/store/slices/uiSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setFeatureFlags({ enableOrdering: false, enableBooking: false }));

        const timer = setTimeout(() => {
            navigation.replace('AuthLanding');
        }, 1500);

        return () => clearTimeout(timer);
    }, [dispatch, navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
            <Text className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Welcome to SIC</Text>
            <Text className="text-base text-gray-600 dark:text-slate-300">Discovery Phase</Text>
        </View>
    );
};
