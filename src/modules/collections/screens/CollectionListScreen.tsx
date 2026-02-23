import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CollectionStackParamList } from './CollectionNavigator';
import { useCollections } from '../hooks/useCollections';
import { Collection } from '../types/collection';

type Props = NativeStackScreenProps<CollectionStackParamList, 'CollectionList'>;

export const CollectionListScreen: React.FC<Props> = ({ navigation }) => {
    const { data: collections, isLoading, isError } = useCollections();

    const renderItem = ({ item }: { item: Collection }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CollectionDetail', { slug: item.slug || 'unknown' })}
        >
            <Text style={styles.cardTitle}>{item.title || 'Unnamed Collection'}</Text>
            {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : isError ? (
                <Text style={styles.errorText}>Failed to load collections.</Text>
            ) : (
                <FlatList
                    data={collections}
                    keyExtractor={(item, index) => item.slug || index.toString()}
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
