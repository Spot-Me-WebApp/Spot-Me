import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function MessageComponent({ item, user }) {
    const status = item.user !== user;

    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                        name='person-circle-outline'
                        size={30}
                        color='white'
                        style={styles.mavatar}
                    />
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