import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, DevSettings, StatusBar, Image, SafeAreaView, Dimensions } from 'react-native';
import axios from 'axios'
import { SERVER_PORT } from '@env'
import { FormContainer } from '../Shared/Forms/FormContainer';

const { height, width } = Dimensions.get("screen")

const Profile = (props) => {

    const [userData, setUserData] = useState(null);

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
            props.navigation.navigate("Onboarding")
        }).catch((err) => console.log(err, err.stack))
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {userData ? (
                    <View>
                        {userData.images &&
                            <View style={styles.mainPicture}>
                                <Image source={{ uri: userData.images[0].url }} style={{ height: 115, width: 115, borderRadius: 115 / 2 }} />
                                <View style={{ marginLeft: 20 }}>
                                    <Text>
                                        <Text style={styles.name}>{userData.name}  </Text>
                                        <Text style={styles.age}>{calculateAge(userData.dob)}</Text>
                                    </Text>
                                    <Text style={styles.text}>{userData.expLevel}</Text>
                                    <Text style={styles.text}>Passions:</Text>
                                    {(userData.methods.map(method => {
                                        return (
                                            <View>
                                                <Text style={{ color: 'white' }}>   {method}</Text>
                                            </View>
                                        )
                                    }))}
                                    <Button title="Edit" onPress={() => props.navigation.navigate("Edit Profile", { userData })}></Button>
                                </View>
                            </View>
                        }
                        <View style={{ height: 1, backgroundColor: 'white', marginVertical: 10 }}>
                            {/* Horizontal line seperating header and body */}
                        </View>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            {userData.images.length > 1 &&
                                userData.images.filter(i => i.position > 0).map(i => {
                                    return (
                                        <Image source={{ uri: userData.images[i.position].url }} style={{
                                            height: 200, width: '40%', marginVertical: 10, marginHorizontal: 10
                                        }} />
                                    )
                                })
                            }
                        </View>
                        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                            <Text style={styles.bio}>
                                {userData.bio}
                            </Text>
                        </View>
                        <Button title="Logout" onPress={logoutUser}></Button>

                    </View>
                ) : (<Text>Profile</Text>)}
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#202020'
    },
    scrollView: {
        width
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    name: {
        color: 'white',
        fontSize: 28,
    },
    age: {
        color: 'white',
        fontSize: 18,
        fontWeight: '300'
    },
    bio: {
        color: 'white',
        fontSize: 16,
    },
    mainPicture: {
        paddingTop: height * .05,
        flexDirection: 'row'
    }
});

export default Profile;