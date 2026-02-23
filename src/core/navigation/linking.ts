import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [prefix, 'sic://'],
    config: {
        screens: {
            Splash: 'splash',
            MainTabs: {
                screens: {
                    TiffinsTab: {
                        screens: {
                            TiffinList: 'tiffin',
                            TiffinDetail: 'tiffin/:tiffinId',
                        },
                    },
                    CollectionsTab: {
                        screens: {
                            CollectionList: 'collection',
                            CollectionDetail: 'collection/:slug',
                        },
                    },
                },
            },
        },
    },
};
