import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/navigation/types';
import { apiClient } from '../../../core/api/axios';
import { ErrorState } from '../../../shared/components/ErrorState';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginForm = {
    email: string;
    password: string;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (key: keyof LoginForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await apiClient.post('/api/login', {
                email: form.email.trim().toLowerCase(),
                password: form.password,
                rememberMe: true,
            });

            if (response.data?.success || response.data?.message === 'Login successful!') {
                navigation.replace('MainTabs');
                return;
            }

            setErrorMessage(response.data?.message || 'Login failed.');
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-6">
                <Text className="text-2xl font-bold text-gray-900">Login</Text>
                <Text className="text-sm text-gray-600 mt-2">Access your saved favorites and preferences.</Text>

                <View className="mt-8">
                    <Text className="text-sm text-gray-700 mb-2">Email</Text>
                    <TextInput
                        className="border border-gray-200 rounded-2xl px-4 py-3 text-base"
                        placeholder="you@example.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(value) => handleChange('email', value)}
                    />

                    <Text className="text-sm text-gray-700 mt-5 mb-2">Password</Text>
                    <TextInput
                        className="border border-gray-200 rounded-2xl px-4 py-3 text-base"
                        placeholder="Password"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(value) => handleChange('password', value)}
                    />

                    <TouchableOpacity
                        className="bg-[#02757A] mt-6 px-5 py-4 rounded-2xl"
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-base font-semibold text-center">Login</Text>
                        )}
                    </TouchableOpacity>

                    {errorMessage ? <ErrorState message={errorMessage} /> : null}
                </View>
            </View>
        </SafeAreaView>
    );
};
