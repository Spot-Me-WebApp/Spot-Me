// Use This With FormContainer To Grab User Input

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native'

export const Input = (props) => {
    return (
        <View style={styles.inputField}>
            <TextInput
                placeholder={props.placeholder}
                name={props.name}
                id={props.id}
                value={props.value}
                autoCorrect={props.autoCorrect}
                onChangeText={props.onChangeText}
                onFocus={props.onFocus}
                secureTextEntry={props.secureTextEntry}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
            >
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 15,
    },
})

