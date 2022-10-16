//1st step of registration process

import { React, useState } from 'react';
import { View, StyleSheet, Button, } from 'react-native';

import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'


const Register = (props) => {
    const [registerUsername, setRegisterUsername] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")


    const goNextForm = () => {
        if (registerUsername && registerPassword) {
            props.navigation.navigate('NameDOB', { username: registerUsername, password: registerPassword })
        }
    }


    return (
        <View style={styles.container}>
            <FormContainer>
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
        justifyContent: 'center',
    },
});

export default Register;