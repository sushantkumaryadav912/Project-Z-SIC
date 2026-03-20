import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { linking } from '@/app/navigation/linking';
import { queryClient } from '@/platform/api/queryClient';
import { store } from '@/store/store';
import { OfflineBanner } from '@/ui/components/OfflineBanner';
import { ThemeProvider } from '@/ui/context/ThemeContext';
import './global.css';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <OfflineBanner />
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
}
