import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, DevSettings, StatusBar, Image, SafeAreaView, Dimensions } from 'react-native';
import axios from 'axios'
import { SERVER_PORT } from '@env'
import { FormContainer } from '../Shared/Forms/FormContainer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
                        <View style={{
                            paddingHorizontal: 40,
                            backgroundColor: "#FFFFFF",
                            height: "40%",
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,

                        }}>
                            <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>

                                <Ionicons.Button name="settings" size={24} color="black" backgroundColor="white" onPress={() => props.navigation.navigate("Edit Profile", { userData })}></Ionicons.Button>
                                <View style={{
                                    width: "90%", alignItems: "flex-end"
                                }}>
                                    <MaterialIcons.Button name="logout" size={24} color="black" backgroundColor="white" onPress={logoutUser}></MaterialIcons.Button>

                                </View>

                            </View>
                            {userData.images &&
                                <View style={styles.mainPicture}>
                                    <Image source={{ uri: userData.images[0].url }} style={{ alignSelf: 'center', height: 115, width: 115, borderRadius: 115 / 2 }} />
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>
                                            <Text style={styles.name}>{userData.name}  </Text>
                                            <Text style={styles.age}>{calculateAge(userData.dob)}</Text>
                                        </Text>
                                        <Text style={styles.text}>{userData.expLevel}</Text>
                                        <Text style={styles.text}>Passions:</Text>
                                        {(userData.methods.map(method => {
                                            return (
                                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width }}>
                                                    <Text style={{ color: 'white', padding: 10, backgroundColor: '#202020', borderRadius: 20 }}>   {method}</Text>
                                                </View>
                                            )
                                        }))}
                                        <Text style={styles.bio}>
                                            {userData.bio}
                                        </Text>

                                    </View>
                                </View>
                            }

                            <View style={{ marginVertical: 30 }}>
                                {/* spacing between header and body */}
                            </View>

                        </View>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width }}>
                            {userData.images.length > 1 &&
                                userData.images.filter(i => i.position > 0).map(i => {
                                    return (
                                        <Image source={{ uri: userData.images[i.position].url }} style={{
                                            height: 200, width: '40%', marginVertical: 10, marginHorizontal: 10, borderRadius: 20
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

                    </View>) : (<Text>Profile</Text>)}
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
        color: '#202020',
        fontFamily: 'Thonburi',
        fontSize: 18,
    },
    name: {
        color: '#202020',
        fontFamily: 'Thonburi',
        fontSize: 28,
        fontWeight: 'bold'
    },
    age: {
        color: '#202020',
        fontSize: 18,
        fontFamily: 'Thonburi',
        fontWeight: '300'
    },
    bio: {
        color: 'white',
        fontFamily: 'Thonburi',
        fontSize: 14,
    },
    mainPicture: {
        paddingTop: height * .05,
        flexDirection: 'column'
    }
});

export default Profile;