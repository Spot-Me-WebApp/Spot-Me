import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, SafeAreaView, FlatList, ImageBackground } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {SOCKET_PORT} from '@env'
import { UserDataContext } from './Contexts';
const  WIDTH = Dimensions.get("window").width;
const  HEIGHT = Dimensions.get("window").height;



const Schedule = (props) => {

    // const { userData, setUserData } = useContext(UserDataContext)

    // const _renderRequests = ({user, index}) => {
    //     return (
    //         <View style={{
    //             marginLeft: index === 0 ? 30: 20,
                
    //         }}>
    //             <ImageBackground source={userData.images[0].url}
    //                 resizeMode='cover'
    //                 borderRadius={30} 
    //                 style={{
    //                     width: 100,
    //                     height: 100,
    //                     justifyContent: 'space-between'

    //                 }}>
                    
    //             </ImageBackground>
                
    //         </View>
    //     )
    // }

    // createRequests = async () => {

    // }


    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 90 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Schedule Gym Sessions</Text>
            </View>
            <View style={{ marginTop: 1, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 24, fontFamily: 'Bodoni 72' }}>Gym Requests</Text>
            </View>

            

            <Calendar
  // Specify style for calendar container element. Default = {}
  style={{
    borderWidth: 5,
    borderColor: 'gray',
    height: HEIGHT * .5,
    width: WIDTH * .95
  }}
  // Specify theme properties to override specific styles for calendar parts. Default = {}
  theme={{
    backgroundColor: '#00000',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'black',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
    
  }}
/>
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

export default Schedule;