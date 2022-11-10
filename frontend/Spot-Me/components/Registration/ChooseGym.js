import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { RightArrowBtn, LeftArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
import { PLACES_API_KEY, SERVER_PORT } from '@env'
import axios from 'axios'


const { height, width } = Dimensions.get('screen')
export default function ChooseGym(props) {
    const [uploadedImages, setUploadedImages] = useState(null)
    const [location, setLocation] = useState(null);
    let [nearbyGyms, setNearbyGyms] = useState([])
    setNearbyGyms = (element) => {
        nearbyGyms.push(element)
    }
    const [gymsFound, setGymsFound] = useState(false)
    let [selectedGyms, setSelectedGyms] = useState([])
    setSelectedGyms = (element) => {
        selectedGyms.push(element)
        setGymsFound(!gymsFound)
        console.log(selectedGyms)
    }

    const { username, password, name, dob, bio, expLevel, methods, registerProfilePics, provider, uri } = props.route.params;

    // Coordinates for Hunter 
    const INITIAL_POSITION = {
        latitude: 40.7678,
        longitude: -73.9645,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }
    //-------------------------------------------------------------------------------------REGISTRATION ROUTES---------------------------------------------------------
    const registerUser = async () => {
        if (uploadedImages) {
            await axios({
                url: `${SERVER_PORT}/register`,
                method: 'post',
                data: {
                    username: username,
                    password: password,
                    name: name,
                    dob: dob,
                    bio: bio,
                    expLevel: expLevel,
                    methods: methods,
                    imageData: uploadedImages,
                    provider: provider || undefined,
                    uri: uri || undefined,
                    gyms: selectedGyms
                },
                withCredentials: true
            }).then((response) => {
                console.log(response.data)
                loginUser()
            })
                .catch((error) => console.log(error, error.stack))
        }
    }

    const loginUser = async () => {
        if (!(provider && uri)) {
            await axios({
                url: `${SERVER_PORT}/login`,
                method: 'post',
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true
            }).then((response) => {
                props.navigation.navigate("BottomTabs")
            })
                .catch((error) => console.log(error, error.stack))
        }
        else {
            await axios({
                url: `${SERVER_PORT}/login/oauth`,
                method: 'post',
                data: {
                    uri: uri
                },
                withCredentials: true
            }).then((response) => {
                props.navigation.navigate("BottomTabs")
            })
                .catch((error) => console.log(error, error.stack))
        }
    }

    const uploadPhoto = async () => {
        await axios({
            url: `${SERVER_PORT}/image`,
            method: 'post',
            data: {
                images: registerProfilePics
            }
        })
            .then((response) => {
                const data = JSON.parse(response.request._response);
                setUploadedImages(data)
            })
            .catch((err) => console.log(err, err.stack))
    }
    //-------------------------------------------------------------------------------------REGISTRATION ROUTES---------------------------------------------------------

    useEffect(() => {
        async function getLocation() {
            let { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        getLocation();
    }, []);

    useEffect(() => {
        async function getNearbyGyms() {
            if (location) {
                await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=8050&type=gym&key=${PLACES_API_KEY}`)
                    .then((response) => {
                        for (let result of response.data.results) {
                            if (result.business_status === "OPERATIONAL") {
                                setNearbyGyms({
                                    latitude: result.geometry.location.lat,
                                    longitude: result.geometry.location.lng,
                                    name: result.name,
                                    address: result.vicinity.substr(0, result.vicinity.indexOf(','))
                                })
                            }
                        }
                        setGymsFound(!gymsFound);
                    })
                    .catch((err) => console.log(err, err.message))
            }
        }
        getNearbyGyms()
    }, [location])

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', marginTop: height * .05 }}>
                    <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Select Your Gym.</Text>
                </View>
                {location ?
                    (<MapView provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            longitudeDelta: 0.075,
                            latitudeDelta: 0.075
                        }}
                        loadingEnabled={true}
                        loadingBackgroundColor='#606060'
                        showsUserLocation={true}
                    >


                        {nearbyGyms && nearbyGyms.map((gym, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: gym.latitude,
                                    longitude: gym.longitude,
                                }}
                                title={gym.name}
                                description={gym.address}
                                image={require('../../assets/SpotMarker.png')}
                                onPress={() => setSelectedGyms({ latitude: gym.latitude, longitude: gym.longitude, name: gym.name, address: gym.address })}
                            />
                        ))}
                    </MapView>)
                    :
                    (<View>
                        <Image source={require('../../assets/loading.gif')} style={{ height: 50, width: 50 }} />
                    </View>)}
                {selectedGyms && selectedGyms.map((gym, index) => {
                    return (
                        <View key={index} >
                            <Text>{gym.name}, {gym.address}</Text>
                        </View>
                    )
                })}
            </ScrollView>
            {uploadedImages && registerUser()}
            <RightArrowBtn onPress={uploadPhoto} style={{ position: 'absolute', bottom: height * .07, right: 30 }} />
            <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: height * .07, left: 30 }} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: 'center',
    },
    map: {
        width: width - 2,
        height: height / 2,
        borderWidth: 3,
        marginTop: height * .1
    },
    logoMarker: {
        width: 20,
        height: 20,
    }
})