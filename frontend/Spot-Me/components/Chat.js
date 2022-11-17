import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';





const Chat = (props) => {


    return (
        <SafeAreaView style={styles.header}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, fontFamily: 'Bodoni 72' }}>Chat</Text>

            {/* <ScrollView
            
            >

            <View style={styles.usersRow}>
            {OtherUsers.map( OtherUsers => (
                <View style={styles.user} key={OtherUsers.id}>
                    <Image source={item.uri} />
                </View>
            ))}
            </View>
            </ScrollView> */}






        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    usersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    user: {
        width: 100,
        height: 10,
        margin: 8,
        borderRadius: 50,
        borderWidth: 2,
        padding: 3,
        borderColor: '#202020'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50
    }
});

export default Chat;