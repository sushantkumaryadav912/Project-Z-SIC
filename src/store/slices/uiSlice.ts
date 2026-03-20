import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FeatureFlags = {
    enableOrdering?: boolean;
    enableBooking?: boolean;
};

interface UiState {
    theme: 'light' | 'dark';
    featureFlags: FeatureFlags;
    featureFlagsLoaded: boolean;
}

const initialState: UiState = {
    theme: 'light',
    featureFlags: {},
    featureFlagsLoaded: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<'light' | 'dark'>) {
            state.theme = action.payload;
        },
        setFeatureFlags(state, action: PayloadAction<FeatureFlags>) {
            state.featureFlags = action.payload;
            state.featureFlagsLoaded = true;
        },
    },
});

export const { setTheme, setFeatureFlags } = uiSlice.actions;
export default uiSlice.reducer;
