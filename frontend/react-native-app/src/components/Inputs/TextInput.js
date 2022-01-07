import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Typography';

const TextInputCustom = props => {
  const {
    placeholder,
    value,
    label,
    limit,
    onChangeText,
    containerStyles,
    errors,
    ...rest
  } = props;
  return (
    <View style={containerStyles}>
      {label && <Text h3>{label}</Text>}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        multiline
        maxLength={limit || 300}
        onChangeText={onChangeText}
        {...rest}
      />
      {limit && (
        <Text style={styles.reamainingChars}>
          {value.length}/{limit}
        </Text>
      )}
      {errors ? (
        <Text style={styles.errorMessage} bodySmall>
          {errors}
        </Text>
      ) : null}
    </View>
  );
};

export default TextInputCustom;

TextInputCustom.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  limit: PropTypes.number.isRequired,
};

TextInputCustom.defaultProps = {
  value: '',
};

const styles = StyleSheet.create({
  reamainingChars: {
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 19,
    paddingTop: 19,
    borderColor: '#BDBDBD',
    marginTop: 12,
    height: 165,
    borderRadius: 6,
  },
  errorMessage: {
    position: 'absolute',
    bottom: -18,
    left: 3,
    color: '#FB1B1B',
  },
});
