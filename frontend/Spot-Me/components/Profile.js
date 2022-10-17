import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios'
import { SERVER_PORT } from '@env'
import { FormContainer } from '../Shared/Forms/FormContainer';

const Profile = (props) => {

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await axios({
                url: `${SERVER_PORT}/isLoggedIn`,
                withCredentials: true
            })
                .then((response) => {
                    if (response.data) {
                        setUserData(response.data)
                    }
                })
                .catch((error) => console.log(error));
        }
        fetchData();
    }, [])

    const calculateAge = (dob) => {
        const currentDate = new Date()
        const birthday = new Date(dob)
        switch (true) {
            case (currentDate.getMonth() > birthday.getMonth()):
                return (currentDate.getFullYear() - birthday.getFullYear())
            case (currentDate.getMonth() < birthday.getMonth()):
                return (currentDate.getFullYear() - birthday.getFullYear() - 1)
            default:
                if (currentDate.getDate() >= birthday.getDate()) {
                    return (currentDate.getFullYear() - birthday.getFullYear())
                }
                return (currentDate.getFullYear() - birthday.getFullYear() - 1)
        }
    }

    return (
        <View style={styles.container}>
            {userData ? (
                <FormContainer>
                    <Text>{userData.name}</Text>
                    <Text>Username: {userData.username}</Text>
                    <Text>Age: {calculateAge(userData.dob)}</Text>
                    <Text>Bio: {userData.bio}</Text>
                    <Text>Experience Level: {userData.expLevel}</Text>
                    <Text>Gym Passions:</Text>
                    <ScrollView>
                        <View>
                            {userData.methods && (userData.methods.map(method => {
                                return (
                                    <View>
                                        <Text>{method}</Text>
                                    </View>
                                )
                            }))}
                        </View>
                    </ScrollView>
                </FormContainer>
            ) : (<Text>Profile</Text>)}
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

export default Profile;