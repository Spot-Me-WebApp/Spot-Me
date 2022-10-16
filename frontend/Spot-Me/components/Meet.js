/* import React, { useEffect, useState, Component } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image, Animated, PanResponder } from 'react-native';

// For cross-device screen compatibility
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const OtherUsers = [
    { id: "1", uri: require('../assets/1.jpg') },
    { id: "2", uri: require('../assets/2.jpg') },
    //     { id: "3", uri: require('./assets/3.jpg') },
    //     { id: "4", uri: require('./assets/4.jpg') },
    //     { id: "5", uri: require('./assets/5.jpg') },
]

export default class Meet extends Component {

    constructor() {
        super()

        this.position = new Animated.ValueXY()
        this.state = {
            currentIndex: 0
        }
    }
    componentWillMount() {
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {

                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })

            },
            onPanResponderRelease: (evt, gestureState) => {

            }
        })
    }

    renderUsers = () => {

        return User.map((item, i) => {

            return (
                <Animated.View
                    {...this.PanResponder.panHandlers}

                    key={item.id} style={[{ height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                    <Image
                        style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                        source={item.uri} />


                </Animated.View >
            )
        }).reverse()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 60 }}>

                </View>
                <View style={{ flex: 1 }}>
                    <Animated.View style={{ height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10 }}>
                        <Image
                            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                            source={Users[0].uri} />


                    </Animated.View>
                </View>
                <View style={{ height: 60 }}>

                </View>


            </View>
        )
    }
}


 */
// export default Meet;