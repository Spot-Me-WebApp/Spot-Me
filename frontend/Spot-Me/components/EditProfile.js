import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Button, FlatList } from 'react-native'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import AddImage from '../Shared/Forms/Buttons/AddImage'
import { XCircleBtn } from '../Shared/Forms/Buttons/XCircleBtn'
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import axios from 'axios'
import { SERVER_PORT } from '@env'

const { height, width } = Dimensions.get("screen")

const EditProfile = (props) => {
    const { userData } = props.route.params
    const [Bio, setBio] = useState(userData.bio)
    const [dataSaved, setDataSaved] = useState(false)
    const [Exp, setExp] = useState(userData.expLevel)
    const [Methods, setMethods] = useState([])
    let [boxes, changeBox] = useState(Array(userData.images.length).fill(true, 0, userData.images.length))
    changeBox = (index) => {
        //replace element at boxes[index] to opposite boolean value
        boxes.splice(index, 1, !boxes[index])
        console.log(boxes)
    }
    let [profilePics, setProfilePics] = useState(userData.images.map(img => ({ uri: img.url, position: img.position, isNew: false })))
    const updatePhotoArray = (uri, pos, deleting) => {
        if (!deleting) {
            setProfilePics(profilePics = profilePics.concat({
                uri: uri,
                position: pos,
                isNew: true
            }))
            setPhotoDeleted(!photoDeleted)
            console.log(profilePics.map(p => p.position))
        }
        else {
            const photoToBeDeleted = profilePics.find(element => element.position === pos)
            profilePics.splice(profilePics.indexOf(photoToBeDeleted), 1)
            setPhotoDeleted(!photoDeleted)
            setProfilePics(profilePics);
            console.log(profilePics.map(p => p.position))
        }
    }

    const [photoDeleted, setPhotoDeleted] = useState(false)
    const [uploadedImages, setUploadedImages] = useState(null)

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

    const { showActionSheetWithOptions } = useActionSheet();

    const showDeleteMenu = (deletePhoto, num) => {
        const options = ["Delete", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;
        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            destructiveButtonIndex
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case destructiveButtonIndex:
                    deletePhoto(num);
                    break;
                case cancelButtonIndex:
                    break;
            }
        })
    }

    const deletePhoto = (num) => {
        updatePhotoArray("", num, true);
        changeBox(num);
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
        updatePhotoArray('data:image/jpeg;base64,' + manipResult.base64, num, false);
        changeBox(num);
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

    const takePhoto = async (num) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,

            })
            if (!result.cancelled) resizePhoto(result.uri, num)
        }
    }

    const showUploadMenu = (choosePhoto, takePhoto, num) => {
        const options = ["Choose From Photos", "Open Camera", "Cancel"];
        const cancelButtonIndex = 2
        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case 0:
                    choosePhoto(num)
                    break;
                case 1:
                    takePhoto(num)
                    break;
                case cancelButtonIndex:
                    break;
            }
        })
    }
    //-----------------------------------------------------------------Functions to choose image from library, or open camera-------------------------------------

    const updatePhotos = async () => {
        await axios({
            url: `${SERVER_PORT}/image`,
            method: 'put',
            data: {
                images: profilePics,
                id: userData._id
            }
        })
            .then((response) => {
                const data = JSON.parse(response.request._response);
                setUploadedImages(data)
            })
            .catch((err) => console.log(err))
    }

    const updateUser = async () => {
        if (uploadedImages) {
            const expLevel = Exp.item
            const methods = Methods.map(m => m.item)
            await axios({
                url: `${SERVER_PORT}/edituser`,
                method: 'put',
                data: {
                    bio: Bio,
                    expLevel: expLevel,
                    methods: methods,
                    imageData: uploadedImages,
                    id: userData._id
                },
                withCredentials: true
            }).then((response) => {
                console.log(response.data)
                setDataSaved(!dataSaved)
                props.navigation.navigate("Profile")
            })
                .catch((error) => console.log(error, error.stack))
        }
    }

    useEffect(() => {
        updateUser();
    }, [uploadedImages])

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <ScrollView style={{ backgroundColor: '#202020', flex: 1 }} >
                <View style={{ alignItems: 'flex-start', flex: 1 }}>
                    <Text style={styles.name}>{userData.name}</Text>
                </View>
                <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    {profilePics.some(element => element.position === 0) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            disabled={true}
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            imageSource={profilePics.find(element => element.position === 0)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 0)} style={styles.deleteButton} />}
                        />)
                        : (
                            <AddImage buttonColor="transparent"
                                titleColor="#FFF"
                                title="+"
                                buttonStyle={
                                    styles.imgButton
                                }
                                onPress={() => showUploadMenu(choosePhoto, takePhoto, 0)}
                                textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            />
                        )
                    }
                    {profilePics.some(element => element.position === 1) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            disabled={true}
                            imageSource={profilePics.find(element => element.position === 1)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 1)} style={styles.deleteButton} />}
                        />)
                        : (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            onPress={() => showUploadMenu(choosePhoto, takePhoto, 1)}
                        />)}

                    {profilePics.some(element => element.position === 2) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            disabled={true}
                            imageSource={profilePics.find(element => element.position === 2)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 2)} style={styles.deleteButton} />}
                        />)
                        : (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            onPress={() => showUploadMenu(choosePhoto, takePhoto, 2)}
                        />)}

                    {profilePics.some(element => element.position === 3) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            disabled={true}
                            imageSource={profilePics.find(element => element.position === 3)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 3)} style={styles.deleteButton} />}
                        />)
                        : (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            onPress={() => showUploadMenu(choosePhoto, takePhoto, 3)}
                        />)}

                    {profilePics.some(element => element.position === 4) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            disabled={true}
                            imageSource={profilePics.find(element => element.position === 4)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 4)} style={styles.deleteButton} />}
                        />)
                        : (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            onPress={() => showUploadMenu(choosePhoto, takePhoto, 4)}
                        />)}

                    {profilePics.some(element => element.position === 5) ?
                        (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            disabled={true}
                            imageSource={profilePics.find(element => element.position === 5)}
                            deleteButton={<XCircleBtn onPress={() => showDeleteMenu(deletePhoto, 5)} style={styles.deleteButton} />}
                        />)
                        : (<AddImage buttonColor="transparent"
                            titleColor="#FFF"
                            title="+"
                            buttonStyle={
                                styles.imgButton
                            }
                            textStyle={{ fontSize: 34, fontFamily: 'Bodoni 72' }}
                            onPress={() => showUploadMenu(choosePhoto, takePhoto, 5)}
                        />)}
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
                        inputFilterStyle={{ color: 'white' }}
                    />
                </View>
                <Button title="Save" onPress={updatePhotos} />
                <Button title="Discard" />
            </ScrollView>
        </KeyboardAvoidingView >



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
    },
    imgButton: {
        width: '31.5%',
        height: '39.375%',
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: '#adb5bd',
        borderRadius: 6,
        padding: 3,
        marginHorizontal: 3,
        borderStyle: 'dashed',
    },
    deleteButton: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: -15,
        left: width * .25
    }
})

export default EditProfile;