//Fifth step of registration process
import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image, DevSettings } from 'react-native';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
import axios from 'axios';
import { SERVER_PORT } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import AddImage from '../../Shared/Forms/Buttons/AddImage';

const { height, width } = Dimensions.get("screen")



const Photos = (props) => {
    //FOR TESTING PURPOSES, CAN REMOVE LATER
    useEffect(() => {
        function goNext() {
            props.navigation.navigate("ChooseGym")
        }
        goNext()
    }, [])


    const [boxes, setBoxes] = useState([false, false, false, false, false, false])
    const changeBox = (index) => {
        setBoxes(boxes[index] = !boxes[index])
        console.log(boxes)
    }
    const [registerProfilePics, setProfilePics] = useState([])
    const updatePhotoArray = (uri, pos) => {
        setProfilePics(registerProfilePics.concat({
            uri: uri,
            position: pos
        }))
        console.log(registerProfilePics.map(p => p.position))
    }
    const [imageUrl, setImageUrl] = useState("")
    const [imageFilename, setImageFilename] = useState("")
    const { username, password, name, dob, bio, expLevel, methods } = props.route.params

    //Send inputted photos to backend
    const uploadPhoto = async () => {
        await axios({
            url: `${SERVER_PORT}/image`,
            method: 'post',
            data: {
                image: registerProfilePic
            }
        })
            .then((response) => {
                const data = JSON.parse(response.request._response);
                setImageUrl(data.url)
                setImageFilename(data.filename)
            })
            .catch((err) => console.log(err, err.stack))
    }

    const resizePhoto = async (imageUri, num) => {
        const manipResult = await manipulateAsync(
            imageUri,
            [{
                resize: {
                    height: 1350,
                    width: 1080
                }
            }],
            { base64: true }
        )
        updatePhotoArray('data:image/jpeg;base64,' + manipResult.base64, num);
        changeBox(num);
    }

    const registerUser = async () => {
        if (imageUrl && imageFilename) {
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
                    image: {
                        url: imageUrl,
                        filename: imageFilename
                    }
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
        await axios({
            url: `${SERVER_PORT}/login`,
            method: 'post',
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }).then((response) => {
            DevSettings.reload()
        })
            .catch((error) => console.log(error, error.stack))
    }
    //-----------------------------------------------------------------Functions to choose image from library, or open camera-------------------------------------
    const choosePhoto = async (num) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.cancelled) resizePhoto(result.uri, num)
    }

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,

            })
            if (!result.cancelled) resizePhoto(result.uri)
        }
    }
    //-----------------------------------------------------------------Functions to choose image from library, or open camera-------------------------------------


    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10, marginBottom: 20 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Add Photos of Yourself.</Text>
            </View>
            <View style={styles.imageContainer}>
                {boxes[0] ?
                    (<AddImage buttonColor="transparent"
                        titleColor="#000"
                        title="+"
                        buttonStyle={
                            styles.button
                        }
                        textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                        onPress={() => choosePhoto(0)}
                        imageSource={registerProfilePics.find(element => element.position === 0)}
                    />)
                    : (<AddImage buttonColor="transparent"
                        titleColor="#000"
                        title="+"
                        buttonStyle={
                            styles.button
                        }
                        textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                        onPress={() => choosePhoto(0)}
                    />)}
                <AddImage buttonColor="transparent"
                    titleColor="#000"
                    title="+"
                    buttonStyle={
                        styles.button
                    }
                    textStyle={{ fontSize: 30, fontFamily: 'Bodoni 72' }}
                    onPress={() => choosePhoto(1)} />
                <AddImage buttonColor="transparent"
                    titleColor="#000"
                    title="+"
                    buttonStyle={
                        styles.button
                    }
                    textStyle={{ fontSize: 30, fontFamily: 'Bodoni 72' }}
                    onPress={() => choosePhoto(2)} />
                <AddImage buttonColor="transparent"
                    titleColor="#000"
                    title="+"
                    buttonStyle={
                        styles.button
                    }
                    textStyle={{ fontSize: 30, fontFamily: 'Bodoni 72' }}
                    onPress={() => choosePhoto(3)} />
                <AddImage buttonColor="transparent"
                    titleColor="#000"
                    title="+"
                    buttonStyle={
                        styles.button
                    }
                    textStyle={{ fontSize: 30, fontFamily: 'Bodoni 72' }}
                    onPress={() => choosePhoto(4)} />
                <AddImage buttonColor="transparent"
                    titleColor="#000"
                    title="+"
                    buttonStyle={
                        styles.button
                    }
                    textStyle={{ fontSize: 30, fontFamily: 'Bodoni 72' }}
                    onPress={() => choosePhoto(5)} />
            </View>
            {/* <Button title="Choose From Camera Roll" onPress={choosePhoto}></Button>
                <Button title="Take Photo" onPress={takePhoto}></Button> */}
            {/* {registerProfilePics.length > 0 ? (<Image source={{ uri: registerProfilePics[0].uri }} style={{ height: 200, width: 200 }} />) : null} */}
            {(imageFilename && imageUrl) && registerUser()}

            <RightArrowBtn onPress={uploadPhoto} style={{ position: 'absolute', bottom: height * .07, right: 30 }} />
            <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: height * .07, left: 30 }} />
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
    imageContainer: {
        height: '60%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        width: '31.5%',
        height: '39.375%',
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: '#adb5bd',
        borderRadius: 6,
        padding: 3,
        marginHorizontal: 3,
        borderStyle: 'dashed',

    }
});

export default Photos;