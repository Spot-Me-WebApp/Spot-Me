import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function ChooseGym() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Coordinates for Hunter 
    const INITIAL_POSITION = {
        latitude: 40.7678,
        longitude: -73.9645,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }

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
            <View style={{ marginTop: 50 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Select Your Gym.</Text>
            </View>

            <MapView provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={INITIAL_POSITION}
                >
            
            <Marker coordinate= {{
                latitude: 40.7678,
                longitude: -73.9645,
            }}
            image={require('../../assets/SpotMarker.png')}
            title="Hunter College Fitness Center" />
            
            </MapView>
            <Image
                    source={require('../../assets/Spot_Me_Logo.png')}
                    style={styles.logo}
                />
                

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
        top: 100,
        width: Dimensions.get('window').width-2,
        height: Dimensions.get('window').height / 2,
        borderWidth:4,
    },
    logo: {
        width: 180,
        height: 180,
        color: "black",
        top: 35,
        position: "absolute",
        
    },
    logoMarker: {
        width: 20,
        height: 20,
        
        
    }
})