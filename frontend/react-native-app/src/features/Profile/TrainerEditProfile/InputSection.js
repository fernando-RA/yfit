import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const InputSection = props => {
  const styles = stylesFunc(props);
  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <Text>{props.title}</Text>
      </View>
      {props.children}
    </View>
  );
};

export default InputSection;

const stylesFunc = StyleSheet.create(props => ({
  container: {
    width: props.type === 'half' ? '48%' : '100%',
  },
  inputSection: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));
