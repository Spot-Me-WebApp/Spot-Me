import { React, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image, DevSettings } from 'react-native';
import { FormContainer } from '../../Shared/Forms/FormContainer';
import { LeftArrowBtn, RightArrowBtn } from '../../Shared/Forms/Buttons/ArrowButtons';
import axios from 'axios';
import { SERVER_PORT } from '@env';
import * as ImagePicker from 'expo-image-picker';

const { height, width } = Dimensions.get("screen")

const Photos = (props) => {
    const [registerProfilePic, setProfilePic] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const [imageFilename, setImageFilename] = useState("")
    const { username, password, name, dob, bio, expLevel, methods } = props.route.params


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

    const choosePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        })
        //console.log(result.uri.substring(0, 1000))
        if (!result.cancelled) setProfilePic('data:image/jpeg;base64,' + result.base64)
    }

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true
            })
            //console.log(result)
            if (!result.cancelled) setProfilePic('data:image/jpeg;base64,' + result.base64)
        }
    }



    return (
        <View style={styles.container}>
            <FormContainer>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/Spot_Me_Logo.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 34, fontFamily: 'Bodoni 72' }}>Add a Photo of yourself.</Text>
                </View>
                <Button title="Choose From Camera Roll" onPress={choosePhoto}></Button>
                <Button title="Take Photo" onPress={takePhoto}></Button>
                {registerProfilePic && <Image source={{ uri: registerProfilePic }} style={{ height: 200, width: 200 }} />}
                {(imageFilename && imageUrl) && registerUser()}
            </FormContainer>

            <RightArrowBtn onPress={uploadPhoto} style={{ position: 'absolute', bottom: height * .1, right: 30 }} />
            <LeftArrowBtn onPress={() => { props.navigation.goBack() }} style={{ position: 'absolute', bottom: height * .1, left: 30 }} />
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
    logo: {
        width: 180,
        height: 180,
        marginBottom: 40,
        bottom: -40,
        position: "absolute",
    }
});

export default Photos;