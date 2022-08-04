import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';

export default function AccountScreen({ user }) {
  const [profile, setProfile] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, []);

  if (!profile) {
    return (
      <ActivityIndicator size={'large'} color="purple" style={styles.AI} />
    );
  }

  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.container}>

        <Image style={styles.img} source={{ uri: profile.pic }} />
      </View>
      <Animatable.View animation="fadeIn" style={styles.container2}>
        <View style={{ borderRadius: 10, paddingHorizontal: '4%', borderColor: 'white', borderWidth: 3, alignContent: 'center', height: '20%', flexDirection: 'row' }}>
          <Feather
            name="user"
            size={30}
            color={'white'}
            style={styles.icon2}
          />
          <Text style={styles.text}> Name:{profile.name}</Text>
        </View>
        <View style={{ height: '1%' }}></View>
        <View style={{ width: '100%', paddingHorizontal: '4%', borderRadius: 10, borderColor: 'white', borderWidth: 3, alignContent: 'center', height: '20%', flexDirection: 'row' }}>
          <Feather
            name="mail"
            size={30}
            color={'white'}
            style={styles.icon}
          />
          <Text style={[styles.text2]}>
            {profile.email}
          </Text>
        </View>
        <View style={{ height: '20%' }}></View>

        <Button
          style={styles.btn}
          mode="contained"
          onPress={() => {
            firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                status: firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                auth().signOut();
              });
          }}>
          Logout
        </Button>

      </Animatable.View>

    </ScrollView >
  );
}
const styles = StyleSheet.create({
  AI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {

    alignItems: 'center',


  },
  container2: {
    borderRadius: 20,
    height: '80%',
    paddingHorizontal: '1%',
    justifyContent: 'center',
    backgroundColor: 'rgba(128,0,128, 0.6)',
    shadowOpacity: 1


  },
  icon: {
    alignSelf: 'center'
  },
  icon2: {

    alignSelf: 'center'
  },
  img: {
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: 'rgba(128,0,128, 1)',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 21,
    color: 'white',

    width: '95%',
    // backgroundColor: 'red',

    borderColor: 'white',
    letterSpacing: 3,

    paddingTop: 20,

  },
  text2: {
    fontSize: 21,

    color: 'white',

    width: '95%',

    borderColor: 'white',
    letterSpacing: 3,
    paddingLeft: 10,

    paddingTop: 20,
    // backgroundColor: 'red'

  },
  btn: {
    width: '100%',
    borderColor: 'white',
    borderWidth: 3,
  },
});
