import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingNavigation from './navigators/OnboardingNavigation';
import Main from './navigators/Main';
import BottomTabs from './navigators/BottomTabs';



export default function App() {
  return (
    <NavigationContainer>
      <OnboardingNavigation></OnboardingNavigation>
      {/* <BottomTabs /> */}
    </NavigationContainer>

  );
}


/*
const backgroundImage = {uri: 'https://wallpaperaccess.com/full/2581402.jpg'};
const Stack = createStackNavigator();

function WelcomeScreen({navigation}){
  return(
    <View style={styles.container}>
    <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.image}>
      <Text style={styles.titleText}>Spot Me</Text>
      <Text style={styles.bodyText}>Welcome!</Text>
      <StatusBar style="auto"/>
    <View style={styles.fixToText}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          color="#808080"
        />
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
          color="#808080"
        />
    </View>
    </ImageBackground>
    </View>
  );
}

function LoginScreen({navigation}){
  return(
    <View>
    <Text style={styles.titleText}>Login Screen</Text>
  </View>
  );
}

function SignUpScreen({navigation}){
  return(
    <View>
      <Text style={styles.titleText}>Sign Up Screen</Text>
    </View>
  );
}

function MyStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
    </Stack.Navigator>
  )
}

export default function App(){
  return (
    <NavigationContainer>
    <MyStack/>
    </NavigationContainer>
  );
}
/*
<View style={styles.container}>
    <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.image}>
      <Text style={styles.titleText}>Spot Me</Text>
      <Text style={styles.bodyText}>Welcome!</Text>
      <StatusBar style="auto"/>
    <View style={styles.fixToText}>
        <Button
          title="Login"
          onPress={() => Alert.alert('Login button')}
          color="#808080"
        />
        <Button
          title="Sign Up"
          onPress={() => Alert.alert('Sign up button')}
          color="#808080"
        />
    </View>
    </ImageBackground>
    </View>
    
const styles = StyleSheet.create({
  titleText:{
    fontSize: 40,
    textAlign: 'center',
    color: '#fff'
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 35,
    color: 'orange',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
*/