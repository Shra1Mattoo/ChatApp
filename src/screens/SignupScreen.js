import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader/Loader';
import messaging from '@react-native-firebase/messaging';

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
      alert('please add all the fields');
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
    } catch (err) {
      alert('something went wrong');
    }
  };

  ///////////////////////////////////Photo-Upload-Libraray//////////////////////////////

  const pickImageAndUpload = () => {
    launchImageLibrary({ quality: 0.5 }, fileobj => {
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
      <KeyboardAvoidingWrapper>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.box1}>
              <Text style={styles.text}>Signup Here!</Text>
              <Image
                style={styles.img}
                source={require('../assets/logo.jpeg')}></Image>
            </View>
            <View style={styles.box2}>
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
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
