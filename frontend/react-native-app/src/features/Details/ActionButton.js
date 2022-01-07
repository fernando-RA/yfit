import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';

const ActionButton = ({onPress, text, icon}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.row}>
            {icon()}
            <View style={styles.divider} />
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 12,
    height: 50,
    width: 108,
    justifyContent: 'center',
    marginRight: 8,
  },
  row: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  divider: {width: 6},
  text: {
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
  },
});
