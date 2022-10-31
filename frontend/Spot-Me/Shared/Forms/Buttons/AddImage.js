import React from 'react';
import { View, Image, StyleSheet, Button, TouchableOpacity, Text } from 'react-native'

const AddImage = ({
    title,
    onPress,
    buttonColor,
    titleColor,
    buttonStyle,
    textStyle,
    imageSource,
}) => {



    return (
        <TouchableOpacity
            style={{
                ...styles.container,
                ...buttonStyle,
                backgroundColor: buttonColor || '#512DA8',
            }}
            onPress={onPress}>
            {imageSource ? <Image source={imageSource} style={{ width: '100%', height: '100%', aspectRatio: 0.8, }} />
                :
                <Text
                    style={{ ...styles.title, ...textStyle, color: titleColor || '#fff' }}>
                    {title}
                </Text>
            }
        </TouchableOpacity>
    );
};

export default AddImage;

const styles = StyleSheet.create({
    addImage: {
        width: '33%',
        height: '50%',
        padding: 20,
        backgroundColor: '#D3D3D3',
        borderColor: 'black',
        borderWidth: 2,
    },
    container: {
        marginTop: 50,
        backgroundColor: '#512DA8',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
});