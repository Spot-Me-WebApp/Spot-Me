import React from 'react'
import { View, Text, StyleSheet, StatusBar, Image, ScrollView } from 'react-native'

const EditProfile = (props) => {
    const { userData } = props.route.params

    return (
        <ScrollView style={{ backgroundColor: '#202020' }}>
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
                <View style={{ marginLeft: 25, marginTop: 15 }}>
                    <Text style={styles.bio}>Date of Birth: {userData.dob.substr(0, 10)}</Text>
                    <Text style={styles.bio}>Bio: {userData.bio}</Text>
                    <Text style={styles.bio}>Experience Level: {userData.expLevel}</Text>
                    <Text style={styles.bio}>Passions:</Text>
                    {(userData.methods.map(method => {
                        return (
                            <Text style={styles.bio}>   {method}</Text>
                        )
                    }))}
                </View>
            </View>
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