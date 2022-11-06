import React from "react";
import { Pressable, View } from "react-native";
import { XCircle } from "../../Svg";

export const XCircleBtn = (props) => {
    return (
        <Pressable onPress={props.onPress} style={props.style}>
            <View>
                <XCircle />
            </View>
        </Pressable>
    )
}