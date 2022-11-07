import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Button } from 'react-native'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'



const EditProfile = (props) => {
    const { userData } = props.route.params
    const [Bio, setBio] = useState(userData.bio)
    const [Exp, setExp] = useState(userData.expLevel)
    const [Methods, setMethods] = useState([])
    const { height, width } = Dimensions.get("screen")

    const EXP_LVL = [
        {
            item: 'Beginner',
            id: 'BGN',
        },
        {
            item: 'Intermediate',
            id: 'INT',
        },
        {
            item: 'Advanced',
            id: 'ADV',
        },
    ]

    const METHODS = [
        {
            item: 'Powerlifting',
            id: 'PWR',
        },
        {
            item: 'Bodybuilding',
            id: 'BD',
        },
        {
            item: 'Cardio',
            id: 'CAR',
        },
        {
            item: 'Filming',
            id: 'FLM',
        },
        {
            item: 'Calisthenics',
            id: 'CLS',
        },
        {
            item: 'Olympic Lifting',
            id: 'OLY',
        },
    ]

    function onMultiChange() {
        return (item) => setMethods(xorBy(Methods, [item], 'id'))
    }

    function onChange() {
        return (val) => setExp(val)
    }

    return (
        <ScrollView style={{ backgroundColor: '#202020' }}>
            <KeyboardAvoidingView behavior='position'>
                <View style={styles.container}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={styles.name}>{userData.name}</Text>
                    </View>
                    <Image source={{ uri: userData.images[0].url }} style={styles.mainPicture}></Image>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        {userData.images.length > 1 &&
                            userData.images.filter(i => i.position > 0).map(i => {
                                return (
                                    <Image source={{ uri: userData.images[i.position].url }} style={{
                                        height: 200, width: '40%', marginVertical: 10, marginHorizontal: 10
                                    }} key={i.position} />
                                )
                            })
                        }
                    </View>
                    <View style={{ marginLeft: 25, marginTop: 15 }}></View>
                    <Text style={styles.bio}>Date of Birth: {userData.dob.substr(0, 10)}</Text>
                    <Text style={styles.bio}>Bio</Text>
                    <View style={{ borderWidth: 2, borderColor: 'gray', borderRadius: 10, width: width * .8, height: 180, alignSelf: 'center', }}>
                        <TextInput placeholder='Bio' autoFocus={false} multiline={true} maxLength={400} numberOfLines={8}
                            style={{ textAlignVertical: 'top', color: 'white' }} onChangeText={e => setBio(e)} value={Bio}>
                        </TextInput>
                    </View>
                    <View style={{ marginVertical: 20, width: '80%', alignSelf: 'center' }}>
                        <Text style={styles.bio}>Experience Level</Text>
                        <SelectBox
                            label="Select your level"
                            options={EXP_LVL}
                            value={Exp}
                            onChange={onChange()}
                            hideInputFilter={true}
                            labelStyle={{ textAlign: 'center', fontSize: 16, color: 'gray' }}
                            arrowIconColor='gray'
                            optionsLabelStyle={{ color: 'white' }}
                            selectedItemStyle={{ color: 'white' }}
                        />
                    </View>
                    <View style={{ marginVertical: 20, width: '80%', alignSelf: 'center' }}>
                        <Text style={styles.bio}>Passions: </Text>
                        <SelectBox
                            label="Select multiple passions"
                            options={METHODS}
                            selectedValues={Methods}
                            onMultiSelect={onMultiChange()}
                            onTapClose={onMultiChange()}
                            isMulti
                            labelStyle={{ textAlign: 'center', fontSize: 16, color: 'gray' }}
                            arrowIconColor='gray'
                            toggleIconColor='gray'
                            searchIconColor='gray'
                            optionsLabelStyle={{ color: 'white' }}
                            search
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
            <Button title="Save" />
            <Button title="Discard" />
        </ScrollView>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: '1',
        paddingTop: StatusBar.currentHeight
    },
    name: {
        color: 'white',
        fontSize: 30,
        marginTop: 20,
        marginLeft: 25
    },
    mainPicture: {
        height: 115,
        width: 115,
        borderRadius: 115 / 2,
        marginTop: 20,
        marginLeft: 15,
        alignSelf: 'center'
    },
    bio: {
        color: 'white',
        fontSize: 16
    }
})

export default EditProfile;