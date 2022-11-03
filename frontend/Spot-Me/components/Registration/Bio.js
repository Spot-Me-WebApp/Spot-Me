//3rd step of registration process

import { React, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';


const { height, width } = Dimensions.get('window')

const Bio = (props) => {

    const [registerBio, setRegisterBio] = useState('')


    const { username, password, name, dob } = props.route.params

    const goNextForm = () => {
        if (registerBio) {
            props.navigation.navigate('ExperienceLvlMethods', { username: username, password: password, name: name, dob: dob, bio: registerBio })
        }
    }


    return (
        <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={height * .4 * -1}>
            <Image
                source={require('../../assets/Spot_Me_Logo.png')}
                style={styles.logo}
            />
            <View style={{ marginTop: 40 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Tell us about yourself.</Text>
            </View>
            <View style={{ borderWidth: 2, borderRadius: 10, width: width * .8, height: 180, marginTop: 20 }}>
                <TextInput placeholder='Bio' autoFocus={true} multiline={true} maxLength={400} numberOfLines={8}
                    style={{ textAlignVertical: 'top', }} onChangeText={e => setRegisterBio(e)}>
                </TextInput>
            </View>
            <RightArrowBtn onPress={goNextForm} style={{ position: 'absolute', bottom: -120, left: 300 }} />
            <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: -120, right: 300 }} />



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
        marginBottom: 60,
        position: "absolute",
        bottom: height * .3,
        alignSelf: 'center'
    }
});

export default Bio;