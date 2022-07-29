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
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image style={styles.img} source={{ uri: profile.pic }} />
        </View>
        <Animatable.View animation="fadeIn" style={styles.container2}>
          <View style={{ flexDirection: 'row' }}>
            <Feather
              name="user"
              size={30}
              color={'white'}
              style={styles.icon2}
            />
            <Text style={styles.text}> Name - {profile.name}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Feather
              name="mail"
              size={30}
              color={'white'}
              style={styles.icon}
            />
            <Text style={[styles.text2, { marginLeft: 10 }]}>
              {profile.email}
            </Text>
          </View>
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
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  AI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'purple',
    width: '98%',
    borderRadius: 60,
    alignItems: 'center',
  },
  icon: {
    marginTop: 35,
  },
  icon2: {
    marginTop: 54,
    marginRight: 5,
  },
  img: {
    marginTop: 50,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: 'purple',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 21,
    color: 'white',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
    letterSpacing: 3,
    marginTop: 50,
    padding: 4,
    marginRight: 38,
  },
  text2: {
    fontSize: 21,
    padding: 4,
    color: 'white',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
    letterSpacing: 1,
    marginRight: 39,
    marginTop: 30,
  },
  btn: {
    marginTop: 140,
    marginBottom: 60,
    borderColor: 'white',
    borderWidth: 3,
  },
});
