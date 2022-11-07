//1st step of registration process

import { React, useState, useEffect } from 'react';
import { View, StyleSheet, Button, Image, Text, ScrollView, KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
import axios from 'axios'
import { SERVER_PORT, GOOGLE_CLIENT_ID } from '@env'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { AntDesign } from '@expo/vector-icons'

const { height, width } = Dimensions.get("screen")

WebBrowser.maybeCompleteAuthSession();

const Register = (props) => {
    const [registerUsername, setRegisterUsername] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [googleAccessToken, setGoogleAccessToken] = useState();
    let [googleUserInfo, setGoogleUserInfo] = useState();
    let [userInfoReceived, setUserInfoReceived] = useState(false);
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        expoClientId: GOOGLE_CLIENT_ID
    })

    const goNextForm = () => {
        if (registerUsername && registerPassword && !googleUserInfo) {
            props.navigation.navigate('NameDOB', { username: registerUsername, password: registerPassword })
        }
    }


    useEffect(() => {
        if (googleResponse?.type === 'success') {
            setGoogleAccessToken(googleResponse.authentication.accessToken)
            getGoogleUserData()
        }
    }, [googleResponse])

    async function getGoogleUserData() {
        await axios.get("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            },
            withCredentials: true
        })
            .then((response) => {
                if (response.data) {
                    setGoogleUserInfo(googleUserInfo = {
                        username: response.data.email,
                        name: response.data.given_name + ' ' + response.data.family_name,
                        provider: "google",
                        uri: response.data.id
                    })
                    setUserInfoReceived(!userInfoReceived)
                }
            })
            .catch((err) => console.log(err))
    }


    useEffect(() => {
        if (googleUserInfo && userInfoReceived) {
            props.navigation.navigate("NameDOB", { username: googleUserInfo.username, name: googleUserInfo.name, uri: googleUserInfo.uri, provider: googleUserInfo.provider })
        }
    }, [googleUserInfo, userInfoReceived])


    if (Platform.OS === 'android') {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={-100}>
                <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Sign up with: </Text>
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
                <RightArrowBtn onPress={goNextForm} style={{ position: 'absolute', bottom: -120, left: width * .7 }} />
                <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: -120, right: width * .7 }} />

            </KeyboardAvoidingView>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="position">
            <FormContainer>
                <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
                <View style={{ marginVertical: 20 }}>
                    <AntDesign.Button name="google" backgroundColor="#f25c54" style={styles.socialBtn} onPress={() => googlePromptAsync({ useProxy: true })}
                        disabled={!googleRequest}>Sign up with Google</AntDesign.Button>
                </View>
                <View>
                    <AntDesign.Button name="facebook-square" style={styles.socialBtn}>Sign up with Facebook</AntDesign.Button>
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
        justifyContent: 'center',
    },
    logo: {
        width: 180,
        height: 180,
        color: "black",
        marginBottom: 150,
        position: "absolute",
        bottom: height * .2,
        alignSelf: 'center'
    },
    socialBtn: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: 250
    }
});

export default Register;