import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


const Login = (props) => {

    const [loginUsername, setLoginUsername] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <Button title="Go Back" onPress={() => { props.navigation.goBack() }}></Button>
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

export default Login;