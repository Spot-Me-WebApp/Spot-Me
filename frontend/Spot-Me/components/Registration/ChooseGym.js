import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { RightArrowBtn, LeftArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';

const { height, width } = Dimensions.get('screen')
export default function ChooseGym(props) {
    const [uploadedImages, setUploadedImages] = useState(null)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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
                    uri: uri || undefined
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
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: height * .05 }}>
                <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
            </View>
            <View style={{ marginTop: 50 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Select Your Gym.</Text>
            </View>

            <MapView provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={INITIAL_POSITION}
            >

                <Marker coordinate={{
                    latitude: 40.7678,
                    longitude: -73.9645,
                }}
                    image={require('../../assets/SpotMarker.png')}
                    title="Hunter College Fitness Center" />

            </MapView>
            <RightArrowBtn style={{ position: 'absolute', bottom: height * .07, right: 30 }} />
            <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: height * .07, left: 30 }} />
        </View>
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
    },
    logo: {
        width: 180,
        height: 180,
        color: "black",
        top: height * .15 * -1,
        position: "absolute",
        alignSelf: 'center'
    },
    logoMarker: {
        width: 20,
        height: 20,
    }
})