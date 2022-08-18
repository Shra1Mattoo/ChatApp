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
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader/Loader';
import messaging from '@react-native-firebase/messaging';
import IMAGE_PATHS from '../utility/ImagePaths';
import Snackbar from 'react-native-snackbar';
import COLORS from '../theme/Colors';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);



  /////////////////////////////////User-Signup/////////////////////////////////////////
  const userSignup = async () => {

    setLoading(true);
    if (!email || !password || !image || !name) {
      setLoading(false);
      Snackbar.show({
        text: 'Required to fill all the fields',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'purple'
      });
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
      });
      messaging()
        .getToken()
        .then(token => {
          firestore().collection('usertoken').add({
            token: token,
          });
        });

      setLoading(false);
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'purple'
      });
    }
  };

  ///////////////////////////////////Photo-Upload-Libraray//////////////////////////////

  const pickImageAndUpload = () => {
    launchImageLibrary({ quality: 0.5 }, fileobj => {
      // fileobj.didCancel(

      //   Snackbar.show({
      //     text: 'upload cancel',
      //     duration: Snackbar.LENGTH_SHORT,
      //     backgroundColor: 'purple'
      //   })
      // )
      // console.log(fileobj);
      setLoading(true)
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(fileobj.assets[0].uri);
      uploadTask.on(

        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // if (progress == 100) alert(progress);
          // else {
          // console.log('uploading')
          // },

        },
        error => {

          error().alert('error uploading image');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setImage(downloadURL);
          });
          setLoading(false);
        },
      );
    });
  };
  //////////////////////////////////////////////end///////////////////////////////////////////////
  return (
    <>


      <ScrollView style={{ height: '100%', backgroundColor: COLORS.White }} scrollEnabled={false}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Signup Here!</Text>
          <Image
            style={styles.logo}
            source={IMAGE_PATHS.Logo}></Image>
        </View>
        <View style={styles.mainContainer}>
          {!showNext && (
            <>
              <TextInput
                label={'Email'}
                value={email}
                mode="outlined"
                onChangeText={text => setEmail(text)}>
              </TextInput>

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
            </>
          )}
          {showNext ? (
            <>
              <TextInput
                label={'Name'}
                value={name}
                mode="outlined"
                onChangeText={text => setName(text)}></TextInput>

              <Button mode="contained" onPress={() => pickImageAndUpload()}>
                Select profile pic
              </Button>
              <Button
                mode="contained"
                disabled={image ? false : true}
                onPress={() => {
                  userSignup();
                }}>
                SignUp
              </Button>
            </>
          ) : (
            <Button mode="contained" onPress={() => setShowNext(true)}>
              Next
            </Button>
          )}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerText}>Already have an account ?</Text>
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
    // height: heightPercentageoDP(35),
    textAlign: 'center',
    color: COLORS.Black,
  },
});
