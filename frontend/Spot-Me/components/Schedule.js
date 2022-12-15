import React, { useEffect, useState, useContext, } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, SafeAreaView, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import axios from 'axios';
import { SERVER_PORT } from '@env';
import { UserDataContext } from './Contexts';
import Modal from 'react-native-modal'
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import { Input } from '../Shared/Forms/Input';
import { LeftArrowBtn, RightArrowBtn } from '../Shared/Forms/Buttons/ArrowButtons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'

const Schedule = (props) => {

    const { userData, setUserData } = useContext(UserDataContext)
    let [selectedDate, setDate] = useState(new Date())
    const [modalVisible, setModalVisible] = useState(false);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [eventTime, setEventTime] = useState(new Date())
    const [matches, setMatches] = useState([])
    const [recipients, setRecipients] = useState([])
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const setTime = (event, date) => {
        if (event.type === 'set' || event.type === 'dismissed') {
            setEventTime(date)
        }
    }
    let selectedDateCopy = new Date();

    // setDate = (date) => {
    //     // const obj = date.reduce((c, v) => Object.assign(c, { [v]: { selected: true, selectedColor: '#99d98c' } }), {})
    //     selectedDate = date;
    // }

    const Requests = [
        {
            id: 1,
            location: 'Blink',
            date: new Date('2022/12/14'),
            image: require('../assets/1.jpg'),
            what: 'Leg Day',
            sender: 'Chris'
        },
        {
            id: 2,
            location: 'Blink',
            date: new Date('2022/12/14'),
            image: require('../assets/2.jpg'),
            what: 'Leg Day',
            sender: 'Greg'
        },
        {
            id: 3,
            location: 'Blink',
            date: new Date('2022/12/14'),
            image: require('../assets/3.jpg'),
            what: 'Leg Day',
            sender: 'Chris'
        },
        {
            id: 4,
            location: 'Blink',
            date: new Date('2022/12/14'),
            image: require('../assets/4.jpg'),
            what: 'Leg Day',
            sender: 'Greg'
        },
    ]

    function onMultiChange() {
        return (item) => { setRecipients(xorBy(recipients, [item], 'id')); console.log(recipients) }
    }


    const _renderRequests = ({ item, index }) => {
        return (
            <View style={{
                marginLeft: index === 0 ? 30 : 20,
                marginRight: index === Requests.length - 1 ? 30 : 0
            }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        setRequestModalVisible(true)
                    }}
                >
                    <ImageBackground source={item.image}
                        resizeMode='cover'
                        borderRadius={20}
                        style={{
                            width: WIDTH / 3,
                            height: HEIGHT * .22,
                            justifyContent: 'space-between'
                        }}
                    >
                        <View style={{

                            marginHorizontal: 10,
                            marginVertical: 10,
                        }}>

                            <View style={styles.dateBox}>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 18, }}>{item.date.getDate()}</Text>
                                <Text style={{ alignContent: 'center', justifyContent: 'center', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 10, }}>{item.date.toDateString().substr(4, 3)}</Text>


                            </View>
                        </View>


                        <View style={{
                            marginLeft: 10,
                            marginBottom: 15,
                        }}>
                            <Text style={{ color: 'white', opacity: .85, fontSize: 8, }}>{item.location} </Text>
                            <Text style={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 12, }}>{item.sender} </Text>

                        </View>

                    </ImageBackground>

                </TouchableWithoutFeedback>

            </View>
        )
    }

    useEffect(() => {
        async function fetchData() {
            await axios({
                url: `${SERVER_PORT}/getMatchesData`
            })
                .then((res) => { console.log(res.data); setMatches(res.data) })
                .catch((err) => console.log(err))
        }
        fetchData();
    }, [])

    useEffect(() => {
        selectedDateCopy = selectedDate
    }, [selectedDate])

    const submitEventForm = async () => {
        await axios({
            url: `${SERVER_PORT}/sendGymRequest`,
            method: 'post',
            data: {
                date: selectedDate,
                time: eventTime,
                recipients,
                location,
                description
            }
        })
            .then((res) => {
                console.log(res.data)
                setUserData(res.data)
            })
            .catch((err) => console.log(err))
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 20, flex: 1, justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 26, fontFamily: 'Bodoni 72', color: 'white', textAlign: 'center' }}>Workout Requests</Text>
            </View>



            <View style={{
                marginBottom: 15, alignItems: 'center'
            }}>
                <FlatList
                    horizontal
                    keyExtractor={(item) => item.id}
                    data={Requests}
                    renderItem={_renderRequests}
                    showsHorizontalScrollIndicator={false}

                ></FlatList>
            </View>

            <View>
                <Modal
                    isVisible={requestModalVisible}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'black'
                    }}>
                        <ImageBackground
                            resizeMode='cover'
                            source={Requests[0].image}
                            style={{
                                width: '100%',
                                height: HEIGHT * .8
                            }}
                        >
                            <View style={{ flex: 1 }}>

                                <View style={styles.modalHeader}>
                                    <View style={styles.modalDateBox}>
                                        <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 36, }}>{Requests[0].date.getDate()}</Text>
                                        <Text style={{ alignContent: 'center', justifyContent: 'center', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 20, }}>{Requests[0].date.toDateString().substr(4, 3)}</Text>
                                    </View>
                                </View>


                                <View style={styles.modalGradient}>
                                    <LinearGradient
                                        colors={['transparent', '#000']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            width: '100%',
                                            height: HEIGHT * .8,
                                            justifyContent: 'flex-end'
                                        }}
                                    >

                                        <View style={styles.modalInfo}>
                                            <Text style={{ color: 'white', opacity: .5, letterSpacing: 2, fontSize: 16 }}>{Requests[0].what}</Text>
                                            <Text style={{ color: 'white', fontSize: 24, textTransform: 'uppercase' }}>{Requests[0].sender}</Text>
                                            <Text style={{ color: 'white', opacity: .5, letterSpacing: 2, fontSize: 16 }}>{Requests[0].where}</Text>

                                            {/* <View style={styles.dateBox}>
                                                <Text style={{ alignContent: 'center', justifyContent: 'center', fontSize: 18, }}>{Requests[0].date.getDate()}</Text>
                                                <Text style={{ alignContent: 'center', justifyContent: 'center', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 10, }}>{Requests[0].date.toDateString().substr(4, 3)}</Text>
                                            </View> */}
                                        </View>

                                    </LinearGradient>
                                </View>



                            </View>


                        </ImageBackground>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly'
                        }}>
                            <TouchableOpacity
                                style={{
                                    width: 75,
                                    height: 35,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    alignItems: 'center'
                                }}
                            //onPress={()}
                            >
                                <Text style={{ color: 'black' }}>DECLINE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: 75,
                                    height: 35,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: 'black' }}>ACCEPT</Text>
                            </TouchableOpacity>
                        </View>


                        <Button title="Dismiss" onPress={() => setRequestModalVisible(false)}></Button>
                    </View>
                </Modal>

            </View>

            <View>
                <Modal
                    isVisible={modalVisible}
                >
                    <View style={{ alignItems: 'center', flex: 1, backgroundColor: '#202020' }}>
                        <Text style={{ color: '#f8f9fa', fontSize: 24, fontWeight: 'bold', marginTop: 15 }}>Schedule Event</Text>
                        <Text style={{ color: 'white', alignSelf: 'flex-start', marginLeft: 5, marginTop: 30, fontWeight: 'bold' }}>When</Text>
                        <Input value={`${new Date(selectedDateCopy.setDate(selectedDate.getDate() + 1)).toDateString()} 
                   ${eventTime.toLocaleTimeString().split(':').map((val, i) => i === 2 ? val.substring(3, 6) : val).join(':')}`}
                            style={{ color: 'white', marginTop: -10 }}></Input>
                        <RNDateTimePicker mode='time' value={new Date()} style={{ backgroundColor: '#fff', width: WIDTH * .4, justifyContent: 'center', marginTop: 10 }}
                            onChange={(event, date) => setTime(event, date)} />
                        {matches.length > 0 &&
                            (
                                <SelectBox
                                    label="Who's Coming?"
                                    options={matches.map(m => ({ item: m.name, id: m._id }))}
                                    selectedValues={recipients}
                                    onMultiSelect={onMultiChange()}
                                    onTapClose={onMultiChange()}
                                    isMulti
                                    labelStyle={{ fontSize: 16, color: 'white', marginTop: 20, marginLeft: 5, textAlign: 'left' }}
                                    optionsLabelStyle={{ color: 'white' }}
                                    arrowIconColor='black'
                                    toggleIconColor='black'
                                    searchIconColor='black'
                                />
                            )
                        }
                        <Text style={{ color: 'white', alignSelf: 'flex-start', marginLeft: 5, marginTop: 30, fontWeight: 'bold' }}>Where</Text>
                        <Input style={{ color: 'white', marginTop: -10 }} onChangeText={e => setLocation(e)}></Input>
                        <Text style={{ color: 'white', alignSelf: 'flex-start', marginLeft: 5, marginTop: 30, fontWeight: 'bold' }}>Event Description</Text>
                        <Input style={{ color: 'white', marginTop: -10 }} onChangeText={e => setDescription(e)}></Input>
                        <Button title="Confirm" onPress={submitEventForm}></Button>
                        <Button title="Dismiss" onPress={() => { setModalVisible(false); setEventTime(new Date()) }}></Button>
                    </View>
                </Modal>
            </View>

            <Calendar
                // Specify style for calendar container element. Default = {}
                style={{
                    borderWidth: 5,
                    borderColor: 'gray',
                    height: HEIGHT * .6,
                    width: WIDTH * .95,
                    marginBottom: 0,
                    backgroundColor: '#fff',
                    alignSelf: 'center'
                }}
                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    backgroundColor: '#ffffff',
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
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: 'blue',
                    indicatorColor: 'blue',
                    // textDayFontFamily: 'monospace',
                    // textMonthFontFamily: 'monospace',
                    // textDayHeaderFontFamily: 'monospace',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}
                onDayPress={day => { setDate(new Date(day.dateString)); console.log(selectedDate); setModalVisible(true) }}
            // markedDates={
            //     selectedDate
            // }
            />

        </View>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020',
    },
    dateBox: {
        width: 35,
        height: 35,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalDateBox: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,

    },
    modalGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
        zindex: '-1',

    },
    modalInfo: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }



});

export default Schedule;