//2nd step of registration process

import { React, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, } from 'react-native';

import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'

import RNDateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window')

const NameDOB = (props) => {

    const [registerName, setRegisterName] = useState('')
    const [registerDOB, setRegisterDOB] = useState(new Date(2008, 11, 31))
    const setDate = (event, date) => {
        if (event.type === 'set' || event.type === 'dismissed') {
            setRegisterDOB(date)
        }
    }
    const { username, password } = props.route.params

    const goNextForm = () => {
        if (registerName && registerDOB) {
            const dob = registerDOB.toISOString().substring(0, 10)
            props.navigation.navigate('Bio', { username: username, password: password, name: registerName, dob: dob })
        }
    }


    return (
        <View style={styles.container}>
            <FormContainer>
                <Input
                    placeholder="Name" onChangeText={e => setRegisterName(e)}>
                </Input>
                <Text>Date of Birth</Text>
                <RNDateTimePicker
                    value={registerDOB} style={styles.datePicker} minimumDate={new Date(1930, 0, 1)} maximumDate={new Date(2008, 11, 31)}
                    onChange={(event, date) => setDate(event, date)}
                />
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    datePicker: {
        backgroundColor: '#fff',
        width: width,
    }
});

export default NameDOB;