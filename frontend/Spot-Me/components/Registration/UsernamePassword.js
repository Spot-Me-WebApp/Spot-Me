//1st step of registration process

import { React, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { SocialLoginBtn } from '../../Shared/Forms/Buttons/SocialLoginBtn';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'
import { GoogleSvg, FacebookSvg } from '../../Shared/Svg';
import axios from 'axios'
import { SERVER_PORT } from '@env'


const Register = (props) => {
    const [registerUsername, setRegisterUsername] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")


    const goNextForm = () => {
        if (registerUsername && registerPassword) {
            props.navigation.navigate('NameDOB', { username: registerUsername, password: registerPassword })
        }
    }

    // const googleRegister = () => {
    //     axios({
    //         url: `${SERVER_PORT}/login/google`

    //     })
    // }


    return (
        <View style={styles.container}>
            <FormContainer>
                {/* <GoogleSvg /> */}
                <SocialLoginBtn title="Sign Up With Google" />
                {/* <FacebookSvg /> */}
                <SocialLoginBtn title="Sign Up With Facebook" />
                <Input
                    placeholder="Username" onChangeText={e => setRegisterUsername(e)}>
                </Input>
                <Input
                    secureTextEntry='true'
                    placeholder="Password" onChangeText={e => setRegisterPassword(e)}>
                </Input>
                <Button title="Next" onPress={goNextForm}></Button>
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
        justifyContent: 'center'
    }
});

export default Register;