import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, DevSettings } from 'react-native';
import { FormContainer } from '../Shared/Forms/FormContainer';
import { Input } from '../Shared/Forms/Input'
import { SocialLoginBtn } from '../Shared/Forms/Buttons/SocialLoginBtn';
import axios from 'axios'
import { SERVER_PORT } from '@env'

const Login = (props) => {

    const [loginUsername, setLoginUsername] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const loginUser = async () => {
        if (loginUsername && loginPassword) {
            await axios({
                url: `${SERVER_PORT}/login`,
                method: 'post',
                data: {
                    username: loginUsername,
                    password: loginPassword
                },
                withCredentials: true
            }).then((response) => {
                console.log(response.data)
                DevSettings.reload()
            })
                .catch((error) => console.log(error, error.stack))
        }
    }

    return (
        <View style={styles.container}>
            <FormContainer>
                <SocialLoginBtn title="Login With Google" />
                <SocialLoginBtn title="Login With Facebook" />
                <Input
                    placeholder="Username" onChangeText={e => setLoginUsername(e)}>
                </Input>
                <Input
                    secureTextEntry={true}
                    placeholder="Password" onChangeText={e => setLoginPassword(e)}>
                </Input>
                <Button title="Login" onPress={loginUser}></Button>
            </FormContainer>
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