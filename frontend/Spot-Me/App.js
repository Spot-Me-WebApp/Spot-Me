import { StatusBar } from 'expo-status-bar';
import { React, useEffect, useState } from 'react';
import { DevSettings, Text, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import axios from 'axios'
import { SERVER_PORT } from '@env'


import OnboardingNavigation from './navigators/OnboardingNavigation';
import Main from './navigators/Main';
import BottomTabs from './navigators/BottomTabs';

export default function App() {

  const [userData, setUserData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  //Check if a user's logged in. if they are, the backend sends their data.
  useEffect(() => {
    async function fetchData() {
      await axios({
        url: `${SERVER_PORT}/isLoggedIn`,
        withCredentials: true
      })
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            setUserData(response.data);
          }
        })
        .catch((error) => console.log(error));
    }
    fetchData();
  }, [])

  useEffect(() => {
    function changeLoginStatus() {
      //If the user has logged in
      if (!isLoggedIn && typeof userData !== "string") {
        setIsLoggedIn(true)
        //If user is logging out
      } else if (isLoggedIn && typeof userData === "string") {
        setIsLoggedIn(false)
      }
    }
    changeLoginStatus()
  }, [userData])


  //If user logged in use BottomTabs navigation, else, use OnboardingNavigation
  return (
    <NavigationContainer theme={DarkTheme}>
      {/* {isLoggedIn ? (
        <BottomTabs></BottomTabs>
      ) : (
        <OnboardingNavigation></OnboardingNavigation>
      )} */}
      <OnboardingNavigation></OnboardingNavigation>
    </NavigationContainer>
  )
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