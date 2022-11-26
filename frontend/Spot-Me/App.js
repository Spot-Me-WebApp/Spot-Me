import { React, useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import axios from 'axios'
import { SERVER_PORT } from '@env'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import RootNavigator from './navigators/RootNavigator';
import { LoginContext, CardStackContext } from './components/Contexts';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [cardStack, setCardStack] = useState(null);


  // if (loggedIn) {
  //   console.log(cardStack)
  // }

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      <CardStackContext.Provider value={{ cardStack, setCardStack }}>
        <NavigationContainer theme={DarkTheme}>
          <ActionSheetProvider>
            <RootNavigator></RootNavigator>
          </ActionSheetProvider>
        </NavigationContainer>
      </CardStackContext.Provider>
    </LoginContext.Provider>
  )
}
