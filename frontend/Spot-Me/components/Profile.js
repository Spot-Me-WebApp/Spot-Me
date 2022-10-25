import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, DevSettings, ImageBackground, Image } from 'react-native';
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

    const logoutUser = async () => {
        await axios({
            url: `${SERVER_PORT}/logout`,
            withCredentials: true
        }).then((response) => {
            console.log(response.data)
            DevSettings.reload()
        }).catch((err) => console.log(err))
    }

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
                <ImageBackground source={require('../assets/profilebackground.jpg')} resizeMode="cover">
                    <FormContainer>
                        {userData.images &&
                            <View>
                                <Image source={{ uri: userData.images[0].url }} style={{ height: 200, width: 200 }} />
                            </View>
                        }
                        <Text style={styles.text}>Hello {userData.name}</Text>
                        <Text style={styles.text}>Username: {userData.username}</Text>
                        <Text style={styles.text}>Age: {calculateAge(userData.dob)}</Text>
                        <Text style={styles.text}>Bio: {userData.bio}</Text>
                        <Text style={styles.text}>Experience Level: {userData.expLevel}</Text>
                        <Text style={styles.text}>Gym Passions:</Text>
                        <ScrollView>
                            <View>
                                {userData.methods && (userData.methods.map(method => {
                                    return (
                                        <View>
                                            <Text style={{ color: 'white' }}>{method}</Text>
                                        </View>
                                    )
                                }))}
                            </View>
                        </ScrollView>
                        <Button title="Logout" onPress={logoutUser}></Button>

                    </FormContainer>
                </ImageBackground>
            ) : (<Text>Profile</Text>)}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
});

export default Profile;