import { View, Text, shadowOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import ImgToBase64 from 'react-native-image-base64';

export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;
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
  const getAllMessages = async () => {
    const allmsg = querySanp.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };

  useEffect(() => {
    // getAllMessages();

    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        // console.log(docSnap.data().createdAt.toDate());
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const onSend = messageArray => {
    sendNoti();
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() });
  };
  const sendNoti = () => {
    firestore()
      .collection('usertoken')
      .get()
      .then(querySnap => {
        const userDeviceToken = querySnap.docs.map(docSnap => {
          return docSnap.data().token;
        });
        console.log(userDeviceToken);
        fetch('https://77e3-115-111-242-66.ngrok.io/send-noti', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokens: userDeviceToken,
          }),
        });
      });
  };

  /////////////////open gallery/////////////
  const openGallery = () => {
    launchImageLibrary('photo', response => {
      ImgToBase64.getBase64String(response.assets[0].uri)
        .then(async base64String => {
          const uid = await AsyncStorage.getItem('UID');
          let source = 'data:image/jpeg;base64,' + base64String;
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, mymsg, source),
          );
          const docid =
            uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;

          firestore()
            .collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() });
        })
        .catch(err => {
          err;
        });
    });
  };

  ///////////////////////////////////Photo-Upload-Libraray//////////////////////////////

  const pickImageAndUpload = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setImageSource(response.uri);
      }
    });

  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View>
        <Image
          style={{
            marginTop: 10,
            width: 100,
            height: 100,
            borderRadius: 50,
            alignSelf: 'center',
            borderWidth: 3,
            borderColor: 'purple',
            backgroundColor: 'white',
          }}
          source={{ uri: profile.pic }}
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'purple',
                  shadowOpacity: 0.6,
                  opacity: 0.9,
                  right: 2,
                },
                left: {
                  shadowOpacity: 0.1,
                  right: 35,
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{ borderTopWidth: 1, borderTopColor: 'purple' }}
              textInputStyle={{ color: 'black' }}
              onPressActionButton={() => pickImageAndUpload()}
            />
          );
        }}
      />
    </View>
  );
}
