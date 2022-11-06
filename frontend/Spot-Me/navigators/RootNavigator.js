// Root Navigator
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import OnboardingNavigation from "./OnboardingNavigation";
import BottomTabs from "./BottomTabs";

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
        </Stack.Navigator>
    )
}

export default RootNavigator;