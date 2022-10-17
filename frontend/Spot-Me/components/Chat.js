import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


const Chat = (props) => {


    return (
        <View style={styles.container}>
            <Text>Chat</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Chat;