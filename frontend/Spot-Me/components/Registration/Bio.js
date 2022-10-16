//3rd step of registration process

import { React, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';

import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'

const { width } = Dimensions.get('window')

const Bio = (props) => {

    const [registerBio, setRegisterBio] = useState('')


    const { username, password, name, dob } = props.route.params

    const goNextForm = () => {
        if (registerBio) {
            props.navigation.navigate('ExperienceLvlMethods', { username: username, password: password, name: name, dob: dob, bio: registerBio })
        }
    }


    return (
        <View style={styles.container}>
            <FormContainer>
                <Text>Bio (A short description about yourself)</Text>
                <Input placeholder="Bio" multiline={true} numberOfLines={8} style={{ textAlignVertical: 'top' }} onChangeText={e => setRegisterBio(e)}>
                </Input>
                <Button title='Next' onPress={goNextForm}></Button>
            </FormContainer>




            <Button title="Go Back" onPress={() => { props.navigation.goBack() }}></Button>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});

export default Bio;