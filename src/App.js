import React, {useState, useEffect} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {StatusBar, StyleSheet, SafeAreaView} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import HomeScreen from './screens/HomeScreen';

import ChatScreen from './screens/ChatScreen';
import AccountScreen from './screens/AccountScreen';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'purple',
  },
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState('');

  const requestPermission = async () => {
    await messaging().requestPermission({
      sound: true,
      badge: true,
      provisional: true,
    });
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    const token = await messaging().getToken();
    console.log(token);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) setUser(userExist);
      else setUser('');
    });
    return () => {
      unregister();
    };
  }, []);
  // useEffect(() => {
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log(token);
  //     });
  // }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'purple',
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                // headerRight: () => (
                //   <MaterialIcons
                //     name="account-circle"
                //     size={34}
                //     color={'purple'}
                //     style={{marginRight: 1}}
                //     onPress={() =>
                //       firestore()
                //         .collection('users')
                //         .doc(user.uid)
                //         .update({
                //           status: firestore.FieldValue.serverTimestamp(),
                //         })
                //         .then(() => {
                //           auth().signOut();
                //         })
                //     }
                //   />
                // ),
                title: 'ChatApp',
              }}>
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="chat"
              options={({route}) => ({title: route.params.name})}>
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {props => <AccountScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor={'purple'} />
        <SafeAreaView style={styles.container}>
          <Navigation />
        </SafeAreaView>
      </PaperProvider>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default App;
