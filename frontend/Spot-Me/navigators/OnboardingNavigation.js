import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LandingPage from "../components/LandingPage"
import Register from "../components/Registration/UsernamePassword"
import NameDOB from "../components/Registration/NameDOB"
import Bio from "../components/Registration/Bio"
import ExperienceLvlMethods from "../components/Registration/ExperienceLvlMethods"
import Login from "../components/Login"
import Profile from "../components/Profile"
import Meet from "../components/Meet"

const Stack = createNativeStackNavigator();

function OnboardingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Landing"
                component={LandingPage}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="NameDOB"
                component={NameDOB}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Bio"
                component={Bio}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="ExperienceLvlMethods"
                component={ExperienceLvlMethods}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Meet"
                component={Meet}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function OnboardingNavigation() {
    return <OnboardingStack />
}