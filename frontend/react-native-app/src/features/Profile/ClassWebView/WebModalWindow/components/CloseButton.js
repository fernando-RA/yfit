import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CloseButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onClose}
      style={styles.button}>
      <MaterialIcons name="close" size={26} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
  },
});

export default CloseButton;
