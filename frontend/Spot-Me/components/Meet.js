import React, { useEffect, useState, Component } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';

// For cross-device screen compatibility
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const OtherUsers = [
    { id: "1", uri: require('../assets/1.jpg') },
    { id: "2", uri: require('../assets/2.jpg') },
         { id: "3", uri: require('../assets/3.jpg') },
        { id: "4", uri: require('../assets/4.jpg') },
//          { id: "5", uri: require('./assets/5.jpg') },
]


export default class Meet extends Component {

    constructor() {
        super()
        this.position = new Animated.ValueXY()
        this.state ={
            currentIndex: 0
        }

        // Animation for cards to tilt to whichever side is being swiped on
        this.rotate = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
            outputRange:['-15deg','0deg','15deg'],
            extrapolate: 'clamp'
        })

        this.rotateAndTranslate = {
            transform:[{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
        ]
        }


        // Hides "SPOT" & "NOPE" SIGNS Until a Certain Threshold
        this.spotOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
            outputRange:[0,0,1],
            extrapolate: 'clamp'
        })

        this.nopeOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
            outputRange:[1,0,0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
            outputRange:[1,0,1],
            extrapolate: 'clamp'
        })
        this.nextCardResize = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
            outputRange:[1,0.8,1],
            extrapolate: 'clamp'
        })
    }

    
    componentWillMount(){

        
        // Animation for swiping
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder:(evt, gestureState) =>true,
            onPanResponderMove:(evt, gestureState) => {

                this.position.setValue({x:gestureState.dx, y:gestureState.dy})
            },
            onPanResponderRelease:(evt, gestureState) =>{
            
                // Throws cards away to the right
                // ***NEEDS TO FIND A WAY TO KEEP TRACK OF USERS SWIPED RIGHT AND LEFT****
                if(gestureState.dx > 120){
                    Animated.spring(this.position, {
                        toValue:{x:SCREEN_WIDTH + 100, y:gestureState.dy}
                    }).start(()=>{
                        this.setState({currentIndex:this.state.currentIndex+1}, ()=> {
                            this.position.setValue({ x:0, y:0})
                        })
                    })
                } else if(gestureState.dx < -120){
                    Animated.spring(this.position, {
                        toValue:{x: -SCREEN_WIDTH - 100, y:gestureState.dy}
                    }).start(()=>{
                        this.setState({currentIndex:this.state.currentIndex+1}, ()=> {
                            this.position.setValue({ x:0, y:0})
                        })
                    })
                }  else {
                    Animated.spring(this.position, {
                        toValue: {x:0, y:0},
                        friction: 4
                    }).start()
                } 
            }

        })
    }

    // Shows users in profile cards by using key value pairs
    renderUsers = () => {

        return OtherUsers.map((item,i) => {
            
            if( i < this.state.currentIndex){
                return null
            } else if ( i == this.state.currentIndex){

                // Animate current card to be able to be swiped
                return(
                    <TouchableOpacity>
                    <Animated.View 
                    {...this.PanResponder.panHandlers}
                    key={item.id} style={[this.rotateAndTranslate,{height:SCREEN_HEIGHT - 250, width: SCREEN_WIDTH, padding: 10, position:'absolute'}]}>
                        
                        {/* 'Spot' Text when swiped right */}
                        <Animated.View style={{opacity:this.spotOpacity, transform:[{rotate: '30deg'}],position: 'absolute', top: 50, left: 35, zIndex: 1000}}>
                            <Text style={{ borderWidth: 3, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10}}> SPOT </Text>
                        </Animated.View>

                        {/* 'Nope' Text when swiped right */}
                        <Animated.View style={{opacity:this.nopeOpacity, transform:[{rotate: '-30deg'}],position: 'absolute', top: 50, right: 35, zIndex: 1000}}>
                            <Text style={{ borderWidth: 3, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10}}> NOPE </Text>
                        </Animated.View>
    
                            <Image
                            style={{flex:1,height:null, width: null, resizeMode: 'cover', borderRadius: 20}}
                            source={item.uri}
                            />
    
                        </Animated.View>
                        </TouchableOpacity>
                )
            } else {
                // The card after current card
                return(
                    <Animated.View 
                    
                    key={item.id} style={[{opacity:this.nextCardOpacity, transform: [{ scale: this.nextCardResize}], height:SCREEN_HEIGHT - 252, width: SCREEN_WIDTH, padding: 10, position:'absolute'}]}>
    
                            <Image
                            style={{flex:1,height:null, width: null, resizeMode: 'cover', borderRadius: 20}}
                            source={item.uri}/>
    
                        </Animated.View>
                )
            }
        
        }).reverse()
    }

    render() {
        return (

            
            <View style={{flex:1, top: 20}}>
                <View style={{ height: 60}}>

                </View>
               
                <View style={{ flex: 1 }}>
                
                    {this. renderUsers()}
                </View>
                <View style={{ height:60 }}>

                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 100,
        position: 'relative',
        bottom: 220,
        alignItems: 'center',
        justifyContent: 'center',
        top: 1
    },
    buttons: {
        position: "absolute",
        top: 310
    }
});
