import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import Login from './Login';
import Register from './Registration/UsernamePassword';
import Meet from './Meet';


//First page a user sees when launching the app
const LandingPage = (props) => {

    return (
        <View style={styles.container}>
            <Text>Spot Me</Text>
            <Button title='Login' onPress={() => props.navigation.navigate('Login')} />
            <Button title='Sign Up' onPress={() => { props.navigation.navigate('Register') }} />
            <Button title='Meet' onPress={() => { props.navigation.navigate('Meet') }} />
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


export default LandingPage;