import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-vector-icons/FontAwesome";
import Meet from "../components/Meet";
import Schedule from "../components/Schedule";
import Chat from "../components/Chat";
import Profile from "../components/Profile";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
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
            <Tab.Screen name="Meet" component={Meet}
            // options={{
            //     tabBarIcon: () => (
            //         <Icon
            //             name="fa-solid fa-dumbbell"
            //             style={{ position: "relative" }}

            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen name="Schedule" component={Schedule}
            // options={{
            //     tabBarIcon: () => (
            //         <Icon
            //             name="fa-solid fa-calendar-days"
            //             style={{ position: "relative" }}

            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen name="Chat" component={Chat}
            // options={{
            //     tabBarIcon: () => (
            //         <Icon
            //             name="fa-solid fa-messages"
            //             style={{ position: "relative" }}

            //             size={30}
            //         />
            //     )
            // }}
            />
            <Tab.Screen name="Profile" component={Profile}
            // options={{
            //     tabBarIcon: () => (
            //         <Icon
            //             name="fa-solid fa-user"
            //             style={{ position: "relative" }}

            //             size={30}
            //         />
            //     )
            // }}
            />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default BottomTabs;

