import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const ForwardButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.goForward()}>
      <AntDesignIcon name="arrowright" size={26} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
  },
});

export default ForwardButton;
