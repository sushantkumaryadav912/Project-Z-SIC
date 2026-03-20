import React, { useMemo } from 'react';
import { View, Text, Switch } from 'react-native';
import appConfig from '../../../../app.json';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setTheme } from '@/store/slices/uiSlice';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { useTheme } from '@/ui/theme';

export const SettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data: featureFlags } = useFeatureFlags();
    const { mode, isDark, colors } = useTheme();

    const appVersion = appConfig?.expo?.version || '1.0.0';
    const flagEntries = useMemo(() => Object.entries(featureFlags || {}), [featureFlags]);

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="bg-[#f0f4ff] dark:bg-gray-900 px-4 pt-12 pb-6">
                <View className="absolute right-[-30px] top-[-20px] h-28 w-28 rounded-full bg-[#e1e9ff] dark:bg-gray-800" />
                <View className="absolute left-[-20px] bottom-[-30px] h-24 w-24 rounded-full bg-[#e1e9ff] dark:bg-gray-800" />
                <ScreenHeader title="Settings" subtitle="Manage your preferences" />
            </View>

            <View className="px-4 -mt-4">
                <View
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 mb-4 shadow-sm"
                    style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }]}
                >
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-50">Appearance</Text>
                    <View className="flex-row items-center justify-between mt-3">
                        <Text className="text-sm text-gray-600 dark:text-gray-300">Theme</Text>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mr-2">{mode === 'dark' ? 'Dark' : 'Light'}</Text>
                            <Switch
                                value={mode === 'dark'}
                                onValueChange={(value) => {
                                    dispatch(setTheme(value ? 'dark' : 'light'));
                                }}
                            />
                        </View>
                    </View>
                </View>

                <View
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 mb-4 shadow-sm"
                    style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }]}
                >
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-50">Feature flags</Text>
                    {flagEntries.length > 0 ? (
                        <View className="mt-3">
                            {flagEntries.map(([key, value]) => (
                                <View key={key} className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                    <Text className="text-sm text-gray-700 dark:text-gray-200">{key}</Text>
                                    <Text className={`text-xs font-semibold ${value ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {value ? 'Enabled' : 'Disabled'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3">No flags available.</Text>
                    )}
                </View>

                <View
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 mb-4 shadow-sm"
                    style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }]}
                >
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-50">App</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">Version: {appVersion}</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">Strategic Information Center</Text>
                </View>

                <View
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 mb-6 shadow-sm"
                    style={[isDark ? null : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }]}
                >
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-50">About</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        SIC helps you discover trusted restaurants, tiffin services, and local events.
                    </Text>
                </View>
            </View>
        </View>
    );
};
