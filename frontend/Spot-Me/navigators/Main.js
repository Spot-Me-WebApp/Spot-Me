// Navigation bar on bottom of screen
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Icon } from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

const Main = () => {

    return (
        <Tab.Navigator
            initialRouteName="Meet"
            screenOptions={{
                "tabBarHideOnKeyboard": true,
                "tabBarShowLabel": false,
                "tabBarActiveTintColor": '#A09F9A',
                "tabBarStyle": [
                    {
                        "display": "flex"
                    },
                    null
                ]
            }}
        >
            <Tab.Screen
                name="Meet"

                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name="fa-solid fa-dumbbell"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Schedule"

                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name="fa-solid fa-calendar-days"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Chat"

                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name="fa-solid fa-messages"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"

                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name="fa-solid fa-user"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    )
                }}
            />


        </Tab.Navigator>
    )
}

export default Main;