import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader/Loader';
import IMAGE_PATHS from '../utility/ImagePaths';
import Snackbar from 'react-native-snackbar';
import COLORS from '../theme/Colors';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);



  /////////////////////////////////User-Login/////////////////////////////////////////
  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      Snackbar.show({
        text: 'Required to fill all the fields',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'purple'
      });
      setLoading(false);
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);

      setLoading(false);
    } catch (err) {
      Snackbar.show({
        text: "Something went wrong",
        backgroundColor: 'purple',
        duration: Snackbar.LENGTH_SHORT,
      });
      setLoading(false);

    }
  };

  return (<>

    <ScrollView style={{ height: '100%', backgroundColor: COLORS.White }} scrollEnabled={false}>


      <View style={styles.headerView}>
        <Text style={styles.headerText}>Welcome to ChatApp</Text>
        <Image
          style={styles.logo}
          source={IMAGE_PATHS.Logo}></Image>
      </View>
      <View style={styles.mainContainer}>
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


    </ScrollView>

    <Loader loading={loading} />
  </>
  );
}
const styles = StyleSheet.create({
  headerText: {
    fontSize: 22,
    color: 'purple',
    margin: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  headerView: {
    alignItems: 'center',
  },
  mainContainer: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    height: heightPercentageToDP(30),
  },
  footerText: {
    // height: heightPercentageToDP(11),
    textAlign: 'center',
    color: COLORS.Black,
    // backgroundColor: "red"
  },

});
