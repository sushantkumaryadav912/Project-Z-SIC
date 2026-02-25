import * as Linking from 'expo-linking';

export const openInMaps = (lat: number, lng: number) => {
    Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    );
};
