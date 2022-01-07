import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const BackButton = props => {
  console.log(props.goBack);
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.goBack()}>
      <AntDesignIcon name="arrowleft" size={26} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
  },
});

export default BackButton;
