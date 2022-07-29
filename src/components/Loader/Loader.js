import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Modal,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Loader({ loading }) {
  return (
    <Modal
      style={{ width: windowWidth, height: windowHeight }}
      transparent
      animationType={'fade'}
      visible={loading}>
      <View style={styles.container}>
        <ActivityIndicator color="white" size="large" animating={loading} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
