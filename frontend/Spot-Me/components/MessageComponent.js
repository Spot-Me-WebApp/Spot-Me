import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function MessageComponent({ item, user }) {

    //STATUS IS TRUE IF THE MESSAGE WAS NOT SENT BY THE CURRENT USER
    const status = item.user.username !== user.username;

    return (
        //other user has their image to the left of their messages, current user has their image to the right of their messages
        <View>
            {status ? (
                <View
                    style={styles.mmessageWrapper}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={{ uri: item.user.profilePic }} style={{ height: 40, width: 40, borderRadius: 40 * 0.5, marginRight: 5 }} />
                        <View
                            style={
                                status
                                    ? styles.mmessage
                                    : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                            }
                        >
                            <Text>{item.text}</Text>
                        </View>
                    </View>
                    <Text style={{ marginLeft: 40, color: 'white' }}>{item.time}</Text>
                </View>
            ) : (
                <View
                    style={[styles.mmessageWrapper, { alignItems: "flex-end" }]}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                            style={
                                status
                                    ? styles.mmessage
                                    : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                            }
                        >
                            <Text>{item.text}</Text>
                        </View>
                        <Image source={{ uri: item.user.profilePic }} style={{ height: 40, width: 40, borderRadius: 40 * 0.5, marginLeft: 5 }} />
                    </View>
                    <Text style={{ marginRight: 40, color: 'white' }}>{item.time}</Text>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    mmessageWrapper: {
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
    mavatar: {
        marginRight: 5
    }
})