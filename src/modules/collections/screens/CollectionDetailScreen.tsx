import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CollectionStackParamList } from './CollectionNavigator';
import { useCollectionDetail } from '../hooks/useCollections';

type Props = NativeStackScreenProps<CollectionStackParamList, 'CollectionDetail'>;

export const CollectionDetailScreen: React.FC<Props> = ({ route }) => {
    const { slug } = route.params;
    const { data: collection, isLoading, isError } = useCollectionDetail(slug);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (isError || !collection) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load collection details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{collection.title || 'Unnamed Collection'}</Text>
                {collection.description && <Text style={styles.desc}>{collection.description}</Text>}
                <Text style={styles.info}>Slug: {collection.slug}</Text>
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
    info: { fontSize: 14, color: '#888', marginTop: 10 },
    errorText: { color: 'red', fontSize: 16 },
});
