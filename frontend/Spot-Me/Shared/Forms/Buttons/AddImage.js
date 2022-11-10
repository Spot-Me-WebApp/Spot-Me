import React from 'react';
import {Image, StyleSheet, TouchableOpacity, Text } from 'react-native'


const AddImage = ({
    title,
    buttonColor,
    titleColor,
    buttonStyle,
    textStyle,
    imageSource,
    deleteButton,
    onPress,
    disabled
}) => {


    return (
        <TouchableOpacity
            style={{
                ...styles.container,
                ...styles.addImage,
                ...buttonStyle,
                backgroundColor: buttonColor || '#512DA8',
            }}
            onPress={onPress}>
                {/* aspectRatio for Mitchell: .8 & Dennies: .66 */}
            {imageSource ? <Image source={imageSource} style={{ width: '100%', height: '100%', aspectRatio: 0.65, borderRadius: 10}} />
                :
                <Text
                    style={{ ...styles.title, ...textStyle, color: titleColor || '#fff' }}>
                    {title}
                </Text>
            }
            {disabled && deleteButton}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
});