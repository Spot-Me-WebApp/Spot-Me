import React, { useLayoutEffect, useEffect, useState, useContext, useRef } from "react";
import { View, TextInput, Text, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import MessageComponent from "./MessageComponent";
import socket from "../utils/socket";
import { UserDataContext } from "./Contexts";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("screen")

const Messaging = (props) => {
    const { userData } = useContext(UserDataContext)
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Access the chatroom's name and id
    const { name, _id } = props.route.params.item;
    const navigation = useNavigation()

    // Sets the header title to the name chatroom's name and find messages for this room from backend
    useLayoutEffect(() => {
        if (name.includes(userData.name)) {
            if (name.indexOf(userData.name) < name.indexOf('&')) {
                props.navigation.setOptions({ title: name.replace(`${userData.name} & `, "") })
            } else {
                props.navigation.setOptions({ title: name.replace(` & ${userData.name}`, "") })
            }
        }
        else {
            props.navigation.setOptions({ title: name })
        }
        socket.emit("findRoom", _id);
        socket.on("foundRoom", (roomMessages) => setChatMessages(roomMessages))
    }, []);

    //Update messages
    useEffect(() => {
        socket.on("foundRoom", (roomMessages) => setChatMessages(roomMessages));
    }, [socket])



    const flatListRef = useRef(null)
    /* 
        This function gets the time the user sends a message, then 
        logs the username, message, and the timestamp to the console.
     */
    const handleNewMessage = () => {
        if (message && message.trim()) {
            socket.emit("newMessage", {
                message: message.trim(),
                room_id: _id,
                user: userData._id,
                timestamp: new Date()
            })
        }
    };



    return (
        <KeyboardAvoidingView style={[styles.messagingscreen]} behavior='padding' keyboardVerticalOffset={height * .1}>
            <View
                style={[
                    styles.messagingscreen,
                    { paddingVertical: 15, paddingHorizontal: 10 },
                ]}
            >
                {chatMessages[0] ? (
                    <FlatList
                        ref={flatListRef}
                        inverted={true}
                        data={[...chatMessages].reverse()}
                        renderItem={({ item }) => (
                            <MessageComponent item={item} user={userData} navigation={navigation} />
                        )}
                        keyExtractor={(item) => item._id}
                    />
                ) : (
                    ""
                )}
            </View>

            <View style={styles.messaginginputContainer}>
                <TextInput
                    style={styles.messaginginput}
                    onChangeText={(value) => setMessage(value)}
                    value={message}
                />
                <Pressable
                    style={styles.messagingbuttonContainer}
                    onPress={() => {
                        handleNewMessage();
                        setMessage("")
                        if (chatMessages.length > 0) {
                            flatListRef.current.scrollToIndex({ animating: true, index: 0 })
                        }
                    }}
                >
                    <View>
                        <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
                    </View>
                </Pressable>
            </View>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    messagingscreen: {
        flex: 1,
        backgroundColor: '#202020'
    },
    messaginginputContainer: {
        width: "100%",
        minHeight: height * .13,
        backgroundColor: "#202020",
        paddingVertical: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
        flexDirection: "row",
        borderTopWidth: 1,
    },
    messaginginput: {
        borderWidth: 1,
        padding: 5,
        flex: 1,
        marginRight: 10,
        borderRadius: 20,
        color: 'white'
    },
    messagingbuttonContainer: {
        width: "30%",
        backgroundColor: "green",
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    }, mmessageWrapper: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    mmessage: {
        maxWidth: "50%",
        backgroundColor: "#f5ccc2",
        padding: 15,
        borderRadius: 10,
        marginBottom: 2,
    },
    mvatar: {
        marginRight: 5,
    },
})

export default Messaging;