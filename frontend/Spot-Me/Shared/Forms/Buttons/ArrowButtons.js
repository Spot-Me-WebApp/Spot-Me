import React from "react";
import { TouchableHighlight, View } from "react-native";
import { RightArrow, LeftArrow } from "../../Svg";

export const RightArrowBtn = (props) => {
    return (
        <TouchableHighlight onPress={props.onPress} style={props.style}>
            <View>
                <RightArrow />
            </View>
        </TouchableHighlight>
    )
}

export const LeftArrowBtn = (props) => {
    return (
        <TouchableHighlight onPress={props.onPress} style={props.style}>
            <View>
                <LeftArrow />
            </View>
        </TouchableHighlight>
    )
}
