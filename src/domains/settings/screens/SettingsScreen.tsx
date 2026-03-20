import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import appConfig from '../../../../app.json';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { ScreenHeader } from '@/ui/components/ScreenHeader';
import { useTheme } from '@/ui/context/ThemeContext';

export const SettingsScreen: React.FC = () => {
    const theme = useTheme();
    const { data: featureFlags } = useFeatureFlags();
    const { mode, isDark, colors } = useTheme();

    const appVersion = appConfig?.expo?.version || '1.0.0';
    const flagEntries = useMemo(() => Object.entries(featureFlags || {}), [featureFlags]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <View style={{ backgroundColor: theme.headerBgSettings, paddingHorizontal: 20, paddingTop: 48, paddingBottom: 24, overflow: 'visible' }}>
                <View style={{ position: 'absolute', right: 0, top: 0, height: 112, width: 112, borderRadius: 56, backgroundColor: theme.headerCircleSettings }} />
                <View style={{ position: 'absolute', left: 0, bottom: 0, height: 96, width: 96, borderRadius: 48, backgroundColor: theme.headerCircleSettings }} />
                <ScreenHeader title="Settings" subtitle="Manage your preferences" showSearch={false} />
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: -16, zIndex: 1 }}>
                <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 20, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>Feature flags</Text>
                    {flagEntries.length > 0 ? (
                        <View style={{ marginTop: 12 }}>
                            {flagEntries.map(([key, value]) => (
                                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                                    <Text style={{ fontSize: 13, color: theme.text }}>{key}</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: value ? '#16a34a' : theme.subtext }}>
                                        {value ? 'Enabled' : 'Disabled'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 12 }}>No flags available.</Text>
                    )}
                </View>

                <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 20, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>App</Text>
                    <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 8 }}>Version: {appVersion}</Text>
                    <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 4 }}>Strategic Information Center</Text>
                </View>

                <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>About</Text>
                    <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 8, lineHeight: 20 }}>
                        SIC helps you discover trusted restaurants, tiffin services, and local events.
                    </Text>
                </View>
            </View>
        </View>
    );
};
