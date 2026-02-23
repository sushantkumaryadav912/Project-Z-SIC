import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TiffinStackParamList } from './TiffinNavigator';
import { useTiffinDetail } from '../hooks/useTiffins';

type Props = NativeStackScreenProps<TiffinStackParamList, 'TiffinDetail'>;

export const TiffinDetailScreen: React.FC<Props> = ({ route }) => {
    const { tiffinId } = route.params;
    const { data: tiffin, isLoading, isError } = useTiffinDetail(tiffinId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (isError || !tiffin) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load tiffin details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{tiffin.name || 'Unnamed Tiffin'}</Text>
                {tiffin.description && <Text style={styles.desc}>{tiffin.description}</Text>}
                {tiffin.pricePerMeal && <Text style={styles.price}>Price per meal: ₹{tiffin.pricePerMeal}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    desc: { fontSize: 16, color: '#444', marginBottom: 10, lineHeight: 22 },
    price: { fontSize: 18, fontWeight: '600', color: '#2ecc71', marginTop: 10 },
    errorText: { color: 'red', fontSize: 16 },
});
