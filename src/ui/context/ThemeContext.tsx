import React, { createContext, useContext } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';

export const lightTheme = {
    dark: false,
    bg: '#f2f6f6',
    card: '#ffffff',
    text: '#111827',
    subtext: '#6b7280',
    border: '#f3f4f6',
    inputBg: '#ffffff',
    inputText: '#111827',
    inputPlaceholder: '#9ca3af',
    chipBg: '#f0fafa',
    chipBorder: '#cceaea',
    chipText: '#02757A',
    sectionLabel: '#374151',
    headerBgRestaurant: '#e6f4f4',
    headerBgTiffin: '#f5efe8',
    headerBgEvents: '#efe9f6',
    headerBgSettings: '#f0f4ff',
    headerCircleRestaurant: '#d6efef',
    headerCircleTiffin: '#efe6db',
    headerCircleEvents: '#e3daf0',
    headerCircleSettings: '#e1e9ff',
};

export const darkTheme = {
    dark: true,
    bg: '#111318',
    card: '#1e2128',
    text: '#f1f5f9',
    subtext: '#94a3b8',
    border: '#2a2d36',
    inputBg: '#2a2d36',
    inputText: '#f1f5f9',
    inputPlaceholder: '#64748b',
    chipBg: '#1a2e2e',
    chipBorder: '#0e5a5e',
    chipText: '#5ecdd4',
    sectionLabel: '#cbd5e1',
    headerBgRestaurant: '#0e1f1f',
    headerBgTiffin: '#1c1208',
    headerBgEvents: '#130d22',
    headerBgSettings: '#0d1020',
    headerCircleRestaurant: '#122828',
    headerCircleTiffin: '#221808',
    headerCircleEvents: '#1a1030',
    headerCircleSettings: '#10142a',
};

export type Theme = typeof lightTheme;

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const themeMode = useAppSelector((state) => state.ui.theme);
    const theme = themeMode === 'dark' ? darkTheme : lightTheme;
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
