import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';
import Loader from '../components/Loader/Loader';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);



  /////////////////////////////////User-Login/////////////////////////////////////////
  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      alert('please add all the fields');
      setLoading(false);
      navigation.navigate(Login);
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);

      setLoading(false);
    } catch (err) {
      alert('something went wrong');
      setLoading(false);
      navigation.navigate(Login);
    }
  };

  return (<>
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView behavior="position">

          <View style={styles.box1}>
            <Text style={styles.text}>Welcome to ChatApp</Text>
            <Image
              style={styles.img}
              source={require('../assets/logo.jpeg')}></Image>
          </View>
          <View style={styles.box2}>
            <TextInput
              label={'Email'}
              value={email}
              mode="outlined"
              onChangeText={text => setEmail(text)}></TextInput>

            <TextInput
              label={'Password'}
              value={password}
              secureTextEntry={passwordVisible}
              mode="outlined"
              right={
                <TextInput.Icon
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              onChangeText={text => setPassword(text)}></TextInput>

            <Button
              mode="contained"
              onPress={() => {
                userLogin();
              }}>
              Login
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerText}>Don't have an account ?</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
    <Loader loading={loading} />
  </>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: 'purple',
    margin: 10,
  },
  img: {
    width: 200,
    height: 200,
  },
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    height: '50%',
  },
  footerText: {
    textAlign: 'center',
  },
  AI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
