import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const WorkoutTypeButton = props => {
  const {name, onPress} = props;
  const localStyles = styles(props);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={localStyles.container}>
        <Text style={localStyles.text}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutTypeButton;

const styles = StyleSheet.create(props => ({
  container: {
    borderWidth: props.selected ? 0 : 1,
    borderColor: '#BDBDBD',
    borderRadius: 24,
    padding: 10,
    minWidth: 78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.selected ? '#5FE487' : 'transparent',
  },
  text: {
    fontWeight: props.selected ? '600' : '400',
  },
}));
