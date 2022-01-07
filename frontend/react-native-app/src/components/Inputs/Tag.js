import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Tag = props => {
  const {name, onPress} = props;
  const localStyles = styles(props);
  return (
    <TouchableOpacity onPress={onPress} style={localStyles.container}>
      <Text style={localStyles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Tag;

const styles = StyleSheet.create(props => ({
  container: {
    borderWidth: 1,
    borderColor: props.selected ? '#5FE487' : '#BDBDBD',
    borderRadius: 24,
    alignSelf: 'center',
    padding: 10,
    minWidth: 78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.selected ? '#5FE487' : 'transparent',
    marginBottom: 14,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    fontWeight: props.selected ? '600' : '400',
  },
}));
