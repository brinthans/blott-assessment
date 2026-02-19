import React from 'react';
import { View, StyleSheet } from 'react-native';
import BlottLogo from './BlottLogo';

const PRIMARY_700 = '#553C9A';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <BlottLogo width={135} height={75} color="#FFFFFF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY_700,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
