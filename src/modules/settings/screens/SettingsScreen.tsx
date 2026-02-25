import React, { useMemo } from 'react';
import { View, Text, Switch } from 'react-native';
import appConfig from '../../../../app.json';
import { useFeatureFlags } from '../../../core/hooks/useFeatureFlags';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useAppStore';
import { setTheme } from '../../../core/store/uiSlice';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';

export const SettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);
    const { data: featureFlags } = useFeatureFlags();

    const appVersion = appConfig?.expo?.version || '1.0.0';
    const flagEntries = useMemo(() => Object.entries(featureFlags || {}), [featureFlags]);

    return (
        <View className="flex-1 bg-[#f7f7f7]">
            <ScreenHeader title="Settings" subtitle="Manage your preferences" />

            <View className="px-5">
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-base font-semibold text-gray-900">Appearance</Text>
                    <View className="flex-row items-center justify-between mt-3">
                        <Text className="text-sm text-gray-600">Theme</Text>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">{theme === 'dark' ? 'Dark' : 'Light'}</Text>
                            <Switch
                                value={theme === 'dark'}
                                onValueChange={(value) => {
                                    dispatch(setTheme(value ? 'dark' : 'light'));
                                }}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-base font-semibold text-gray-900">Feature flags</Text>
                    {flagEntries.length > 0 ? (
                        <View className="mt-3">
                            {flagEntries.map(([key, value]) => (
                                <View key={key} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                                    <Text className="text-sm text-gray-700">{key}</Text>
                                    <Text className={`text-xs font-semibold ${value ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {value ? 'Enabled' : 'Disabled'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-sm text-gray-500 mt-3">No flags available.</Text>
                    )}
                </View>

                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-base font-semibold text-gray-900">App</Text>
                    <Text className="text-sm text-gray-600 mt-2">Version: {appVersion}</Text>
                    <Text className="text-sm text-gray-600 mt-1">Strategic Information Center</Text>
                </View>

                <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-base font-semibold text-gray-900">About</Text>
                    <Text className="text-sm text-gray-600 mt-2">
                        SIC helps you discover trusted restaurants, tiffin services, and local events.
                    </Text>
                </View>
            </View>
        </View>
    );
};
