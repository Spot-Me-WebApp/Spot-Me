import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UserDataContext } from "./Contexts";


const ChatComponent = (props) => {
    const { item } = props;
    const [messages, setMessages] = useState({});
    const { userData } = useContext(UserDataContext)
    // Retrieves the last message in the array from the item prop
    useLayoutEffect(() => {
        setMessages(item.messages[item.messages.length - 1]);
    }, []);

    /// Navigates to the Messaging screen
    // const handleNavigation = () => {
    //     navigate("Messaging", {
    //         id: item.id,
    //         name: item.name,
    //     });
    // };

    return (
        <Pressable style={styles.cchat} onPress={props.onPress}>
            <Ionicons
                name='person-circle-outline'
                size={45}
                color='black'
                style={styles.cavatar}
            />

            <View style={styles.crightContainer}>
                <View>
                    {item.name.includes(userData.name) ? (
                        item.name.indexOf(userData.name) < item.name.indexOf('&') ? (
                            <Text style={styles.cusername}>{item.name.replace(`${userData.name} & `, "")}</Text>
                        ) :
                            (
                                <Text style={styles.cusername}>{item.name.replace(` & ${userData.name}`, "")}</Text>
                            )
                    ) : (
                        <Text style={styles.cusername}>{item.name}</Text>
                    )}


                    <Text style={styles.cmessage}>
                        {messages?.text ? messages.text : "Tap to start chatting"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.ctime}>
                        {messages?.time ? messages.time : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cchat: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        height: 80,
        marginBottom: 10,
    },
    cavatar: {
        marginRight: 15,
    },
    cusername: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "bold",
    },
    cmessage: {
        fontSize: 14,
        opacity: 0.7,
    },
    crightContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
    ctime: {
        opacity: 0.5,
    },
});

export default ChatComponent;