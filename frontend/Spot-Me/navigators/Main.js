// Navigation bar on bottom of screen
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Icon } from "react-native-vector-icons/FontAwesome";
import Meet from "../components/Meet";
import Schedule from "../components/Schedule";
import Chat from "../components/Chat";
import Profile from "../components/Profile";

const Tab = createBottomTabNavigator();

const Main = () => {

    return (
        <Tab.Navigator
            initialRouteName="Profile"
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
                component={Meet}
                options = {{ headerShown: false}}
            // options={{
            //     tabBarIcon: ({ color }) => (
            //         <Icon
            //             name="fa-solid fa-dumbbell"
            //             style={{ position: "relative" }}
            //             color={color}
            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen
                name="Schedule"
                component={Schedule}
                options = {{ headerShown: false}}
            // options={{
            //     tabBarIcon: ({ color }) => (
            //         <Icon
            //             name="fa-solid fa-calendar-days"
            //             style={{ position: "relative" }}
            //             color={color}
            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen
                name="Chat"
                component={Chat}
                options = {{ headerShown: false}}
            // options={{
            //     tabBarIcon: ({ color }) => (
            //         <Icon
            //             name="fa-solid fa-messages"
            //             style={{ position: "relative" }}
            //             color={color}
            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options = {{ headerShown: false}}
            // options={{
            //     tabBarIcon: ({ color }) => (
            //         <Icon
            //             name="fa-solid fa-user"
            //             style={{ position: "relative" }}
            //             color={color}
            //             size={30}
            //         />
            //     )
            // }}
            />


        </Tab.Navigator>
    )
}

export default Main;