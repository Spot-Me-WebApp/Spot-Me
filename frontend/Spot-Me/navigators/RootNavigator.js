// Root Navigator
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import OnboardingNavigation from "./OnboardingNavigation";
import BottomTabs from "./BottomTabs";
import Messaging from "../components/Messaging";
import OtherProfile from "../components/OtherProfile";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingNavigation}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BottomTabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Messaging"
                component={Messaging}
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="OtherProfile"
                component={OtherProfile}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#202020' },
                    headerTitleStyle: { color: 'transparent' }
                }}

            />
        </Stack.Navigator>
    )
}

export default RootNavigator;