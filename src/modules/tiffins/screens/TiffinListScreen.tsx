import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TiffinStackParamList } from './TiffinNavigator';
import { useTiffins } from '../hooks/useTiffins';
import { Tiffin } from '../types/tiffin';

type Props = NativeStackScreenProps<TiffinStackParamList, 'TiffinList'>;

export const TiffinListScreen: React.FC<Props> = ({ navigation }) => {
    const { data: tiffins, isLoading, isError } = useTiffins();

    const renderItem = ({ item }: { item: Tiffin }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TiffinDetail', { tiffinId: item._id || 'unknown' })}
        >
            <Text style={styles.cardTitle}>{item.name || 'Unnamed Tiffin'}</Text>
            {item.shortDescription && <Text style={styles.cardDesc}>{item.shortDescription}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : isError ? (
                <Text style={styles.errorText}>Failed to load tiffins.</Text>
            ) : (
                <FlatList
                    data={tiffins}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    list: { padding: 16 },
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardDesc: { color: '#666', marginTop: 4 },
    errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
});
