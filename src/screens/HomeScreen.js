import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

import {FAB} from 'react-native-paper';

export default function HomeScreen({user, navigation}) {
  const [users, setUsers] = useState(null);

  const getUsers = async () => {
    // console.log(user);
    const querySanp = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allusers = querySanp.docs.map(docSnap => docSnap.data());
    // console.log(allusers);
    setUsers(allusers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('chat', {name: item.name, uid: item.uid})
        }>
        <View style={styles.mycard}>
          <Image source={{uri: item.pic}} style={styles.img} />

          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={users}
        renderItem={({item}) => {
          return <RenderCard item={item} />;
        }}
        keyExtractor={item => item.uid}
      />
      <FAB
        style={styles.fab}
        icon="face-recognition"
        color={'purple'}
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'purple',
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: 'row',
    margin: 3,
    padding: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    backgroundColor: 'white',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
