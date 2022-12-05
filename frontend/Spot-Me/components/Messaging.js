import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import { View, TextInput, Text, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import MessageComponent from "./MessageComponent";
import socket from "../utils/socket";
import { UserDataContext } from "./Contexts";
const { height, width } = Dimensions.get("screen")

const Messaging = (props) => {
    const { userData } = useContext(UserDataContext)
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState({ username: userData.username, profilePic: userData.images[0].url });

    // Access the chatroom's name and id
    const { name, id } = props.route.params;


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
        socket.emit("findRoom", id);
        socket.on("foundRoom", (roomMessages) => setChatMessages(roomMessages))
    }, []);

    //Update messages
    useEffect(() => {
        socket.on("foundRoom", (roomMessages) => setChatMessages(roomMessages));
    }, [socket])

    /* 
        This function gets the time the user sends a message, then 
        logs the username, message, and the timestamp to the console.
     */
    const handleNewMessage = () => {
        const hour =
            new Date().getHours() < 10
                ? `0${new Date().getHours()}`
                : `${new Date().getHours()}`;

        const mins =
            new Date().getMinutes() < 10
                ? `0${new Date().getMinutes()}`
                : `${new Date().getMinutes()}`;

        socket.emit("newMessage", {
            message,
            room_id: id,
            user,
            timestamp: { hour, mins }
        })
    };

    return (
        <KeyboardAvoidingView style={[styles.messagingscreen, { paddingTop: height * .025 }]} behavior='height' keyboardVerticalOffset={height * .1}>
            <View
                style={[
                    styles.messagingscreen,
                    { paddingVertical: 15, paddingHorizontal: 10 },
                ]}
            >
                {chatMessages[0] ? (
                    <FlatList
                        data={chatMessages}
                        renderItem={({ item }) => (
                            <MessageComponent item={item} user={user} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    ""
                )}
            </View>

            <View style={styles.messaginginputContainer}>
                <TextInput
                    style={styles.messaginginput}
                    onChangeText={(value) => setMessage(value)}
                />
                <Pressable
                    style={styles.messagingbuttonContainer}
                    onPress={handleNewMessage}
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