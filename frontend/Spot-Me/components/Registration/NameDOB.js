//2nd step of registration process

import { React, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image } from 'react-native';

import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
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
                <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
                <Input
                    placeholder="Name" onChangeText={e => setRegisterName(e)}>
                </Input>
                <Text style={{ marginTop: 30, fontSize: 17.5 }}>Date of Birth</Text>
                <View style={styles.datePicker}>
                    <RNDateTimePicker
                        value={registerDOB} minimumDate={new Date(1930, 0, 1)} maximumDate={new Date(2008, 11, 31)} display="spinner"
                        onChange={(event, date) => setDate(event, date)}
                    />
                </View>
                <RightArrowBtn onPress={goNextForm} style={{ position: 'absolute', bottom: -120, left: 300 }} />
                <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: -120, right: 300 }} />
            </FormContainer>






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
        justifyContent: 'center'
    },
    logo: {
        width: 180,
        height: 180,
        color: "black",
        marginBottom: 140,
        position: "absolute",
        bottom: 180,
    }
});

export default NameDOB;