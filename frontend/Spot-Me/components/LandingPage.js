import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Dimensions } from 'react-native';
import { Video } from 'react-native-video';
import WorkoutVideo from "../assets/seperateworkout.mp4"
import Login from './Login';
import Register from './Registration/UsernamePassword';
import Meet from './Meet';


const { height, width } = Dimensions.get("window")

//First page a user sees when launching the app
const LandingPage = (props) => {
    return (
        <View style={styles.container}>
            {<Video
                source={require('../assets/seperateworkout.mp4')}
                resizeMode={"cover"}
                style={styles.backgroundVideo}
                muted={true}
                repeat={true}
                rate={1.0}
                ignoreSilentSwitch={"obey"}
            />}
            <Text>Spot Me</Text>
            <Button title='Login' onPress={() => props.navigation.navigate('Login')} />
            <Button title='Sign Up' onPress={() => { props.navigation.navigate('Register') }} />
            <Button title='Meet' onPress={() => { props.navigation.navigate('Meet') }} />

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
    backgroundVideo: {
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0

    }

});

export default LandingPage;