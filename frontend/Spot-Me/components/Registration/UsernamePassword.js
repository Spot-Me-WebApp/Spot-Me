//1st step of registration process

import { React, useState } from 'react';
import { View, StyleSheet, Button, Image, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SocialLoginBtn } from '../../Shared/Forms/Buttons/SocialLoginBtn';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'
import { GoogleSvg, FacebookSvg, } from '../../Shared/Svg';
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
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
        <KeyboardAvoidingView style={styles.container} behavior="position">
            <FormContainer>
                <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
                <View>
                    {/* <GoogleSvg /> */}
                    <SocialLoginBtn title="Sign Up With Google" />
                    {/* <FacebookSvg /> */}
                    <SocialLoginBtn title="Sign Up With Facebook" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                    <View style={{ flex: 1, height: 2, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', fontWeight: "bold" }}>OR</Text>
                    </View>
                    <View style={{ flex: 1, height: 2, backgroundColor: 'black' }} />
                </View>
                <Input
                    placeholder="Email" onChangeText={e => setRegisterUsername(e)}
                    keyboardType="email-address">
                </Input>
                <Input
                    secureTextEntry={true}
                    placeholder="Password" onChangeText={e => setRegisterPassword(e)}>
                </Input>
                <RightArrowBtn onPress={goNextForm} style={{ position: 'absolute', bottom: -120, left: 300 }} />
                <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: -120, right: 300 }} />
            </FormContainer>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 180,
        height: 180,
        color: "black",
        marginBottom: 130,
        position: "absolute",
        bottom: 160,
    }
});

export default Register;