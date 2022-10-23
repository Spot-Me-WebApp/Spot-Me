import React from 'react';
import { Text, StyleSheet, Pressable, View, ImageBackground } from 'react-native';
import { SvgXml } from 'react-native-svg';

export const SocialLoginBtn = (props) => {
    const { onPress, title } = props;
    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={onPress}>
                <ImageBackground>{SvgXml}</ImageBackground>
                <Text style={styles.text}>{title}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "#8e9aaf",
        width: 250
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});