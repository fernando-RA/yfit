import React from 'react';
import {View, TouchableOpacity, Clipboard, StyleSheet} from 'react-native';
import Text from '../Typography/index';
import Toast from 'react-native-simple-toast';
const LinkBoard = props => {
  const copyToClipboard = () => {
    Clipboard.setString(props.text);
    Toast.show('Copied', Toast.SHORT);
  };

  return (
    <View style={styles.linkContainer}>
      <View style={{flex: 1}}>
        <Text bodyRegular>{props.text || ''}</Text>
      </View>
      <TouchableOpacity
        style={styles.copyButton}
        activeOpacity={0.6}
        onPress={copyToClipboard}>
        <Text bodySmall bold>
          COPY
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  copyButton: {
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 11,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#fff',
    marginTop: 17,
  },
});

export default LinkBoard;
