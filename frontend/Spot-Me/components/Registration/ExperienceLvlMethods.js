// Last step before pushing data to mongoDb
import { React, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, DevSettings } from 'react-native';

import { FormContainer } from '../../Shared/Forms/FormContainer';
import { Input } from '../../Shared/Forms/Input'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import axios from 'axios'
import { SERVER_PORT } from '@env'

const EXP_LVL = [
    {
        item: 'Beginner',
        id: 'BGN',
    },
    {
        item: 'Intermediate',
        id: 'INT',
    },
    {
        item: 'Advanced',
        id: 'ADV',
    },
]

const METHODS = [
    {
        item: 'Powerlifting',
        id: 'PWR',
    },
    {
        item: 'Bodybuilding',
        id: 'BD',
    },
    {
        item: 'Cardio',
        id: 'CAR',
    },
    {
        item: 'Filming',
        id: 'FLM',
    },
    {
        item: 'Calisthenics',
        id: 'CLS',
    },
    {
        item: 'Olympic Lifting',
        id: 'OLY',
    },
]

const ExperienceLvlMethods = (props) => {

    const [userExp, setRegisterExpLevel] = useState("");
    const [methodsSelected, setRegisterMethods] = useState([]);

    const { username, password, name, dob, bio } = props.route.params

    const registerUser = () => {
        const expLevel = userExp.item
        const methods = methodsSelected.map(method => method.item)

        axios({
            url: `${SERVER_PORT}/register`,
            method: 'post',
            data: {
                username: username,
                password: password,
                name: name,
                dob: dob,
                bio: bio,
                expLevel: expLevel,
                methods: methods
            },
            withCredentials: true
        }).then((response) => {
            console.log(response.data)
            loginUser()
        })
            .catch((error) => console.log(error, error.stack))
    }

    const loginUser = async () => {
        await axios({
            url: `${SERVER_PORT}/login`,
            method: 'post',
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }).then((response) => {
            DevSettings.reload()
        })
            .catch((error) => console.log(error, error.stack))
    }

    return (
        <View style={{ margin: 30 }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 30, paddingBottom: 20 }}>Spot Me</Text>
            </View>
            <Text style={{ fontSize: 20, paddingBottom: 10 }}>User Experience</Text>
            <SelectBox
                label="Select your level"
                options={EXP_LVL}
                value={userExp}
                onChange={onChange()}
                hideInputFilter={false}
            />
            <View style={{ height: 40 }} />
            <Text style={{ fontSize: 20, paddingBottom: 10 }}>Select Your Gym Hobbies</Text>
            <SelectBox
                label="Select multiple passions"
                options={METHODS}
                selectedValues={methodsSelected}
                onMultiSelect={onMultiChange()}
                onTapClose={onMultiChange()}
                isMulti
            />
            <Button title="Register" onPress={registerUser}></Button>
            <Button title="Go Back" onPress={() => { props.navigation.goBack() }}></Button>
        </View>
    )

    function onMultiChange() {
        return (item) => setRegisterMethods(xorBy(methodsSelected, [item], 'id'))
    }

    function onChange() {
        return (val) => setRegisterExpLevel(val)
    }



}

export default ExperienceLvlMethods;